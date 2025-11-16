package com.flogin.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Entity class đại diện cho Product trong hệ thống quản lý sản phẩm
 * Mapping với bảng "products" trong database
 */
@Entity
@Table(name = "products")
public class Product {

    /**
     * ID tự động tăng của sản phẩm (Primary Key)
     * Sử dụng GenerationType.IDENTITY để database tự động generate
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tên sản phẩm
     * - Không được rỗng (@NotBlank)
     * - Độ dài từ 3-100 ký tự (@Size)
     * - Bắt buộc trong database (nullable = false)
     */
    @NotBlank
    @Size(min = 3, max = 100)
    @Column(nullable = false)
    private String name;

    /**
     * Mô tả chi tiết về sản phẩm
     * - Không bắt buộc
     * - Tối đa 500 ký tự
     */
    @Size(max = 500)
    private String description;

    /**
     * Giá của sản phẩm
     * - Không được null (@NotNull)
     * - Phải lớn hơn 0 (@DecimalMin)
     * - Bắt buộc trong database (nullable = false)
     */
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false)
    private Double price;

    /**
     * Số lượng sản phẩm trong kho
     * - Phải >= 0 (@Min)
     * - Giá trị mặc định là 0
     * - Bắt buộc trong database (nullable = false)
     */
    @Min(0)
    @Column(nullable = false)
    private Integer quantity = 0;

    /**
     * Constructor mặc định (required by JPA)
     */
    public Product() {}

    /**
     * Constructor đầy đủ tham số
     * @param id ID của sản phẩm
     * @param name Tên sản phẩm
     * @param description Mô tả sản phẩm
     * @param price Giá sản phẩm
     * @param quantity Số lượng sản phẩm
     */
    public Product(Long id, String name, String description, Double price, Integer quantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }

    /**
     * Builder Pattern - Giúp tạo object Product một cách linh hoạt
     * Ví dụ: Product.builder().name("Laptop").price(1500.0).build()
     */
    public static Builder builder() { return new Builder(); }
    
    /**
     * Inner class Builder để implement Builder Pattern
     * Cho phép tạo Product theo chuỗi: builder().field1().field2().build()
     */
    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer quantity;

        /** Set ID và return Builder để tiếp tục chuỗi */
        public Builder id(Long id) { this.id = id; return this; }
        /** Set name và return Builder để tiếp tục chuỗi */
        public Builder name(String name) { this.name = name; return this; }
        /** Set description và return Builder để tiếp tục chuỗi */
        public Builder description(String description) { this.description = description; return this; }
        /** Set price và return Builder để tiếp tục chuỗi */
        public Builder price(Double price) { this.price = price; return this; }
        /** Set quantity và return Builder để tiếp tục chuỗi */
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        /** Build và return Product object với các giá trị đã set */
        public Product build() { return new Product(id, name, description, price, quantity); }
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
