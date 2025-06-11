import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const search = searchParams.get("search")?.toLowerCase()
    
    let filteredCourses = [...courses]

    // Filter by department if provided
    if (department && department !== "all") {
      filteredCourses = filteredCourses.filter((course) => course.department === department)
    }

    // Filter by search term if provided
    if (search) {
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.code.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search),
      )
    }

    // Return simplified course data (without modules)
    const simplifiedCourses = filteredCourses.map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      department: course.department,
      credits: course.credits,
      image: course.image,
      moduleCount: course.modules.length,
    }))

    return NextResponse.json({
      success: true,
      courses: simplifiedCourses,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch courses" }, { status: 500 })
  }
}
