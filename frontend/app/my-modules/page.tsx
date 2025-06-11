"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, User, Users } from "lucide-react"
import { getUserEnrollments } from "@/lib/api"

export default function MyModulesPage() {
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

        // Log the raw response to see exactly what we're getting
        console.log("Raw API Response:", response)
        console.log("Response type:", typeof response)
        console.log("Response keys:", Object.keys(response || {}))

        // Handle different possible response formats
        let modules: any[] = []

        // The actual response format: {data: [...]}
        if (response && Array.isArray(response.data)) {
          console.log("Found modules in response.data array")
          modules = response.data
        }
        // Fallback: Direct response with modules array
        else if (response && Array.isArray(response.modules)) {
          console.log("Found modules array directly")
          modules = response.modules
        }
        // Fallback: Response nested under data.modules
        else if (response && response.data && Array.isArray(response.data.modules)) {
          console.log("Found modules under data.modules")
          modules = response.data.modules
        }
        // Fallback: Response is directly an array
        else if (Array.isArray(response)) {
          console.log("Response is directly an array")
          modules = response
        }
        // Error handling
        else {
          console.log("Unexpected response format")
          console.log("Full response object:", JSON.stringify(response, null, 2))
          setError("Unexpected response format from server")
          setIsLoading(false)
          return
        }

        console.log("Final modules array:", modules)
        console.log("Modules count:", modules.length)

        setEnrolledModules(modules)
      } catch (error) {
        console.error("Error in fetchEnrollments:", error)
        setError("An error occurred while fetching your enrollments")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Modules</h1>
          <p className="text-muted-foreground">Manage your enrolled modules</p>
        </div>
        <Button asChild>
          <Link href="/courses">Browse More Courses</Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Debug Info</summary>
            <p className="text-xs mt-1">Check the browser console for detailed response information.</p>
          </details>
        </div>
      )}

      <Tabs defaultValue="current">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="current">Current Modules</TabsTrigger>
          <TabsTrigger value="completed">Completed Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((id) => (
                <Card key={id}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : enrolledModules.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{module.title}</CardTitle>
                        <CardDescription>{module.code}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Enrolled</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{module.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Instructor:</span>
                          <span>
                            {module.instructor?.first_name} {module.instructor?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Dates:</span>
                          <span>
                            {module.startDate} to {module.endDate}
                          </span>
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
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Capacity:</span>
                          <span>
                            {module.enrolled}/{module.capacity} enrolled
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/modules/${module.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Drop Module
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="text-center space-y-4">
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
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardContent className="py-10">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">No Completed Modules</h3>
                <p className="text-sm text-muted-foreground">
                  Completed modules will appear here once you finish them.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
