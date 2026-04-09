package com.taskmanager.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// A JWT (JSON Web Token) has three parts separated by dots:
//   header.payload.signature
//
// header:    algorithm used to sign (HS256)
// payload:   claims — data inside the token (username, expiry, etc.)
// signature: HMAC of header+payload using the secret key
//
// The signature is what makes the token tamper-proof.
// If anyone modifies the payload, the signature won't match.

@Service
public class JwtService {

    // These values come from application.properties
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Create a signed JWT for the given username
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract the username from a token's payload
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Validate the token — checks signature and expiry
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);  // throws if invalid or expired
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public long getExpirationMs() { return expirationMs; }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
