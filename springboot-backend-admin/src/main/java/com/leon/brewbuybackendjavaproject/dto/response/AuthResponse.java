package com.leon.brewbuybackendjavaproject.dto.response;

public class AuthResponse {
    private String token;
    private String username;
    private String userType; // "admin" or "user"

    public AuthResponse() {}

    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
        this.userType = "user"; // default
    }

    public AuthResponse(String token, String username, String userType) {
        this.token = token;
        this.username = username;
        this.userType = userType;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
