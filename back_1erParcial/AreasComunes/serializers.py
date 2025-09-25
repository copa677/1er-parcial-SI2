from rest_framework import serializers

class CreateAreaComunSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    tipo_area = serializers.CharField(max_length=50)
    ubicacion = serializers.CharField(max_length=200)
    capacidad_maxima = serializers.IntegerField()
    hora_apertura = serializers.TimeField()
    hora_cierre = serializers.TimeField()
    estado = serializers.CharField(max_length=20)
    costo_hora = serializers.DecimalField(max_digits=10, decimal_places=2)
    requiere_reserva = serializers.BooleanField(default=True)
    tiempo_max_reserva = serializers.IntegerField(default=2)
