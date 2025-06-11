from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import os

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
        }

def product_image_upload_to(instance, filename):
    # Если это Product — instance.id
    if isinstance(instance, Product):
        if instance.id:
            return os.path.join('product_images', str(instance.id), filename)
        else:
            return os.path.join('product_images', 'temporary', filename)

    # Если это ProductImage — instance.product.id
    elif isinstance(instance, ProductImage):
        if instance.product and instance.product.id:
            return os.path.join('product_images', str(instance.product.id), filename)
        else:
            return os.path.join('product_images', 'temporary', filename)

    return os.path.join('product_images', 'unknown', filename)
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    sold = models.PositiveIntegerField(default=0)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="test", null=True, blank=True)  # Используем ImageField
    colors = models.JSONField()
    sizes = models.JSONField()
    description = models.TextField(default="test")
    dimensions = models.TextField(default="test")
    materials = models.TextField(default="test")
    in_the_box = models.TextField(default="test")

    def __str__(self):
        return self.name


    

    def get_first_image(self):
        """Возвращает первое изображение из связанных с продуктом ProductImage объектов."""
        first_image = self.images.first()  # Получаем первое изображение, если оно существует
        if first_image:
            return first_image.image.url  # Возвращаем URL изображения
        return None 


    def save(self, *args, **kwargs):
        # if not self.image:
        #     self.image = self.get_first_image()

        if self.discount:  # Проверяем, есть ли скидка
            self.price = self.original_price * (Decimal(1) - Decimal(self.discount) / Decimal(100))
        else:
            self.price = self.original_price  # Если скидки нет, цена остается оригинальной
        super().save(*args, **kwargs)
        if not self.image:
            first_image = self.get_first_image()
            if first_image:
                self.image = first_image
            # Save again if we updated the image
                super().save(*args, **kwargs)


    @property
    def weekly_sold(self):
        one_week_ago = timezone.now() - timedelta(days=7)
        order_items = OrderItem.objects.filter(
            product=self,
            order__created_at__gte=one_week_ago,
            order__status__in=['processing', 'shipped', 'delivered']  # можно ограничить только успешными заказами
        )
        return sum(item.quantity for item in order_items)

    @property
    def image_directory(self):
        """Возвращает директорию, в которой хранится изображение продукта."""
        if self.image:
            return os.path.dirname(self.image.name)  # Путь к директории
        return None

    def to_dict(self):
        """Возвращает данные о продукте с учетом скидки."""
        product_data = {
            "id": self.id,
            "name": self.name,
            "category": self.category.name,
            "price": float(self.price) if self.price is not None else None,
            #"isDiscount": self.discount > 0,
            "image": self.image.url if self.image else None,
            "colors": self.colors,
            "sizes": self.sizes,
            "description": self.description,
            "dimensions": self.dimensions,
            "materials": self.materials,
            "in_the_box": self.in_the_box,
            "quantity": self.quantity,
            "created_at": self.created_at,
            "sold": self.sold,
            "weekly_sold": self.weekly_sold,
            "image_directory": self.image_directory
        }

        if self.discount > 0:
            product_data["originalPrice"] = float(self.original_price)
            product_data["discount"] = self.discount

        return product_data

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=product_image_upload_to, null=True, blank=True)

    def clean(self):
        # Проверяем количество изображений, связанных с продуктом
        if self.product.images.count() >= 4:
            raise ValidationError("A product can have a maximum of 4 images.")

    def save(self, *args, **kwargs):
        self.clean()  # Вызовем чистку перед сохранением
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Image {self.id}"



class Course(models.Model):
    DEPARTMENTS = [
        ('computer_science', 'Computer Science'),
        ('math', 'Maths'),
        ('natural science', 'Natural Science')
    ]
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=35)
    code = models.CharField(max_length=8, unique=True)
    description = models.CharField(max_length=255)
    department = models.CharField(max_length=20, choices=DEPARTMENTS, default='Computer Science')
    credits = models.IntegerField(max_length=2)
    image = models.ImageField(upload_to="test", null=True, blank=True)  # Используем ImageField
    module_count = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.code}: {self.title}"

class Module(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey('Course', related_name='modules', on_delete=models.CASCADE)  # Link back to course
    
    code = models.CharField(max_length=20)
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey('Instructor', related_name='modules', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    capacity = models.PositiveIntegerField()
    enrolled = models.PositiveIntegerField(default=0)
    schedule = models.CharField(max_length=255)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.code}: {self.title}"
    
class Instructor(models.Model):
    DEPARTMENTS = [
        ('computer_science', 'Computer Science'),
        ('math', 'Maths'),
        ('natural science', 'Natural Science')
    ]
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    about = models.CharField(max_length=255)
    department = models.CharField(max_length=50,choices=DEPARTMENTS, default='Computer Science')

    def __str__(self):
        return self.first_name + self.last_name

class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'module')  # Prevent duplicate enrollments

# class Enrollments(models.Model):
#     student_id = models.IntegerField()
#     instructor_id = models.IntegerField()
#     registered_at = models.DateField()
#     module_id = models.ForeignKey('Module', related_name='modules')