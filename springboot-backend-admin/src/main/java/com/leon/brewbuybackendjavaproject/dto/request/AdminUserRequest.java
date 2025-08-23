// src/main/java/com/leon/brewbuybackendjavaproject/dto/AdminUserRequest.java
package com.leon.brewbuybackendjavaproject.dto.request;

public class AdminUserRequest {
    private String username;
    private String password;
    
    public AdminUserRequest() {}
    
    public AdminUserRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    // Getters and Setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
