package com.productmanagement.service;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.model.Product;
import com.productmanagement.repository.ProductRepository;
import com.productmanagement.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    // Inject vào implementation, không phải interface
    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;
    private ProductDTO testProductDTO;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .price(99.99)
                .quantity(10)
                .build();

        testProductDTO = ProductDTO.builder()
                .name("Test Product")
                .description("Test Description")
                .price(99.99)
                .quantity(10)
                .build();
    }

    @Test
    @DisplayName("Mock: Tạo sản phẩm mới")
    void testCreateProduct_Success() {
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductDTO result = productService.createProduct(testProductDTO);

        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Lấy tất cả sản phẩm")
    void testGetAllProducts_Success() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(testProduct));

        List<ProductDTO> results = productService.getAllProducts();

        assertEquals(1, results.size());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Mock: Lấy sản phẩm theo ID")
    void testGetProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        ProductDTO result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Mock: Lấy sản phẩm không tồn tại -> throw")
    void testGetProductById_NotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productService.getProductById(999L));
    }

    @Test
    @DisplayName("Mock: Cập nhật sản phẩm")
    void testUpdateProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductDTO result = productService.updateProduct(1L, testProductDTO);

        assertNotNull(result);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Xóa sản phẩm")
    void testDeleteProduct_Success() {
        when(productRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).existsById(1L);
        verify(productRepository, times(1)).deleteById(1L);
    }
}