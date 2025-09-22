from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.
class  Usuario(models.Model):
    id_user = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=150)
    tipo_user = models.CharField(max_length=50)
    estado = models.CharField(max_length=20)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'usuarios'
        managed = False


class Personal(models.Model):
    id_personal = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField()
    rol = models.CharField(max_length=50)
    id_user = models.IntegerField()

    class Meta:
        db_table = 'personal'
        managed = False

class Propietario(models.Model):
    id_propietario = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    id_user = models.IntegerField()

    class Meta:
        db_table = 'propietario'
        managed = False

class Residente(models.Model):
    id_residente = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    tipo_residente = models.CharField(max_length=50) 
    fecha_nacimiento = models.DateField()
    id_user = models.IntegerField()
    id_propietario = models.IntegerField()

    class Meta:
        db_table = 'residente'
        managed = False
    
