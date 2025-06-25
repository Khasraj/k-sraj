import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { school, admin } = await req.json();

    // Validate required fields
    if (!school.name || !school.code || !school.address || !school.county) {
      return NextResponse.json(
        { message: 'All school fields are required' },
        { status: 400 }
      );
    }

    if (!admin.username || !admin.phoneNumber || !admin.password) {
      return NextResponse.json(
        { message: 'All administrator fields are required' },
        { status: 400 }
      );
    }

    // Check if school code already exists
    const existingSchool = await prisma.school.findUnique({
      where: { code: school.code },
    });

    if (existingSchool) {
      return NextResponse.json(
        { message: 'School code already exists' },
        { status: 400 }
      );
    }

    // Check if admin username or phone number already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { username: admin.username },
          { phoneNumber: admin.phoneNumber },
        ],
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Username or phone number already exists' },
        { status: 400 }
      );
    }

    // Create school and admin in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create school
      const newSchool = await tx.school.create({
        data: {
          name: school.name,
          code: school.code,
          address: school.address,
          county: school.county,
          // Set trial period for 30 days
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      // Hash password
      const hashedPassword = await hash(admin.password, 12);

      // Create admin user
      const newAdmin = await tx.user.create({
        data: {
          username: admin.username,
          phoneNumber: admin.phoneNumber,
          email: admin.email,
          password: hashedPassword,
          role: 'ADMIN',
          schoolId: newSchool.id,
        },
      });

      return { school: newSchool, admin: newAdmin };
    });

    // Return success without sensitive data
    return NextResponse.json({
      message: 'School and administrator registered successfully',
      school: {
        id: result.school.id,
        name: result.school.name,
        code: result.school.code,
      },
    });
  } catch (error) {
    console.error('School registration error:', error);
    return NextResponse.json(
      { message: 'Error registering school' },
      { status: 500 }
    );
  }
} 