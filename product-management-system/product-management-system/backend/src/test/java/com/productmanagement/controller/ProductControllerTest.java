package com.productmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.productmanagement.dto.ProductDTO;
import com.productmanagement.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    // a) Test POST /api/products (Create) (1 điểm)
    @Test
    @DisplayName("Test POST /api/products - Create Product")
    void testCreateProduct() throws Exception {
        ProductDTO productDTO = ProductDTO.builder()
                .name("Laptop")
                .description("High-end laptop")
                .price(15000000.0)
                .quantity(10)
                .build();

        ProductDTO savedProduct = ProductDTO.builder()
                .id(1L)
                .name("Laptop")
                .description("High-end laptop")
                .price(15000000.0)
                .quantity(10)
                .build();

        when(productService.createProduct(any(ProductDTO.class)))
                .thenReturn(savedProduct);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"))
                .andExpect(jsonPath("$.price").value(15000000.0))
                .andExpect(jsonPath("$.quantity").value(10));
    }

    // b) Test GET /api/products (Read all) (1 điểm)
    @Test
    @DisplayName("Test GET /api/products - Get All Products")
    void testGetAllProducts() throws Exception {
        List<ProductDTO> products = Arrays.asList(
                ProductDTO.builder()
                        .id(1L)
                        .name("Laptop")
                        .description("High-end laptop")
                        .price(15000000.0)
                        .quantity(10)
                        .build(),
                ProductDTO.builder()
                        .id(2L)
                        .name("Mouse")
                        .description("Wireless mouse")
                        .price(200000.0)
                        .quantity(50)
                        .build()
        );

        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Laptop"))
                .andExpect(jsonPath("$[1].name").value("Mouse"));
    }

    // c) Test GET /api/products/{id} (Read one) (1 điểm)
    @Test
    @DisplayName("Test GET /api/products/{id} - Get Product By ID")
    void testGetProductById() throws Exception {
        ProductDTO product = ProductDTO.builder()
                .id(1L)
                .name("Laptop")
                .description("High-end laptop")
                .price(15000000.0)
                .quantity(10)
                .build();

        when(productService.getProductById(1L)).thenReturn(product);

        mockMvc.perform(get("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"))
                .andExpect(jsonPath("$.description").value("High-end laptop"))
                .andExpect(jsonPath("$.price").value(15000000.0))
                .andExpect(jsonPath("$.quantity").value(10));
    }

    // d) Test PUT /api/products/{id} (Update) (1 điểm)
    @Test
    @DisplayName("Test PUT /api/products/{id} - Update Product")
    void testUpdateProduct() throws Exception {
        ProductDTO updatedProductDTO = ProductDTO.builder()
                .name("Updated Laptop")
                .description("Updated description")
                .price(18000000.0)
                .quantity(15)
                .build();

        ProductDTO savedProduct = ProductDTO.builder()
                .id(1L)
                .name("Updated Laptop")
                .description("Updated description")
                .price(18000000.0)
                .quantity(15)
                .build();

        when(productService.updateProduct(eq(1L), any(ProductDTO.class)))
                .thenReturn(savedProduct);

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedProductDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Updated Laptop"))
                .andExpect(jsonPath("$.price").value(18000000.0))
                .andExpect(jsonPath("$.quantity").value(15));
    }

    // e) Test DELETE /api/products/{id} (Delete) (1 điểm)
    @Test
    @DisplayName("Test DELETE /api/products/{id} - Delete Product")
    void testDeleteProduct() throws Exception {
        mockMvc.perform(delete("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
