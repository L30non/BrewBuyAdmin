package com.leon.brewbuybackendjavaproject.Controller;

// src/main/java/com/leon/brewbuybackendjavaproject/Controller/AuthController.java
import com.leon.brewbuybackendjavaproject.dto.AdminUserDto;
import com.leon.brewbuybackendjavaproject.dto.AdminUserRequest;
import com.leon.brewbuybackendjavaproject.dto.AuthRequest;
import com.leon.brewbuybackendjavaproject.dto.AuthResponse;
import java.util.Optional;
import com.leon.brewbuybackendjavaproject.Model.User;
import com.leon.brewbuybackendjavaproject.security.JwtUtil;
import com.leon.brewbuybackendjavaproject.Service.AdminUserService;
import com.leon.brewbuybackendjavaproject.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminUserService adminUserService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if username or email already exists
            if (userService.userExists(user.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            if (userService.emailExists(user.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create new user
            User newUser = userService.createUser(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(newUser.getUsername());
            AuthResponse response = new AuthResponse(token, newUser.getUsername());
            
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // In your AuthController, make sure the login response is consistent
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
    try {
        // First check if it's an admin user
        if (adminUserService.validateAdminCredentials(authRequest.getUsername(), authRequest.getPassword())) {
            String token = jwtUtil.generateToken(authRequest.getUsername());
            AuthResponse response = new AuthResponse(token, authRequest.getUsername(), "admin");
            return ResponseEntity.ok(response);
        }
        
        // Then check regular user
        Optional<User> userOptional = userService.getUserByUsernameOrEmail(authRequest.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Validate password using the UserService method
            if (userService.validateUserCredentials(authRequest.getUsername(), authRequest.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername());
                // Return user details without password
                User userResponse = new User();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setCreatedAt(user.getCreatedAt());
                userResponse.setUpdatedAt(user.getUpdatedAt());
                
                return ResponseEntity.ok(userResponse);
            }
        }

        return ResponseEntity.badRequest().body("Invalid credentials");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
    }
}

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In JWT-based auth, logout is typically handled on client side
        return ResponseEntity.ok("Logged out successfully");
    }
    
    // TESTING ENDPOINTS - FOR DEVELOPMENT/TESTING PURPOSES ONLY
    // These endpoints should be secured in production!
    
    @GetMapping("/admin/users")
    public ResponseEntity<List<AdminUserDto>> getAllAdminUsers() {
        List<AdminUserDto> users = adminUserService.getAllAdminUsers();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/admin/users")
    public ResponseEntity<?> addAdminUser(@RequestBody AdminUserRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        boolean added = adminUserService.addAdminUser(request.getUsername(), request.getPassword());
        if (added) {
            return ResponseEntity.ok("Admin user added successfully");
        } else {
            return ResponseEntity.badRequest().body("Username already exists");
        }
    }
    
    @PutMapping("/admin/users/{username}")
    public ResponseEntity<?> updateAdminUser(@PathVariable String username, @RequestBody AdminUserRequest request) {
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        boolean updated = adminUserService.updateAdminUser(username, request.getPassword());
        if (updated) {
            return ResponseEntity.ok("Admin user updated successfully");
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }
    
    @DeleteMapping("/admin/users/{username}")
    public ResponseEntity<?> deleteAdminUser(@PathVariable String username) {
        if ("admin".equals(username)) {
            return ResponseEntity.badRequest().body("Cannot delete default admin user");
        }
        
        boolean deleted = adminUserService.deleteAdminUser(username);
        if (deleted) {
            return ResponseEntity.ok("Admin user deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }
    
    @GetMapping("/admin/users/{username}/exists")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable String username) {
        boolean exists = adminUserService.adminUserExists(username);
        return ResponseEntity.ok(exists);
    }
    
    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("Connection successful!");
    }
}
