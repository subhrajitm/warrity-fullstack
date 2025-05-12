import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/warranty.dart';
import '../models/product.dart';
import '../models/auth.dart';
import '../models/dashboard_stats.dart';

class ApiService {
  // Update this to your actual API server address
  static const String baseUrl = 'http://10.0.2.2:3000/api'; // For Android Emulator
  // static const String baseUrl = 'http://127.0.0.1:3000/api'; // For iOS Simulator
  final SharedPreferences _prefs;
  String? _token;

  ApiService(this._prefs) {
    _token = _prefs.getString('token');
  }

  String? get token => _token;
  bool get isAuthenticated => _token != null;

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  // Auth API calls
  Future<void> login(String email, String password) async {
    try {
      print('Attempting to login with email: $email');
      print('API URL: $baseUrl/auth/login');
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      print('Response status: ${response.statusCode}');
      print('Response headers: ${response.headers}');
      print('Response body: ${response.body}');

      if (response.body.isEmpty) {
        throw Exception('Empty response received from server');
      }

      if (response.statusCode == 200) {
        try {
          final data = jsonDecode(response.body);
          _token = data['token'];
          await _prefs.setString('token', _token!);
        } catch (e) {
          print('Error parsing response: $e');
          throw Exception('Invalid response format from server');
        }
      } else {
        try {
          final errorData = jsonDecode(response.body);
          throw Exception(errorData['message'] ?? 'Login failed with status ${response.statusCode}');
        } catch (e) {
          print('Error parsing error response: $e');
          throw Exception('Login failed with status ${response.statusCode}');
        }
      }
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  Future<void> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _headers,
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      _token = data['token'];
      await _prefs.setString('token', _token!);
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Registration failed');
    }
  }

  Future<User> getCurrentUser() async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return User.fromJson(data);
    } else {
      throw Exception('Failed to get user profile');
    }
  }

  Future<void> changePassword(String currentPassword, String newPassword) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/change-password'),
      headers: _headers,
      body: json.encode({
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      }),
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Failed to change password');
    }
  }

  Future<void> logout() async {
    _token = null;
    await _prefs.remove('token');
  }

  User? getCurrentUserFromStorage() {
    final userJson = _prefs.getString('user');
    if (userJson != null) {
      return User.fromJson(json.decode(userJson));
    }
    return null;
  }

  // Warranty API calls
  Future<List<Warranty>> getAllWarranties() async {
    final response = await http.get(
      Uri.parse('$baseUrl/warranties'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Warranty.fromJson(json)).toList();
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to get warranties');
    }
  }

  Future<List<Warranty>> getExpiringWarranties() async {
    final response = await http.get(
      Uri.parse('$baseUrl/warranties/expiring'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Warranty.fromJson(json)).toList();
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to get expiring warranties');
    }
  }

  Future<DashboardStats> getDashboardStats() async {
    final response = await http.get(
      Uri.parse('$baseUrl/warranties/stats'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return DashboardStats.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to get dashboard stats');
    }
  }

  Future<List<Warranty>> getRecentWarranties() async {
    final response = await http.get(
      Uri.parse('$baseUrl/warranties/recent'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Warranty.fromJson(json)).toList();
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to get recent warranties');
    }
  }

  Future<Warranty> getWarranty(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/warranties/$id'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return Warranty.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to get warranty');
    }
  }

  Future<Warranty> createWarranty(Warranty warranty) async {
    final response = await http.post(
      Uri.parse('$baseUrl/warranties'),
      headers: _headers,
      body: jsonEncode(warranty.toJson()),
    );

    if (response.statusCode == 201) {
      return Warranty.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to create warranty');
    }
  }

  Future<Warranty> updateWarranty(String id, Warranty warranty) async {
    final response = await http.put(
      Uri.parse('$baseUrl/warranties/$id'),
      headers: _headers,
      body: jsonEncode(warranty.toJson()),
    );

    if (response.statusCode == 200) {
      return Warranty.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to update warranty');
    }
  }

  Future<void> deleteWarranty(String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/warranties/$id'),
      headers: _headers,
    );

    if (response.statusCode != 204) {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to delete warranty');
    }
  }

  // Product API calls
  Future<List<Product>> getAllProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/products'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }

  Future<Product> getProduct(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/products/$id'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Product.fromJson(data);
    } else {
      throw Exception('Failed to load product');
    }
  }

  Future<Product> createProduct(Map<String, dynamic> productData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/products'),
      headers: _headers,
      body: json.encode(productData),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      return Product.fromJson(data);
    } else {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Failed to create product');
    }
  }

  Future<Product> updateProduct(String id, Map<String, dynamic> productData) async {
    final response = await http.put(
      Uri.parse('$baseUrl/products/$id'),
      headers: _headers,
      body: json.encode(productData),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Product.fromJson(data);
    } else {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Failed to update product');
    }
  }

  Future<void> deleteProduct(String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/products/$id'),
      headers: _headers,
    );

    if (response.statusCode != 204) {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Failed to delete product');
    }
  }
} 