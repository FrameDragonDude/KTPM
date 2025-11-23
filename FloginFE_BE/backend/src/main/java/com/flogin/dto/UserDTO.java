package com.flogin.dto;

import jakarta.validation.constraints.*;

/**
 * Data Transfer Object (DTO) cho User (dùng cho Login / Register)
 * Dùng để transfer data giữa Controller <-> Service
 * Có validation để đảm bảo dữ liệu hợp lệ trước khi xử lý
 */
public class UserDTO {

    /**
     * ID của user (có thể null khi tạo mới)
     */
    private Long id;

    /**
     * Username dùng để đăng nhập
     * - Không được rỗng
     * - 3-50 ký tự
     * - Chỉ chứa a-z, A-Z, 0-9, -, ., _
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Invalid username format")
    private String username;

    /**
     * Password của user
     * - Không được rỗng
     * - 6-100 ký tự
     * - Phải chứa ít nhất 1 chữ và 1 số
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Password must contain both letters and numbers")
    private String password;

    /**
     * Tên đầy đủ của user (optional)
     */
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    /**
     * Email của user (optional)
     */
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;

    /**
     * Constructor mặc định
     */
    public UserDTO() {}

    /**
     * Constructor đầy đủ tham số
     */
    public UserDTO(Long id, String username, String password, String fullName, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
    }

    /**
     * Builder Pattern để tạo UserDTO linh hoạt
     */
    public static Builder builder() { return new Builder(); }

    /**
     * Inner Builder class
     */
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

        public UserDTO build() {
            return new UserDTO(id, username, password, fullName, email);
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
