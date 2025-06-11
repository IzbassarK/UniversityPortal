// API client for the university portal

import { json } from "stream/consumers";

// lib/types.ts
export type Course = {
  id: string;
  title: string;
  code: string;
  credits: number;
  description: string;
  department: string;
  prerequisites?: string[];
  image?: string;
  modules?: Module[];
  syllabus?: string;
  resources?: { name: string; url: string }[];
}

export type Module = {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  schedule: string;
  location: string;
  enrolled: number;
  capacity: number;
}

export type Enrollment = {
  id: string;
  module: {
    id: string;
  };
}
// Auth API
export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    return await response.json()
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Network error occurred" }
  }
}

export async function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    return await response.json()
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Network error occurred" }
  }
}

export async function getUserProfile() {
  try {
    const response = await fetch("/api/user/profile")
    return await response.json()
  } catch (error) {
    console.error("Get profile error:", error)
    return { success: false, message: "Network error occurred" }
  }
}

// Courses API
export async function getCourses() {
  try {
    const url = "http://127.0.0.1:8000/api/courses/"
    const response = await fetch(url)
    const data = await response.json()

    // Ensure it always returns a consistent structure
    return {
      success: data.success ?? true,            // fallback to true if backend doesn't provide
      courses: data.courses ?? data,            // fallback to whole data if backend returns just an array
      message: data.message ?? "",              // fallback to empty message
    }
  } catch (error) {
    console.error("Get courses error:", error)
    return { success: false, courses: [], message: "Network error occurred" }
  }
}


export async function getCourseById(courseId: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}`)
    return await response.json()
  } catch (error) {
    console.error("Get course error:", error)
    return { success: false, message: "Network error occurred" }
  }
}

// Modules API
export async function getModuleById(moduleId: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/modules/${moduleId}`)
    return await response.json()
  } catch (error) {
    console.error("Get module error:", error)
    return { success: false, message: "Network error occurred" }
  }
}

export async function registerForModule(moduleId: string, userId: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/modules/${moduleId}/register/`, {
      method: "POST",
      //credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Request failed" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Module registration error:", error);
    return { success: false, message: "Network error occurred" };
  }
}


// User enrollments API
export async function getUserEnrollments(userId : string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/my_enrollments/`, {
      method: 'POST',
      //credentials: "include",  // Include cookies for session auth
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })

    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Request failed' };
    }
    return {data: data.modules };
  } catch (error) {
    console.error("Get enrollments error:", error);
    return { success: false, message: "Network error occurred" };
  }
}




