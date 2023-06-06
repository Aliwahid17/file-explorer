from django.shortcuts import render
from .models import Folder , File
import re

# Create your views here.

def home(request):

    return render(request,'routes/index.html')