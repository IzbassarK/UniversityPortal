"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type UserData = {
  id: string
  email: string
  first_name: string
  last_name: string
}

export default function ProfilePage() {
  const { user } = useAuth()

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "123-456-7890",
  })

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user")
      if (userDataString) {
        const userData: UserData = JSON.parse(userDataString)
        setProfileData({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || "",
          phone: "123-456-7890", // still static here
        })
      } else if (user) {
        setProfileData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: "",
        })
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error)
    }
  }, [user])

  if (!user && !profileData.email) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">Please log in to view your profile</h3>
              <Button asChild>
                <a href="/auth/login">Login</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="flex items-center border rounded-md pl-3 bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="flex items-center border rounded-md pl-3 bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center border rounded-md pl-3 bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center border rounded-md pl-3 bg-muted/50">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    readOnly
                    disabled
                  />
                </div>
              </div> */}
            </div>

            {/* <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Your account information is managed by the system administrator. If you need to update any information,
                please contact support.
              </p>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
