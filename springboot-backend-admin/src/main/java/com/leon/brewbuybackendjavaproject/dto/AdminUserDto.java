// src/main/java/com/leon/brewbuybackendjavaproject/dto/AdminUserDto.java
package com.leon.brewbuybackendjavaproject.dto;

public class AdminUserDto {
    private String username;
    private String password; // This will be masked in responses
    
    public AdminUserDto() {}
    
    public AdminUserDto(String username, String password) {
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
