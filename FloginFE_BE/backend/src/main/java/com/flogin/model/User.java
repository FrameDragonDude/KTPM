package com.flogin.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Entity đại diện cho User trong hệ thống (dùng cho Login / Authentication)
 * Mapping với bảng "users" trong database
 */
@Entity
@Table(name = "users")
public class User {

    /**
     * ID tự động tăng của user (Primary Key)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Username để đăng nhập
     * - Không được rỗng
     * - 3-50 ký tự
     * - Chỉ cho phép a-z, A-Z, 0-9, -, ., _
     * - Unique trong database
     */
    @NotBlank
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Invalid username format")
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * Mật khẩu của user
     * - Không được rỗng
     * - 6-100 ký tự
     * - Phải chứa ít nhất 1 số và 1 chữ
     */
    @NotBlank
    @Size(min = 6, max = 100)
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Password must contain letters and numbers")
    @Column(nullable = false)
    private String password;

    /**
     * Tên đầy đủ của user (optional)
     */
    @Size(max = 100)
    private String fullName;

    /**
     * Email (optional)
     */
    @Email
    @Size(max = 255)
    private String email;

    /**
     * Constructor mặc định do JPA yêu cầu
     */
    public User() {}

    /**
     * Constructor đầy đủ
     */
    public User(Long id, String username, String password, String fullName, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
    }

    /**
     * Builder Pattern để tạo User linh hoạt
     */
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String username;
        private String password;
        private String fullName;
        private String email;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }

        public User build() {
            return new User(id, username, password, fullName, email);
        }
    }

    // ==================== GETTERS / SETTERS ====================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
