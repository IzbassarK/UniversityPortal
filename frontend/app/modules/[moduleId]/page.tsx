"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, notFound, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, CheckCircle, Clock, Info, MapPin, User } from "lucide-react"
import { getModuleById, registerForModule, getUserEnrollments} from "@/lib/api"

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string

  const [module, setModule] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationError, setRegistrationError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // Fetch module details
        const moduleData = await getModuleById(moduleId)

        if (!moduleData || !moduleData.id) {
          notFound()
          return
        }

        setModule(moduleData)

        

      } catch (error) {
        console.error("Error fetching module data:", error)
        setRegistrationError("An error occurred while fetching module data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [moduleId])

  const handleRegister = async () => {
    setIsRegistering(true)
    setRegistrationError("")

    try {
      const userId = localStorage.getItem("user_id");
      console.log(userId);  // This will show the correct user ID
      if (!userId) {
        console.error("User ID not found in localStorage");
        // Handle the error: maybe redirect to login or show a message
        return;
      }
      const response = await registerForModule(moduleId, userId);
      console.log(response);

      
      if (response.success) {
        setRegistrationSuccess(true)

        // Redirect to dashboard afаter successful registration
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setRegistrationError(response.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegistrationError("An error occurred during registration")
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/courses" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Courses
          </Link>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />

              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (!module) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/courses`} className="text-primary hover:underline mb-4 inline-block">
          ← Back to Courses
        </Link>

        {registrationSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Registration Successful!</AlertTitle>
            <AlertDescription className="text-green-700">
              You have successfully registered for this module. Redirecting to your dashboard...
            </AlertDescription>
          </Alert>
        )}

        {registrationError && (
          <Alert variant="destructive" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Registration Failed</AlertTitle>
            <AlertDescription>{registrationError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{module.title}</CardTitle>
                  {isEnrolled && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Enrolled</Badge>}
                </div>
                <CardDescription className="text-lg">{module.code}</CardDescription>
                <div className="mt-1 text-sm text-muted-foreground">Course ID: {module.courseId}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{module.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Module Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Instructor:</span>
                    <span>
                      {module.instructor.first_name} {module.instructor.last_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Schedule:</span>
                    <span>{module.schedule}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span>{module.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dates:</span>
                    <span>
                      {module.startDate} to {module.endDate}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Capacity:</span>{" "}
                    <span className={module.enrolled >= module.capacity ? "text-red-500" : ""}>
                      {module.enrolled}/{module.capacity}
                    </span>
                  </div>
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${module.enrolled >= module.capacity ? "bg-red-500" : "bg-primary"}`}
                      style={{ width: `${(module.enrolled / module.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            {!isEnrolled ? (
              <Button
                className="w-full sm:w-auto"
                disabled={module.enrolled >= module.capacity || isRegistering}
                onClick={handleRegister}
              >
                {isRegistering
                  ? "Processing..."
                  : module.enrolled >= module.capacity
                    ? "Module Full"
                    : "Register for Module"}
              </Button>
            ) : (
              <Button variant="outline" className="w-full sm:w-auto">
                Drop Module
              </Button>
            )}
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      
    </div>
  )
}
