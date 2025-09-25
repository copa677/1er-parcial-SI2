from rest_framework import serializers

class MascotaRegistroSerializer(serializers.Serializer):
    especie = serializers.CharField(max_length=50)
    raza = serializers.CharField(max_length=50)
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    sexo = serializers.CharField(max_length=10)

    # Se aceptará solo uno de estos campos
    nombre_propietario = serializers.CharField(max_length=150, required=False, allow_blank=True)
    nombre_residente = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate(self, data):
        nombre_propietario = data.get('nombre_propietario', '').strip()
        nombre_residente = data.get('nombre_residente', '').strip()

        if not nombre_propietario and not nombre_residente:
            raise serializers.ValidationError("Debe proporcionar al menos el nombre del propietario o del residente.")

        if nombre_propietario and nombre_residente:
            raise serializers.ValidationError("No puede proporcionar ambos campos. Solo uno: propietario o residente.")

        return data
