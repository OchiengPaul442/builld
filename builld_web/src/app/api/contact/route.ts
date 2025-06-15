import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  email: string;
  phoneNumber: string;
  businessStage: string;
  challenge: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phoneNumber, businessStage, challenge }: ContactFormData =
      body;

    // Validate required fields
    if (!email || !phoneNumber || !challenge) {
      return NextResponse.json(
        {
          message: 'All fields are required (email, phoneNumber, challenge)',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: 'Invalid email format',
          status: 400,
        },
        { status: 400 }
      );
    } // Log the contact form submission (in production, you'd save to database or send email)
    console.log('Contact Form Submission:', {
      email,
      phoneNumber,
      businessStage,
      challenge,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json(
      {
        message: "Thank you for your message! We'll get back to you soon.",
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error. Please try again later.',
        status: 500,
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
