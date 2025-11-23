package com.flogin.controller;

import com.flogin.dto.UserDTO;
import com.flogin.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller xử lý các request liên quan đến User
 * Base URL: /api/users
 *
 * Annotations:
 * - @RestController: Đánh dấu class này là REST controller
 * - @RequestMapping: Define base path cho tất cả endpoints
 * - @CrossOrigin: Cho phép CORS từ mọi origin (frontend có thể gọi API)
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    /**
     * Constructor injection
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * API tạo user mới (Register)
     * POST /api/users
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO dto) {
        UserDTO created = userService.createUser(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * API lấy danh sách tất cả user
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * API lấy thông tin user theo ID
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * API cập nhật thông tin user
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO dto) {
        UserDTO updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * API xóa user
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * API đăng nhập user
     * POST /api/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserDTO dto) {
        UserDTO loggedIn = userService.login(dto.getUsername(), dto.getPassword());
        return ResponseEntity.ok(loggedIn);
    }
}
