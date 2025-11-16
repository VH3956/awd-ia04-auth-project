package com.ia03.user_registration.controller;

import com.ia03.user_registration.controller.dto.RegisterRequest;
import com.ia03.user_registration.entity.User;
import com.ia03.user_registration.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // This is your existing registration endpoint (no change)
    @PostMapping("/user/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody RegisterRequest request) {
        User newUser = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
    
    // --- NEW PROTECTED ENDPOINT ---
    @GetMapping("/user/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // Thanks to our JWT filter, Spring Security knows who the user is
        // and injects their details here.
        User user = (User) userDetails;
        return ResponseEntity.ok(user);
    }
}
