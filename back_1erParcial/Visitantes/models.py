from django.db import models

# Create your models here.
class Visitante(models.Model):
    id_visitante = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    fecha_agregacion = models.DateField(auto_now_add=True)
    fecha_visita = models.DateField()
    estado = models.CharField(max_length=20)
    nombre_anfitrion = models.CharField(max_length=100)

    class Meta:
        db_table = 'visitantes'
        managed = False