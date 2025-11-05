package com.productmanagement.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor  // ← Constructor với TẤT CẢ fields
@Builder
public class ProductDTO {
    
    private Long id;
    
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;
    
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;  // ← PHẢI CÓ FIELD NÀY
}