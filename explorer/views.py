from django.shortcuts import render , HttpResponse
from .models import Folder , File
import re

# Create your views here.

def home(request):



    # print(File.objects.all()[0].file, type(File.objects.all()[0].file))

    # print(re.search(r'[^/]+$', str(File.objects.all()[0].file)).group())

    # # with open(str(File.objects.all()[0].file) , 'r') as f:
    # #     print(f.read()) 

    # print(File.objects.all()[1].parent.parent)

    # print('v',File.objects.all()[1].path_name())

    return HttpResponse('<h1>Hello World</h1>')