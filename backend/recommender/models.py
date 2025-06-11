from django.db import models
from django.apps import apps 
# Create your models here.
User = apps.get_model('accounts', User)
Product = apps.get_model('accounts', Product)
Review = apps.get_model('accounts', Review)
