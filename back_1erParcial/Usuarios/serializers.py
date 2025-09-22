# Usuarios/serializers.py
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UsuarioPayloadSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    email = serializers.EmailField()
    tipo_user = serializers.CharField(max_length=50) 
    estado = serializers.CharField(max_length=20, required=False, default='ACTIVO')
    
class PersonalPayloadSerializer(serializers.Serializer):
    nombre_completo = serializers.CharField(max_length=100)
    telefono = serializers.CharField(max_length=20)
    direccion = serializers.CharField(max_length=255)
    fecha_nacimiento = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d'])
    rol = serializers.CharField(max_length=50)

class PropietarioPayloadSerializer(serializers.Serializer):
    nombre_completo = serializers.CharField(max_length=100)
    telefono = serializers.CharField(max_length=20)
    fecha_nacimiento = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d'])
    id_user = serializers.IntegerField()  # FK requerida

class ResidentePayloadSerializer(serializers.Serializer):
    nombre_completo = serializers.CharField(max_length=100)
    telefono = serializers.CharField(max_length=20)
    tipo_residente = serializers.CharField(max_length=50)
    fecha_nacimiento = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d'])
    id_user = serializers.IntegerField()  # FK requerida
    id_propietario = serializers.IntegerField()  # FK requerida