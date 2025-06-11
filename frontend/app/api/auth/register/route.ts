import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password } = body

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    // Validate phone format (10 digits)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json({ success: false, message: "Invalid phone number format" }, { status: 400 })
    }

    // Check if email already exists (in a real app, this would check the database)
    if (email === "student@university.edu") {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 })
    }

    // In a real app, we would:
    // 1. Hash the password
    // 2. Create a new user in the database
    // 3. Send a verification email

    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: "new-user-id",
        firstName,
        lastName,
        email,
        phone,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during registration" }, { status: 500 })
  }
}
