package com.flogin.controller;

import com.flogin.dto.UserDTO;
import com.flogin.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserDTO dto) {
        try {
            UserDTO user = userService.login(dto.getUsername(), dto.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException ex) {
            String msg = ex.getMessage();
            if (msg != null && (msg.contains("User không tồn tại") || msg.contains("Sai mật khẩu"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid credentials"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Login failed"));
        }
    }

    private static class ErrorResponse {
        public String message;
        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}
