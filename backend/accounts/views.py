from django.core.mail import send_mail
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, parser_classes
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.http import require_GET, require_POST

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def get_user_details(request):
    print("Получен запрос от:", request.user)  
    if not request.user.is_authenticated:
        return Response({"error": "Пользователь не авторизован"}, status=401)

    return Response({
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "username": request.user.username
    })

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_details(request, username):  
    try:
        user = User.objects.get(username=username)  
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method in ["PUT", "PATCH"]:
        data = request.data
        print("Полученные данные:", request.data)
        user.first_name = data.get("firstName", user.first_name)
        user.last_name = data.get("lastName", user.last_name)
        user.email = data.get("email", user.email)

        user.save()

        return Response({
            "message": "User details updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            user = User.objects.filter(email=email).first()
            if user is None:
                return JsonResponse({"error": "User not found"}, status=404)

            auth_user = authenticate(username=user.username, password=password)
            if auth_user is None:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

            tokens = get_tokens_for_user(auth_user)  
            user_data = {
                "id": auth_user.id,
                "email": auth_user.email,
                "first_name": auth_user.first_name,
                "last_name": auth_user.last_name,
               
            }
            print("Отправляем токены:", tokens) 

            return JsonResponse({
                "message": "Login successful",
                "user": user_data,
                "tokens": tokens
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            username = data.get("username") or f"user_{User.objects.count() + 1}"

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "User already exists"}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", "")
            )

            # ✅ Логиним пользователя в сессии Django
            login(request, user)

            # ✅ Генерируем JWT токены
            tokens = get_tokens_for_user(user)

            user_data = {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                # Add profile image URL if stored (optional):
                # "profile_image": user.profile.image.url if hasattr(user, 'profile') and user.profile.image else None
            }
            # ✅ Возвращаем всю инфу о пользователе
            return JsonResponse({
                "message": "User created successfully",
                "user": user_data ,
                "tokens": tokens
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)

@api_view(["GET"])
def get_courses(request): 
    courses = Course.objects.all()

    # Создаем список продуктов с первой картинкой
    courses_data = []
    for course in courses:
        # Получаем первое изображение для каждого продукта
        first_image = course.image  # Берем первое изображение, если оно существует
        image_url = first_image.image.url if first_image else None  # Получаем URL изображения или None

        # Get modules for this course
        modules_data = []
        for module in course.modules.all():
            modules_data.append({
                "id": module.id,
                "courseId": module.course.id,
                "code": module.code,
                "title": module.title,
                "description": module.description,
                "instructor": {
                    "id": module.instructor.id,
                    "first_name": module.instructor.first_name,
                    "last_name": module.instructor.last_name,
                    "department": module.instructor.department
                },
                "startDate": module.start_date.isoformat(),
                "endDate": module.end_date.isoformat(),
                "capacity": module.capacity,
                "enrolled": module.enrolled,
                "schedule": module.schedule,
                "location": module.location,
            })


        # Добавляем информацию о продукте с изображением
        courses_data.append({
            "id": course.id,
            "code":course.code,
            "title": course.title,
            "description": course.description,
            "department": course.department,
            "credits": course.credits,
            "image": image_url,
            "module_count": course.module_count,
            "modules": modules_data
        })

    return JsonResponse(courses_data, safe=False)

@api_view(["GET"])
def get_instructors(request):
    instructors = Instructor.objects.all()

    # Создаем список продуктов с первой картинкой
    instructors_data = []
    for instruct in instructors:    
        # Get modules for this instructor
        modules_data = []
        for module in instruct.modules.all():
            modules_data.append({
                "id": module.id,
                "courseId": module.course.id,
                "code": module.code,
                "title": module.title,
                "description": module.description,
                "instructor": {
                    "id": module.instructor.id,
                    "first_name": module.instructor.first_name,
                    "last_name": module.instructor.last_name,
                    "department": module.instructor.department
                },
                "startDate": module.start_date.isoformat(),
                "endDate": module.end_date.isoformat(),
                "capacity": module.capacity,
                "enrolled": module.enrolled,
                "schedule": module.schedule,
                "location": module.location,
            })

        # Добавляем информацию о продукте с изображением
        instructors_data.append({
            "id": instruct.id,
            "first_name":instruct.first_name,
            "last_name": instruct.last_name,
            "about": instruct.about,
            "department": instruct.department,
            "modules": modules_data
        })

    return JsonResponse(instructors_data, safe=False)

@api_view(["GET"])
@csrf_exempt
def get_course_details(request, course_id):
    course = get_object_or_404(Course, id=course_id)

 
    course_data = {
        "id": course.id,
        "code": course.code,
        "title": course.title,
        "description": course.description,
        "department": course.department,
        "credits": course.credits,
        "module_count": course.module_count,
        "modules": []
    }

    for module in course.modules.all():
        module_data = {
            "id": module.id,
            "courseId": module.course.id,
            "code": module.code,
            "title": module.title,
            "description": module.description,
            "instructor": {
                "id": module.instructor.id,
                "first_name": module.instructor.first_name,
                "last_name": module.instructor.last_name,
                "department": module.instructor.department
            },
            "startDate": module.start_date.isoformat(),
            "endDate": module.end_date.isoformat(),
            "capacity": module.capacity,
            "enrolled": module.enrolled,
            "schedule": module.schedule,
            "location": module.location,
        }
        course_data["modules"].append(module_data)

    return JsonResponse(course_data, safe=False)

@api_view(["GET"])
@csrf_exempt
def get_module_details(request, module_id):
        module = get_object_or_404(Module, id=module_id)
        
        module_data = {
            "id": module.id,
            "courseId": module.course.id,
            "code": module.code,
            "title": module.title,
            "description": module.description,
            "course":{
                "id": module.course.id,
            },
            "instructor": {
                "id": module.instructor.id,
                "first_name": module.instructor.first_name,
                "last_name": module.instructor.last_name,
            },
            "startDate": module.start_date.isoformat(),
            "endDate": module.end_date.isoformat(),
            "capacity": module.capacity,
            "enrolled": module.enrolled,
            "schedule": module.schedule,
            "location": module.location,
        }
        
        return JsonResponse(module_data)


@api_view(["POST"])
def get_enrolls(request):
    data = json.loads(request.body)
    user_id = data.get("userId")
    enrollments = Enrollment.objects.filter(user=user_id).select_related('module', 'module__course', 'module__instructor')

    modules_data = []
    for enrollment in enrollments:
        module = enrollment.module
        modules_data.append({
            "id": module.id,
            "courseId": module.course.id,
            "code": module.code,
            "title": module.title,
            "description": module.description,
            "instructor": {
                "id": module.instructor.id,
                "first_name": module.instructor.first_name,
                "last_name": module.instructor.last_name,
            },
            "startDate": module.start_date.isoformat(),
            "endDate": module.end_date.isoformat(),
            "capacity": module.capacity,
            "enrolled": module.enrolled,
            "schedule": module.schedule,
            "location": module.location,
        })

    return JsonResponse({"success": True, "modules": modules_data})

@api_view(["POST"])
def register_module(request, module_id):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    user_id = data.get("userId")
    if not user_id:
        return JsonResponse({'success': False, 'message': 'Missing userId.'}, status=400)

    # Convert to int safely
    try:
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({'success': False, 'message': 'Invalid userId format.'}, status=400)

    module = get_object_or_404(Module, id=module_id)
    user = get_object_or_404(User, id=user_id)

    # Check module capacity
    if module.enrolled >= module.capacity:
        return JsonResponse({'success': False, 'message': 'Module is full. Cannot enroll.'}, status=400)

    # Check for duplicate enrollment
    if Enrollment.objects.filter(user=user, module=module).exists():
        return JsonResponse({'success': False, 'message': 'You are already enrolled in this module.'}, status=400)

    # Create enrollment and update module capacity
    Enrollment.objects.create(user=user, module=module)
    module.enrolled += 1
    module.save()
    print(user_id, module_id)
    return JsonResponse({'success': True, 'message': f'Enrolled in module {module.title} successfully.'}, status=201)


