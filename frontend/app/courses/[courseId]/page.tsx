"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, MapPin, User } from "lucide-react"
import { getCourseById } from "@/lib/api"

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError("")

      try {
        const courseResponse = await getCourseById(courseId)

        if (!courseResponse || courseResponse.detail === "Not found.") {
          setError("Course not found")
          return
        }

        setCourse(courseResponse)
      } catch (error) {
        console.error("Error fetching course data:", error)
        setError("An error occurred while fetching course data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  if (error === "Course not found") {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/courses" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-64 md:h-auto md:w-1/3 rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="md:w-2/3">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>
        <div className="mt-4">
          <Button asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/courses" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Courses
        </Link>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative h-64 md:h-auto md:w-1/3 rounded-lg overflow-hidden">
            <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
          </div>
          <div className="md:w-2/3">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                <p className="text-muted-foreground">{course.code}</p>
              </div>
              <Badge variant="outline" className="px-3 py-1 text-base">
                {course.credits} Credits
              </Badge>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Department</h2>
              <p className="text-muted-foreground">{course.department}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="modules" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="modules">Modules ({course.modules?.length || 0})</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="mt-6">
          {course.modules && course.modules.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {course.modules.map((module: any) => (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                    <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Instructor:</span>
                    <span>{module.instructor?.first_name} {module.instructor?.last_name}</span>
                  </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Schedule:</span>
                        <span>{module.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location:</span>
                        <span>{module.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/modules/${module.id}`}>View Module Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No modules found for this course.</p>
          )}
        </TabsContent>
        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
              <CardDescription>Detailed information about the course structure and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Syllabus content goes here...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>Supporting resources and materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Resources content goes here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
