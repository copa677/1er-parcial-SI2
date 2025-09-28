import 'package:flutter/material.dart';
import '../services/usuarios.dart'; // Importa tu AuthService
import 'home.dart'; // para navegar después del login
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _loading = false;

  Future<void> _login() async {
    setState(() => _loading = true);
    final token = await _authService.login(
      _usernameController.text.trim(),
      _passwordController.text.trim(),
    );
    setState(() => _loading = false);

    if (token != null) {
      // Guardar token en memoria local
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);

      // Navegar a HomePage
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomePage(token: token)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Usuario o contraseña incorrectos")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Image.asset('assets/images/logo-condominio.jpg', height: 100),
              const SizedBox(height: 20),

              // Título principal
              const Text(
                'Portal Residencial',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 30),

              // Card con formulario
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Iniciar Sesión',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Ingresa tus credenciales para acceder',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.black54),
                      ),
                      const SizedBox(height: 20),

                      // Usuario
                      TextField(
                        controller: _usernameController,
                        decoration: const InputDecoration(
                          labelText: 'Nombre de Usuario',
                          hintText: 'Ingresa tu usuario',
                          border: OutlineInputBorder(),
                          filled: true,
                          fillColor: Color(0xFFF7F5F2),
                        ),
                      ),
                      const SizedBox(height: 15),

                      // Contraseña
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Contraseña',
                          hintText: 'Ingresa tu contraseña',
                          border: OutlineInputBorder(),
                          filled: true,
                          fillColor: Color(0xFFF7F5F2),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Botón
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.brown,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onPressed: _loading ? null : _login,
                        child: _loading
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : const Text(
                                'Iniciar Sesión',
                                style: TextStyle(fontSize: 16),
                              ),
                      ),
                      const SizedBox(height: 15),

                      // Olvidaste contraseña
                      TextButton(
                        onPressed: () {},
                        child: const Text('¿Olvidaste tu contraseña?'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // Footer
              const Text(
                '© 2025 Portal Residencial. Todos los derechos reservados.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.black54, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
