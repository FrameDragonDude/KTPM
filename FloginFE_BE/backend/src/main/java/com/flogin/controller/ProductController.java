package com.flogin.controller;

import com.flogin.dto.ProductDTO;
import com.flogin.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller xử lý các request liên quan đến Product
 * Base URL: /api/products
 * 
 * Annotations:
 * - @RestController: Đánh dấu class này là REST controller
 * - @RequestMapping: Define base path cho tất cả endpoints
 * - @CrossOrigin: Cho phép CORS từ mọi origin (để frontend có thể gọi API)
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    /**
     * Inject ProductService để xử lý business logic
     * Sử dụng constructor injection (recommended practice)
     */
    private final ProductService productService;

    /**
     * Constructor injection cho ProductService
     * Spring tự động inject bean ProductService vào đây
     */
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    /**
     * API tạo sản phẩm mới
     * POST /api/products
     * 
     * @param dto ProductDTO chứa thông tin sản phẩm (validate bằng @Valid)
     * @return ResponseEntity với ProductDTO đã tạo và HTTP status 201 (CREATED)
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO dto) {
        ProductDTO created = productService.createProduct(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    /**
     * API lấy danh sách tất cả sản phẩm
     * GET /api/products
     * 
     * @return ResponseEntity với List<ProductDTO> và HTTP status 200 (OK)
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    /**
     * API lấy thông tin chi tiết 1 sản phẩm theo ID
     * GET /api/products/{id}
     * 
     * @param id ID của sản phẩm cần lấy (từ URL path)
     * @return ResponseEntity với ProductDTO và HTTP status 200 (OK)
     * @throws ResourceNotFoundException nếu không tìm thấy product
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable int id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    /**
     * API cập nhật thông tin sản phẩm
     * PUT /api/products/{id}
     * 
     * @param id ID của sản phẩm cần update (từ URL path)
     * @param dto ProductDTO chứa thông tin mới (validate bằng @Valid)
     * @return ResponseEntity với ProductDTO đã update và HTTP status 200 (OK)
     * @throws ResourceNotFoundException nếu không tìm thấy product
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable int id,
            @Valid @RequestBody ProductDTO dto) {
        ProductDTO updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * API xóa sản phẩm
     * DELETE /api/products/{id}
     * 
     * @param id ID của sản phẩm cần xóa (từ URL path)
     * @return ResponseEntity rỗng với HTTP status 204 (NO_CONTENT)
     * @throws ResourceNotFoundException nếu không tìm thấy product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
