import { NextResponse } from "next/server"
import { courses, currentUser } from "@/lib/mock-data"

export async function POST(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const moduleId = params.moduleId

    // Find the module
    let foundModule = null
    for (const course of courses) {
      const module = course.modules.find((m) => m.id === moduleId)
      if (module) {
        foundModule = module
        break
      }
    }

    if (!foundModule) {
      return NextResponse.json({ success: false, message: "Module not found" }, { status: 404 })
    }

    // Check if module is full
    if (foundModule.enrolled >= foundModule.capacity) {
      return NextResponse.json({ success: false, message: "Module is full" }, { status: 400 })
    }

    // Check if already enrolled in this module
    if (currentUser.enrolledModules.includes(moduleId)) {
      return NextResponse.json({ success: false, message: "Already enrolled in this module" }, { status: 400 })
    }

    // Add new enrollment
    currentUser.enrolledModules.push(moduleId)

    // Update the enrolled count for the module
    foundModule.enrolled += 1

    return NextResponse.json({
      success: true,
      message: "Successfully registered for module",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to register for module" }, { status: 500 })
  }
}
