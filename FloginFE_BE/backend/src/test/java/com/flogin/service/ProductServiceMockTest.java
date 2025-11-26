package com.flogin.service;

import com.flogin.dto.ProductDTO;
import com.flogin.model.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    // a) Mock ProductRepository (1 điểm)
    @Test
    @DisplayName("Mock: Test getProductById")
    void testGetProductById() {
        Product mockProduct = Product.builder()
                .id(1L)
                .name("Đồng hồ thông minh")
                .description("Theo dõi sức khỏe với cảm biến nhịp tim")
                .price(199.99)
                .quantity(32)
                .category("Điện tử")
                .build();

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(mockProduct));

        ProductDTO result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Đồng hồ thông minh", result.getName());

        verify(productRepository).findById(1L);
    }

    // b) Test service layer với mocked repository (1 điểm)
    @Test
    @DisplayName("Mock: Test createProduct")
    void testCreateProduct() {
        Product mockProduct = Product.builder()
                .id(2L)
                .name("Giá đỡ laptop")
                .description("Giá đỡ laptop nhôm ergonomic")
                .price(49.99)
                .quantity(78)
                .category("Phụ kiện")
                .build();

        when(productRepository.save(any(Product.class)))
                .thenReturn(mockProduct);

        ProductDTO productDTO = ProductDTO.builder()
                .name("Giá đỡ laptop")
                .description("Giá đỡ laptop nhôm ergonomic")
                .price(49.99)
                .quantity(78)
                .category("Phụ kiện")
                .build();

        ProductDTO result = productService.createProduct(productDTO);

        assertNotNull(result);
        assertEquals("Giá đỡ laptop", result.getName());

        verify(productRepository).save(any(Product.class));
    }

    // c) Verify repository interactions (0.5 điểm)
    @Test
    @DisplayName("Mock: Verify findById interaction")
    void testFindByIdInteraction() {
        Product mockProduct = Product.builder()
                .id(3L)
                .name("Tai nghe không dây")
                .description("Tai nghe chống ồn cao cấp")
                .price(299.99)
                .quantity(45)
                .category("Điện tử")
                .build();

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(mockProduct));

        productService.getProductById(1L);

        verify(productRepository, times(1)).findById(1L);
    }
}