"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Users } from "lucide-react"
import { getUserEnrollments } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrolledModules, setEnrolledModules] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true)
      setError("")

      try {
        const userId = localStorage.getItem("user_id")
        if (!userId) {
          setError("User ID not found. Please log in again.")
          setIsLoading(false)
          return
        }

        console.log("Fetching enrollments for user:", userId)
        const response = await getUserEnrollments(userId)

        console.log("Dashboard API Response:", response)

        // Handle the response format: {data: [...]}
        let modules: any[] = []

        if (response && Array.isArray(response.data)) {
          console.log("Found modules in response.data array")
          modules = response.data
        }
        // Fallback for other possible formats
        else if (response && response.success && Array.isArray(response.enrollments)) {
          console.log("Found modules in response.enrollments")
          modules = response.enrollments
        } else if (response && Array.isArray(response.modules)) {
          console.log("Found modules array directly")
          modules = response.modules
        } else if (Array.isArray(response)) {
          console.log("Response is directly an array")
          modules = response
        } else {
          console.log("Unexpected response format")
          setError("Unexpected response format from server")
          setIsLoading(false)
          return
        }

        console.log("Dashboard modules:", modules)
        setEnrolledModules(modules)
      } catch (error) {
        console.error("Error fetching enrollments:", error)
        setError("An error occurred while fetching your enrollments")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  // Calculate total enrolled people across all modules (classmates)
  const totalClassmates = enrolledModules.reduce((total, module) => {
    // For each module, subtract 1 from enrolled count to exclude the user
    return total + Math.max(0, (module.enrolled || 0) - 1)
  }, 0)

  // Calculate total modules enrolled
  const totalModulesEnrolled = enrolledModules.length

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-8 w-48 mb-4" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>

      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModulesEnrolled}</div>
            <p className="text-xs text-muted-foreground">
              {totalModulesEnrolled > 0 ? "Currently active" : "No modules enrolled"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classmates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClassmates}</div>
            <p className="text-xs text-muted-foreground">Across all modules</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-4">Your Enrolled Modules</h2>

      {enrolledModules.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledModules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span>
                      {module.instructor?.first_name} {module.instructor?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span>{module.schedule}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{module.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enrolled:</span>
                    <span>
                      {module.enrolled}/{module.capacity}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>
                      {module.startDate} to {module.endDate}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/modules/${module.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Modules Enrolled</h3>
              <p className="text-sm text-muted-foreground">
                You haven&apos;t enrolled in any modules yet. Browse available courses to get started.
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
