import { NextResponse } from "next/server"
import { currentUser } from "@/lib/mock-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate authentication
    if (email === "student@university.edu" && password === "password") {
      return NextResponse.json({
        success: true,
        user: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          role: currentUser.role,
        },
      })
    }

    // Authentication failed
    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
