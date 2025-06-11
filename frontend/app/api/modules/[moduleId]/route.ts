import { NextResponse } from "next/server"
import { courses } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const moduleId = params.moduleId

    // Find the module in all courses
    let foundModule = null
    let foundCourse = null

    for (const course of courses) {
      const module = course.modules.find((m) => m.id === moduleId)
      if (module) {
        foundModule = module
        foundCourse = course
        break
      }
    }

    if (!foundModule || !foundCourse) {
      return NextResponse.json({ success: false, message: "Module not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      module: foundModule,
      course: {
        id: foundCourse.id,
        code: foundCourse.code,
        title: foundCourse.title,
        credits: foundCourse.credits,
        department: foundCourse.department,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch module details" }, { status: 500 })
  }
}
