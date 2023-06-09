from django.db import models
import re
from os.path import join

# Create your models here.

class Folder(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

class File(models.Model):
    name = models.CharField(max_length=255, default="File Name")
    parent = models.ForeignKey(Folder, on_delete=models.CASCADE)

    def get_upload_path(self, filename):
        parent = self.parent
        path = []

        while parent is not None:
            path.append(str(parent))
            parent = parent.parent
        
        return f"data/{join(*reversed(path), filename)}"

    file = models.FileField(upload_to=get_upload_path)
    
    
    def path_name(self):
        parent = self.parent
        path = []

        while parent is not None:
            path.append(str(parent))
            parent = parent.parent
        

        return join(*reversed(path) , self.name)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = re.search(r"[^/]+$", str(self.file)).group()
        super().save(*args, **kwargs)
