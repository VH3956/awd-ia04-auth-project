package com.ia03.user_registration.controller.dto;

// No validation needed here, as we're just checking
public class LoginRequest {
    private String email;
    private String password;
    // getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}