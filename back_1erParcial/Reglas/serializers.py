from rest_framework import serializers

class ReglaSerializer(serializers.Serializer):
    descripcion = serializers.CharField(max_length=255)
    monto = serializers.DecimalField(max_digits=10, decimal_places=2)