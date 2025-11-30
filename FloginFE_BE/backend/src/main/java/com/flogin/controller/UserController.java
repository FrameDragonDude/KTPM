package com.flogin.controller;

import com.flogin.dto.UserDTO;
import com.flogin.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage();
        if (msg != null && (msg.contains("User không tồn tại") || msg.contains("Sai mật khẩu"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg);
    }

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO dto) {
        UserDTO created = userService.createUser(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@Valid @RequestBody UserDTO dto) {
        try {
            UserDTO user = userService.login(dto.getUsername(), dto.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException ex) {
            String msg = ex.getMessage();
            if (msg != null && (msg.contains("User không tồn tại") || msg.contains("Sai mật khẩu"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        UserDTO user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @Valid @RequestBody UserDTO dto) {
        UserDTO updated = userService.updateUser(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
