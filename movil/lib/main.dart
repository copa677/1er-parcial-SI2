import 'package:flutter/material.dart';
import 'screens/login.dart'; // importamos LoginPage

void main() async {
  WidgetsFlutterBinding.ensureInitialized(); // ⬅️ necesario para inicializar antes de
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Portal Residencial',
      theme: ThemeData(
        primarySwatch: Colors.brown,
        scaffoldBackgroundColor: const Color(0xFFFDF6EC),
      ),
      home: const LoginPage(),
    );
  }
}
