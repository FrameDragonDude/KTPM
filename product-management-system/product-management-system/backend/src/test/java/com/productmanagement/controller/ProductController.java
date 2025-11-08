package com.productmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.productmanagement.dto.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.productmanagement.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private ProductDTO sample;

    @BeforeEach
    void setUp() {
        sample = ProductDTO.builder()
                .name("Phone")
                .description("Nice phone")
                .price(199.99)
                .quantity(5)
                .build();
    }

    @Test
    @DisplayName("GET /api/products - Lay danh sach san pham")
    void testGetAllProducts() throws Exception {
        // Tạo sản phẩm mẫu
        String json = objectMapper.writeValueAsString(sample);
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

        // Lấy danh sách
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].name").exists());
    }

    @Test
    @DisplayName("POST /api/products - Tao san pham moi")
    void testCreateProduct() throws Exception {
        String json = objectMapper.writeValueAsString(sample);
        
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Phone")))
                .andExpect(jsonPath("$.price", is(199.99)))
                .andExpect(jsonPath("$.quantity", is(5)));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Lay san pham theo ID")
    void testGetProductById() throws Exception {
        // Tạo sản phẩm trước
        String json = objectMapper.writeValueAsString(sample);
        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);

        // Lấy theo ID
        mockMvc.perform(get("/api/products/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.name", is("Phone")));
    }

    @Test
    @DisplayName("PUT /api/products/{id} - Cap nhat san pham")
    void testUpdateProduct() throws Exception {
        // Tạo sản phẩm trước
        String json = objectMapper.writeValueAsString(sample);
        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);

        // Cập nhật
        ProductDTO updated = ProductDTO.builder()
                .name("Phone Updated")
                .description("Updated description")
                .price(299.99)
                .quantity(10)
                .build();
        String updateJson = objectMapper.writeValueAsString(updated);

        mockMvc.perform(put("/api/products/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Phone Updated")))
                .andExpect(jsonPath("$.price", is(299.99)))
                .andExpect(jsonPath("$.quantity", is(10)));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Xoa san pham")
    void testDeleteProduct() throws Exception {
        // Tạo sản phẩm trước
        String json = objectMapper.writeValueAsString(sample);
        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);

        
        mockMvc.perform(delete("/api/products/{id}", created.getId()))
                .andExpect(status().isNoContent());
    }
}