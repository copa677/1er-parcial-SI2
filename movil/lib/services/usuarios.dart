import 'package:http/http.dart' as http;
import 'dart:convert';
import '../constants.dart';
import 'package:flutter/foundation.dart'; // <-- para usar debugPrint

class AuthService {
  // Login
  Future<String?> login(String username, String password) async {
    final url = Uri.parse('$baseUrl/usuarios/login_residente_propietario');

    final datos = {'username': username, 'password': password};
    debugPrint('Enviando datos de login: $datos');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(datos),
    );
    debugPrint('Respuesta del servidor login: ${response.statusCode}');
    debugPrint('Cuerpo de la respuesta login: ${response.body}');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token']; // 🔥 devuelve el token
    } else {
      return null;
    }
  }
}
