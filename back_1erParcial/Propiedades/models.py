from django.db import models

# Create your models here.
class Propiedad(models.Model):
    id_propiedad = models.AutoField(primary_key=True)
    tipo_propiedad = models.CharField(max_length=50)
    numero = models.CharField(max_length=20)
    direccion = models.CharField(max_length=200)
    metros_cuadrados = models.FloatField()
    estado = models.CharField(max_length=20)
    id_propietario = models.IntegerField()

    class Meta:
        db_table = 'propiedad'
        managed = False