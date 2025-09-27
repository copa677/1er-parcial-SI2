from django.db import models

# Create your models here.
class Bitacora (models.Model):
    id_bitacora = models.AutoField(primary_key=True)
    ip = models.CharField(max_length=45)
    fecha_hora = models.DateTimeField()
    descripcion = models.TextField()

    class Meta :
        db_table = 'bitacora'
        managed = False