package com.productmanagement.dto;

import jakarta.validation.constraints.*;

/**
 * Data Transfer Object (DTO) cho Product
 * Sử dụng để transfer data giữa các layer (Controller <-> Service)
 * Có validation constraints để đảm bảo dữ liệu hợp lệ trước khi xử lý
 */
public class ProductDTO {

    /**
     * ID của sản phẩm (có thể null khi tạo mới)
     */
    private Long id;

    /**
     * Tên sản phẩm
     * - Không được rỗng (message: "Product name is required")
     * - Độ dài 3-100 ký tự
     */
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    /**
     * Mô tả sản phẩm (không bắt buộc)
     * - Tối đa 500 ký tự
     */
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    /**
     * Giá sản phẩm
     * - Bắt buộc (@NotNull)
     * - Phải > 0 (@DecimalMin)
     */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;

    /**
     * Số lượng sản phẩm
     * - Phải >= 0 (@Min)
     */
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    /**
     * Constructor mặc định
     */
    public ProductDTO() {}

    /**
     * Constructor đầy đủ tham số
     * @param id ID sản phẩm
     * @param name Tên sản phẩm
     * @param description Mô tả
     * @param price Giá
     * @param quantity Số lượng
     */
    public ProductDTO(Long id, String name, String description, Double price, Integer quantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }

    /**
     * Builder Pattern cho ProductDTO
     * Giúp tạo DTO một cách linh hoạt trong tests và code
     * Ví dụ: ProductDTO.builder().name("Phone").price(500.0).build()
     */
    public static Builder builder() { return new Builder(); }
    
    /**
     * Inner Builder class
     */
    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer quantity;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder price(Double price) { this.price = price; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public ProductDTO build() { return new ProductDTO(id, name, description, price, quantity); }
    }

    // ==================== Getters / Setters ====================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}