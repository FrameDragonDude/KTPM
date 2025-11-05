package com.productmanagement.service;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.model.Product;
import com.productmanagement.repository.ProductRepository;
import com.productmanagement.service.impl.ProductServiceImpl;
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
                .name("Laptop")
                .description("High-end laptop")
                .price(15000000.0)
                .quantity(10)
                .build();

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(mockProduct));

        ProductDTO result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());

        verify(productRepository).findById(1L);
    }

    // b) Test service layer với mocked repository (1 điểm)
    @Test
    @DisplayName("Mock: Test createProduct")
    void testCreateProduct() {
        Product mockProduct = Product.builder()
                .id(1L)
                .name("Mouse")
                .description("Wireless mouse")
                .price(200000.0)
                .quantity(10)
                .build();

        when(productRepository.save(any(Product.class)))
                .thenReturn(mockProduct);

        ProductDTO productDTO = ProductDTO.builder()
                .name("Mouse")
                .description("Wireless mouse")
                .price(200000.0)
                .quantity(10)
                .build();

        ProductDTO result = productService.createProduct(productDTO);

        assertNotNull(result);
        assertEquals("Mouse", result.getName());

        verify(productRepository).save(any(Product.class));
    }

    // c) Verify repository interactions (0.5 điểm)
    @Test
    @DisplayName("Mock: Verify findById interaction")
    void testFindByIdInteraction() {
        Product mockProduct = Product.builder()
                .id(1L)
                .name("Keyboard")
                .description("Mechanical keyboard")
                .price(500000.0)
                .quantity(15)
                .build();

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(mockProduct));

        productService.getProductById(1L);

        verify(productRepository, times(1)).findById(1L);
    }
}
