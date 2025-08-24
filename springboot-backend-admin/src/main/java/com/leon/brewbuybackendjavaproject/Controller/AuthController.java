package com.leon.brewbuybackendjavaproject.Controller;

import com.leon.brewbuybackendjavaproject.dto.request.AuthRequest;
import com.leon.brewbuybackendjavaproject.dto.response.AuthResponse;

import java.util.Optional;
import com.leon.brewbuybackendjavaproject.Model.User;
import com.leon.brewbuybackendjavaproject.security.JwtUtil;
import com.leon.brewbuybackendjavaproject.Service.AdminUserService;
import com.leon.brewbuybackendjavaproject.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

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
                    AuthResponse response = new AuthResponse(token, user.getUsername(), "user");
                    return ResponseEntity.ok(response);
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
}
