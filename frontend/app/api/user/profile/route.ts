import { NextResponse } from "next/server"
import { currentUser } from "@/lib/mock-data"

export async function GET() {
  try {
    // In a real app, we would get the user from the session
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
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch user profile" }, { status: 500 })
  }
}
