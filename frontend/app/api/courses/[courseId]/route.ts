import { NextResponse } from "next/server"
import { getCourses } from "@/lib/api";
// Sample courses data (temporary, replace with real DB call later)
const courses = getCourses()

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}
