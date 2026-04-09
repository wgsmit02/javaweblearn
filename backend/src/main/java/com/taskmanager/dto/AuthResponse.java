package com.taskmanager.dto;

// What we return after a successful login or registration
public class AuthResponse {

    private String token;
    private String username;
    private long expiresIn;  // milliseconds

    public AuthResponse(String token, String username, long expiresIn) {
        this.token = token;
        this.username = username;
        this.expiresIn = expiresIn;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public long getExpiresIn() { return expiresIn; }
}
