from django.db import models

# Create your models here.
class vehiculo(models.Model):
    id_vehiculo = models.AutoField(primary_key=True)
    placa = models.CharField(max_length=20, unique=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    propietario_vehiculo = models.CharField(max_length=100)

    class Meta:
        db_table = 'vehiculo'
        managed = False