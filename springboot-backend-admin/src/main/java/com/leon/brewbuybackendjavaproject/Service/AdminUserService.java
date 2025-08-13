package com.leon.brewbuybackendjavaproject.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.leon.brewbuybackendjavaproject.dto.AdminUserDto;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class AdminUserService {
    
    private final PasswordEncoder passwordEncoder;
    
    // In-memory admin users (in production, use database)
    private final Map<String, String> adminUsers = new HashMap<>();
    
    public AdminUserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        // Add default admin user
        adminUsers.put("admin", passwordEncoder.encode("admin123"));
    }
    
    public boolean validateAdminCredentials(String username, String password) {
        String storedPassword = adminUsers.get(username);
        return storedPassword != null && passwordEncoder.matches(password, storedPassword);
    }
    
    // Testing endpoints methods
    public List<AdminUserDto> getAllAdminUsers() {
        List<AdminUserDto> users = new ArrayList<>();
        for (Map.Entry<String, String> entry : adminUsers.entrySet()) {
            users.add(new AdminUserDto(entry.getKey(), "********")); // Don't expose passwords
        }
        return users;
    }
    
    public boolean addAdminUser(String username, String password) {
        if (adminUsers.containsKey(username)) {
            return false; // User already exists
        }
        adminUsers.put(username, passwordEncoder.encode(password));
        return true;
    }
    
    public boolean updateAdminUser(String username, String newPassword) {
        if (!adminUsers.containsKey(username)) {
            return false; // User doesn't exist
        }
        adminUsers.put(username, passwordEncoder.encode(newPassword));
        return true;
    }
    
    public boolean deleteAdminUser(String username) {
        if (!adminUsers.containsKey(username)) {
            return false; // User doesn't exist
        }
        if ("admin".equals(username)) {
            return false; // Cannot delete default admin
        }
        adminUsers.remove(username);
        return true;
    }
    
    public boolean adminUserExists(String username) {
        return adminUsers.containsKey(username);
    }
}
