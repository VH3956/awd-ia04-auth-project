package com.ia03.user_registration.controller;

import com.ia03.user_registration.controller.dto.AuthResponse;
import com.ia03.user_registration.controller.dto.LoginRequest;
import com.ia03.user_registration.controller.dto.RefreshTokenRequest;
import com.ia03.user_registration.entity.User;
import com.ia03.user_registration.security.JwtService;
import com.ia03.user_registration.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/user/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // This line attempts to authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // If successful, load the user and generate tokens
        User user = (User) userService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String userEmail = jwtService.extractEmail(request.getRefreshToken());
        User user = (User) userService.loadUserByUsername(userEmail);

        // If the refresh token is valid, issue a new access token
        if (jwtService.isTokenValid(request.getRefreshToken(), user)) {
            String accessToken = jwtService.generateAccessToken(user);
            return ResponseEntity.ok(new AuthResponse(accessToken, request.getRefreshToken()));
        }

        return ResponseEntity.status(401).body(null); // Or a proper error response
    }
}
