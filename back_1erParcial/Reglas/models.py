from django.db import models

# Create your models here.
class Regla(models.Model):
    id_regla = models.AutoField(primary_key=True)
    descripcion = models.TextField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'reglas'
        managed = False