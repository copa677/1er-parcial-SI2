import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login.dart';

class HomePage extends StatelessWidget {
  final String token;
  const HomePage({super.key, required this.token});

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Inicio",
          style: TextStyle(
            color: Colors.white, // ✅ Texto blanco para mejor visibilidad
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.teal, // ✅ Un color más agradable
        iconTheme: const IconThemeData(color: Colors.white), // ✅ Iconos blancos
      ),
      drawer: Drawer(
        child: Column(
          children: [
            DrawerHeader(
              decoration: const BoxDecoration(color: Colors.teal),
              child: Align(
                alignment: Alignment.bottomLeft,
                child: const Text(
                  "Menú Principal",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            // Opciones del menú
            Expanded(
              child: ListView(
                children: [
                  ListTile(
                    leading: const Icon(Icons.home, color: Colors.teal),
                    title: const Text("Inicio"),
                    onTap: () {
                      Navigator.pop(context); // cerrar drawer
                    },
                  ),
                ],
              ),
            ),
            // ✅ Botón de cerrar sesión al final
            const Divider(),
            // ✅ Botón de cerrar sesión al final con fondo
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.red.shade600, // ✅ Fondo rojo fuerte
                  borderRadius: BorderRadius.circular(8),
                ),
                child: ListTile(
                  leading: const Icon(Icons.logout, color: Colors.white),
                  title: const Text(
                    "Cerrar Sesión",
                    style: TextStyle(
                      color: Colors.white, // ✅ Texto blanco
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  onTap: () => _logout(context),
                ),
              ),
            ),
          ],
        ),
      ),
      body: const Center(
        child: Text(
          "Bienvenido al sistema",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
