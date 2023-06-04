from django.db import models

# Create your models here.

class Folder(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

class File(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(Folder, on_delete=models.CASCADE)


# root_folder = Folder.objects.create(name='root')
# sub_folder = Folder.objects.create(name='subfolder', parent=root_folder)
