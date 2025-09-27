from django.db import models
from django.utils import timezone
# Create your models here.
class AreaComun(models.Model):
    id_area = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    tipo_area = models.CharField(max_length=50)
    ubicacion = models.CharField(max_length=200)
    capacidad_maxima = models.IntegerField()
    hora_apertura = models.TimeField()
    hora_cierre = models.TimeField()
    estado = models.CharField(max_length=20)
    costo_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    requiere_reserva = models.BooleanField(default=True)
    tiempo_max_reserva = models.IntegerField(default=2)
    
    class Meta:
        db_table = 'areas_comunes'
        managed = False
