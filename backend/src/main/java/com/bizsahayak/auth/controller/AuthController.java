package com.bizsahayak.auth.controller;

import com.bizsahayak.auth.dto.JwtAuthResponse;
import com.bizsahayak.auth.dto.LoginRequest;
import com.bizsahayak.auth.dto.RegisterRequest;
import com.bizsahayak.auth.dto.UserSummary;
import com.bizsahayak.auth.service.AuthService;
import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User & Business Authentication Endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new User or Business")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> registerUser(@Valid @RequestBody RegisterRequest request) {
        JwtAuthResponse response = authService.registerUser(request);
        return new ResponseEntity<>(ApiResponse.success(response, "User registered successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user and receive JWT token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> loginUser(@Valid @RequestBody LoginRequest request) {
        JwtAuthResponse response = authService.loginUser(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user details")
    public ResponseEntity<ApiResponse<UserSummary>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        UserSummary summary = authService.getCurrentUser(currentUser);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
