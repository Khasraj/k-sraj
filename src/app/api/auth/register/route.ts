import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, phoneNumber, email, password, role, schoolCode } = await req.json();

    // Validate required fields
    if (!username || !phoneNumber || !password || !role || !schoolCode) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if username or phone number already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { phoneNumber },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username or phone number already exists' },
        { status: 400 }
      );
    }

    // Find school by code
    const school = await prisma.school.findUnique({
      where: { code: schoolCode },
    });

    if (!school) {
      return NextResponse.json(
        { message: 'Invalid school code' },
        { status: 400 }
      );
    }

    // Check if school's subscription is active or in trial
    const now = new Date();
    const isTrialActive = school.trialEndsAt && school.trialEndsAt > now;
    const isSubscriptionActive = school.subscriptionStatus === 'ACTIVE';

    if (!isTrialActive && !isSubscriptionActive) {
      return NextResponse.json(
        { message: 'School subscription has expired' },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with school association
    const user = await prisma.user.create({
      data: {
        username,
        phoneNumber,
        email,
        password: hashedPassword,
        role,
        schoolId: school.id,
      },
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
} 