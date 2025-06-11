import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero section with full-page background image */}
      <div className="relative min-h-screen w-full">
        {/* Background image */}
        <Image src="/images/university-campus.png" alt="University Campus" fill className="object-cover z-0" priority />

        {/* Transparent overlay - 30% opacity (70% transparent) */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white font-extrabold">
            Welcome to <span className="text-white font-extrabold">University Portal</span>
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl font-bold">
            Your gateway to academic excellence. Access courses, register for modules, and manage your academic journey.
          </p>

          {/* <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div> */}
          <div className="mt-10">
            <Button asChild size="lg" className="bg-white text-black font-bold hover:bg-gray-200">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>

        </div>
      </div>

      {/* Features section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Diverse Courses</CardTitle>
              <CardDescription>Explore our wide range of academic programs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Choose from hundreds of courses across various disciplines designed to prepare you for your future
                career.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expert Faculty</CardTitle>
              <CardDescription>Learn from industry leaders and researchers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our professors bring real-world experience and cutting-edge research into the classroom.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flexible Learning</CardTitle>
              <CardDescription>Study at your own pace</CardDescription>
            </CardHeader>
            <CardContent>
              <p>With both online and in-person options, you can create a schedule that works for your life.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
