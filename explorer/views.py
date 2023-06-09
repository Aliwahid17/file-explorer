from django.shortcuts import render
from django.http import JsonResponse
from .models import Folder, File
import re
from json import dumps, loads

# Create your views here.


def home(request):

  
    if request.method == "POST":
        content = loads(request.body)
        selected_Folder = content["folder"]

        folder_dict = {}

        try:

            folder_dict = {
                folder: {
                    "file": [
                        file.name
                        for file in File.objects.filter(
                            parent=Folder.objects.get(name=folder).pk
                        )
                    ],
                    "path" : [str(file.file)[4:]
                        for file in File.objects.filter(
                            parent=Folder.objects.get(name=folder).pk
                        )]
                }
                for folder in selected_Folder.split(",")
            }

            print(folder_dict)
            return JsonResponse(folder_dict)
    
        except:

            return JsonResponse(folder_dict)

    folder_data = {
        str(folder.pk): {
            "name": folder.name,
            "parent": "" if folder.parent is None else str(folder.parent.pk),
            "files": 0
            if folder.parent is None
            else File.objects.filter(parent=folder.parent.pk).count(),
        }
        for folder in Folder.objects.all()
    }

    data_json = dumps(folder_data)

    return render(
        request,
        "routes/index.html",
        context={"data_json": data_json},
    )
