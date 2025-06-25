import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { Body: { stkCallback } } = data;

    // Find the transaction
    const transaction = await prisma.mpesaTransaction.findFirst({
      where: {
        checkoutRequestId: stkCallback.CheckoutRequestID,
      },
      include: {
        school: true,
      },
    });

    if (!transaction) {
      console.error('Transaction not found:', stkCallback.CheckoutRequestID);
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Update transaction status
    const resultCode = stkCallback.ResultCode;
    const status = resultCode === 0 ? 'COMPLETED' : 'FAILED';

    await prisma.$transaction(async (tx) => {
      // Update transaction
      await tx.mpesaTransaction.update({
        where: { id: transaction.id },
        data: {
          status,
          resultCode: String(resultCode),
          resultDesc: stkCallback.ResultDesc,
          ...(status === 'COMPLETED' && {
            receiptNumber: stkCallback.CallbackMetadata?.Item?.find(
              (item: any) => item.Name === 'MpesaReceiptNumber'
            )?.Value,
          }),
        },
      });

      // If payment successful, update school subscription
      if (status === 'COMPLETED') {
        const amount = transaction.amount;
        let months = 1;
        let tier = transaction.school.subscriptionTier;

        // Determine subscription duration and tier based on amount
        if (amount === 2000) {
          tier = 'BASIC';
          months = 1;
        } else if (amount === 5000) {
          tier = 'PREMIUM';
          months = 1;
        } else if (amount === 10000) {
          tier = 'ENTERPRISE';
          months = 1;
        } else if (amount === 20000) {
          tier = 'BASIC';
          months = 12;
        } else if (amount === 50000) {
          tier = 'PREMIUM';
          months = 12;
        } else if (amount === 100000) {
          tier = 'ENTERPRISE';
          months = 12;
        }

        // Calculate new subscription end date
        const currentPeriodEnds = transaction.school.currentPeriodEnds || new Date();
        const newPeriodEnds = new Date(currentPeriodEnds);
        newPeriodEnds.setMonth(newPeriodEnds.getMonth() + months);

        // Update school subscription
        await tx.school.update({
          where: { id: transaction.school.id },
          data: {
            subscriptionTier: tier,
            subscriptionStatus: 'ACTIVE',
            currentPeriodEnds: newPeriodEnds,
          },
        });
      }
    });

    return NextResponse.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return NextResponse.json(
      { message: 'Error processing callback' },
      { status: 500 }
    );
  }
} 