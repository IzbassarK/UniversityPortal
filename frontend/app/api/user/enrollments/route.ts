import { NextResponse } from "next/server"
import { courses, currentUser } from "@/lib/mock-data"

export async function GET() {
  try {
    const enrolledModulesWithDetails = currentUser.enrolledModules
      .map((moduleId) => {
        // Find the module
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
          return null
        }

        return {
          module: {
            id: foundModule.id,
            code: foundModule.code,
            title: foundModule.title,
            description: foundModule.description,
            instructor: foundModule.instructor,
            startDate: foundModule.startDate,
            endDate: foundModule.endDate,
            schedule: foundModule.schedule,
            location: foundModule.location,
          },
          course: {
            id: foundCourse.id,
            code: foundCourse.code,
            title: foundCourse.title,
            credits: foundCourse.credits,
          },
        }
      })
      .filter(Boolean)

    return NextResponse.json({
      success: true,
      enrollments: enrolledModulesWithDetails,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch enrollments" }, { status: 500 })
  }
}
