from django.db import models

# Create your models here.
class Mascota(models.Model):
    id_mascota = models.AutoField(primary_key=True)
    especie = models.CharField(max_length=50)
    raza = models.CharField(max_length=50)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=10)
    dueno = models.CharField(max_length=100)

    class Meta:
        db_table = 'mascota'
        managed = False