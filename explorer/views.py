from django.shortcuts import render
from django.http import JsonResponse
from json import loads
from .file import get_max_depth , get_folder

# Create your views here.

# Root Dictory Config 
path = "D:\\freelance\\file-filter-app\\dummy_folder"

def home(request):

  
    if request.method == "POST":
        content = loads(request.body)

        try:
            selected_level = content['level']
            folder = get_folder( selected_level , path)
            return JsonResponse(folder)
        except :
            print("No Level")

        try:
            selected_path = content['path']
            for i in selected_path:
                print(i)
        except:
            print("No Path")


    data = {
        'level' : range(1 , get_max_depth(path) + 1)
    }

    return render(
        request,
        "routes/index.html",
        context={'data' : data},
    )
