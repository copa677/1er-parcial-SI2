from rest_framework import serializers

class AvisosRegistration(serializers.Serializer):
    titulo = serializers.CharField(max_length=200)
    mensaje = serializers.CharField()
    fecha_envio = serializers.DateField()
    hora_envio = serializers.TimeField()
    estado = serializers.CharField(max_length=20)
    tipo = serializers.CharField(max_length=20)
    username = serializers.CharField(required=False, allow_null=True, allow_blank=True)

class AvisosSerializers(serializers.Serializer):
    id_aviso = serializers.IntegerField()
    titulo = serializers.CharField(max_length=200)
    mensaje = serializers.CharField()
    fecha_envio =serializers.DateField()
    hora_envio = serializers.TimeField()
    estado = serializers.CharField(max_length=20)
    tipo = serializers.CharField(max_length=20)
    id_user = serializers.IntegerField()