from django.db import models

# Create your models here.
class Avisos(models.Model):
    id_aviso = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    fecha_envio = models.DateField()
    hora_envio = models.TimeField()
    estado = models.CharField(max_length=20)
    tipo = models.CharField(max_length=20)
    id_user = models.IntegerField()

    class Meta:
        db_table = 'avisos'
        managed = False