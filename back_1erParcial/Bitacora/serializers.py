from rest_framework import serializers

class RegistroBitacora (serializers.Serializer):
    ip = serializers.CharField()
    fecha_hora = serializers.DateTimeField()
    descripcion = serializers.CharField()

class serializerBitacora (serializers.Serializer):
    ip = serializers.IntegerField()
    ip = serializers.CharField()
    fecha_hora = serializers.DateTimeField()
    descripcion = serializers.CharField()