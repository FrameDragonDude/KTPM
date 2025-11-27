package com.flogin.controller;

import com.flogin.model.UserRequest;
import com.flogin.model.UserResponse;
import com.flogin.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request){
        UserResponse resp = authService.login(request);
        return ResponseEntity.ok(resp);
    }
}
