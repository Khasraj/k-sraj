import { NextResponse } from 'next/server';
import { getMpesaClient } from '@/lib/mpesa';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const SUBSCRIPTION_PRICES = {
  BASIC: 2000, // KES 2,000 per month
  PREMIUM: 5000, // KES 5,000 per month
  ENTERPRISE: 10000, // KES 10,000 per month
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { tier, months = 1 } = await req.json();

    // Validate subscription tier
    if (!SUBSCRIPTION_PRICES[tier]) {
      return NextResponse.json(
        { message: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get user's school
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true },
    });

    if (!user?.school) {
      return NextResponse.json(
        { message: 'No school associated with user' },
        { status: 400 }
      );
    }

    const amount = SUBSCRIPTION_PRICES[tier] * months;
    const mpesa = getMpesaClient();

    // Create pending transaction record
    const transaction = await prisma.mpesaTransaction.create({
      data: {
        schoolId: user.school.id,
        amount,
        phoneNumber: user.phoneNumber,
        status: 'PENDING',
      },
    });

    // Initiate STK push
    const stkResponse = await mpesa.initiateSTKPush(
      user.phoneNumber,
      amount,
      `SUB${user.school.code}`
    );

    // Update transaction with M-Pesa request IDs
    await prisma.mpesaTransaction.update({
      where: { id: transaction.id },
      data: {
        merchantRequestId: stkResponse.MerchantRequestID,
        checkoutRequestId: stkResponse.CheckoutRequestID,
      },
    });

    return NextResponse.json({
      message: 'Payment initiated',
      checkoutRequestId: stkResponse.CheckoutRequestID,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { message: 'Error initiating payment' },
      { status: 500 }
    );
  }
} 