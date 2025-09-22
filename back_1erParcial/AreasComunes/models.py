from django.db import models

# Create your models here.
class AreaComun(models.Model):
    id_area = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=200)
    capacidad = models.IntegerField()
    estado = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre