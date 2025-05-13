import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/warranty.dart';
import '../models/product.dart';
import '../models/auth.dart';
import '../models/dashboard_stats.dart';
import '../models/notification.dart' as app;

class ApiService {
  // Update this to your actual API server address
  // static const String baseUrl = 'http://10.0.2.2:5000/api'; // For Android Emulator
  static const String baseUrl = 'http://localhost:3000/api'; // For iOS Simulator
  final SharedPreferences _prefs;
  String? _token;

  ApiService(this._prefs) {
    _token = _prefs.getString('token');
    print('ApiService initialized with token: ${_token != null ? 'Present' : 'Not present'}');
    print('Using API base URL: $baseUrl');
  }

  String? get token => _token;
  bool get isAuthenticated => _token != null;

  Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
      if (_token != null) 'Authorization': 'Bearer $_token',
    };
    print('Request headers: $headers');
    return headers;
  }

  // Auth API calls
  Future<void> login(String email, String password) async {
    try {
      print('Attempting to login with email: $email');
      print('API URL: $baseUrl/auth/login');
      
      // Test if the server is reachable
      try {
        final testResponse = await http.get(Uri.parse(baseUrl));
        print('Server test response status: ${testResponse.statusCode}');
      } catch (e) {
        print('Server test failed: $e');
        throw Exception('Cannot connect to server. Please check if the server is running at $baseUrl');
      }
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw Exception('Connection timed out. Please check your internet connection and try again.');
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response headers: ${response.headers}');
      print('Response body: ${response.body}');

      if (response.body.isEmpty) {
        throw Exception('Empty response received from server. Please check if the API endpoint is correct.');
      }

      if (response.statusCode == 200) {
        try {
          final data = jsonDecode(response.body);
          print('Parsed response data: $data');
          _token = data['token'];
          await _prefs.setString('token', _token!);
          print('Token saved successfully');
        } catch (e) {
          print('Error parsing response: $e');
          throw Exception('Invalid response format from server. Expected JSON with token.');
        }
      } else if (response.statusCode == 401) {
        throw Exception('Invalid email or password');
      } else if (response.statusCode == 404) {
        throw Exception('API endpoint not found. Please check the server configuration.');
      } else {
        try {
          final errorData = jsonDecode(response.body);
          throw Exception(errorData['message'] ?? 'Login failed with status ${response.statusCode}');
        } catch (e) {
          print('Error parsing error response: $e');
          throw Exception('Login failed with status ${response.statusCode}. Please try again later.');
        }
      }
    } on SocketException catch (e) {
      print('Network error: $e');
      throw Exception('Cannot connect to server. Please check your internet connection and if the server is running.');
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  Future<void> register(String name, String email, String password) async {
    try {
      print('Attempting to register with email: $email');
      print('API URL: $baseUrl/auth/register');
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _headers,
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      print('Response status: ${response.statusCode}');
      print('Response headers: ${response.headers}');
      print('Response body: ${response.body}');

      if (response.statusCode == 201) {
        try {
          final data = jsonDecode(response.body);
          print('Parsed response data: $data');
          _token = data['token'];
          await _prefs.setString('token', _token!);
          print('Token saved successfully');
        } catch (e) {
          print('Error parsing response: $e');
          throw Exception('Invalid response format from server');
        }
      } else {
        try {
          final errorData = jsonDecode(response.body);
          throw Exception(errorData['message'] ?? 'Registration failed with status ${response.statusCode}');
        } catch (e) {
          print('Error parsing error response: $e');
          throw Exception('Registration failed with status ${response.statusCode}');
        }
      }
    } catch (e) {
      print('Registration error: $e');
      rethrow;
    }
  }

  Future<User> getCurrentUser() async {
    try {
      print('Fetching current user');
      print('API URL: $baseUrl/auth/me');
      
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: _headers,
      );

      print('Response status: ${response.statusCode}');
      print('Response headers: ${response.headers}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final data = json.decode(response.body);
          print('Parsed user data: $data');
          return User.fromJson(data);
        } catch (e) {
          print('Error parsing user data: $e');
          throw Exception('Failed to parse user profile');
        }
      } else {
        throw Exception('Failed to get user profile with status ${response.statusCode}');
      }
    } catch (e) {
      print('Get current user error: $e');
      rethrow;
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
    try {
      print('Fetching all warranties...');
      final response = await http.get(
        Uri.parse('$baseUrl/warranties'),
        headers: _headers,
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print('Parsed data: $data');
        return data.map((json) => Warranty.fromJson(json)).toList();
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to get warranties');
      }
    } catch (e) {
      print('Error in getAllWarranties: $e');
      rethrow;
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
      Uri.parse('$baseUrl/warranties/stats/overview'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return DashboardStats.fromJson(data);
    } else {
      throw Exception('Failed to load dashboard stats');
    }
  }

  Future<List<Warranty>> getRecentWarranties() async {
    try {
      print('Fetching recent warranties...');
      final response = await http.get(
        Uri.parse('$baseUrl/warranties'),
        headers: _headers,
      );

      print('Response status: ${response.statusCode}');
      print('Response headers: ${response.headers}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final dynamic responseData = jsonDecode(response.body);
          print('Decoded response data: $responseData');
          
          List<dynamic> data;
          if (responseData is List) {
            data = responseData;
          } else if (responseData is Map) {
            if (responseData.containsKey('warranties')) {
              data = responseData['warranties'] as List<dynamic>;
            } else if (responseData.containsKey('data')) {
              data = responseData['data'] as List<dynamic>;
            } else {
              print('Unexpected response format: $responseData');
              return [];
            }
          } else {
            print('Unexpected response type: ${responseData.runtimeType}');
            return [];
          }
          
          print('Extracted data list: $data');
          
          if (data.isEmpty) {
            print('No warranties found');
            return [];
          }

          final warranties = data.map((json) {
            try {
              print('Processing warranty JSON: $json');
              // Ensure all required fields are present
              if (json is! Map<String, dynamic>) {
                throw Exception('Invalid warranty data format');
              }
              return Warranty.fromJson(json);
            } catch (e) {
              print('Error parsing warranty JSON: $e');
              print('Problematic JSON: $json');
              rethrow;
            }
          }).toList();
          
          print('Successfully parsed ${warranties.length} warranties');
          
          warranties.sort((a, b) => b.createdAt.compareTo(a.createdAt));
          return warranties.take(5).toList();
        } catch (e) {
          print('Error parsing response: $e');
          rethrow;
        }
      } else {
        final errorMessage = jsonDecode(response.body)['message'] ?? 'Failed to get recent warranties';
        print('API error: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Error in getRecentWarranties: $e');
      rethrow;
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

    if (response.statusCode != 200) {
      throw Exception('Failed to delete warranty');
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

  Future<void> submitClaim({
    required String warrantyId,
    required String issueDescription,
    required String contactNumber,
    required List<File> images,
  }) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/claims'),
    );

    request.headers.addAll(_headers);
    request.fields['warrantyId'] = warrantyId;
    request.fields['issueDescription'] = issueDescription;
    request.fields['contactNumber'] = contactNumber;

    for (var i = 0; i < images.length; i++) {
      request.files.add(
        await http.MultipartFile.fromPath(
          'images',
          images[i].path,
        ),
      );
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 201) {
      throw Exception('Failed to submit claim');
    }
  }

  Future<List<app.Notification>> getNotifications() async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => app.Notification.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load notifications');
    }
  }

  Future<void> markNotificationAsRead(String id) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/notifications/$id/read'),
      headers: _headers,
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to mark notification as read');
    }
  }
} 