package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // 4.2.2a - Test POST /api/products (Create)
    @Test
    @DisplayName("4.2.2a - Create Product")
    void testCreateProduct() throws Exception {
  String productJson = "{" +
    "\"name\":\"Test\"," +
    "\"desc\":\"Desc\"," +
    "\"category\":\"Cat\"," +
    "\"price\":99," +
    "\"stock\":5}";
  mockMvc.perform(post("/api/products")
    .contentType(MediaType.APPLICATION_JSON)
    .content(productJson))
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.name").value("Test"));
    }

    // 4.2.2b - Test GET /api/products (Read all)
    @Test
    @DisplayName("4.2.2b - Get All Products")
    void testGetAllProducts() throws Exception {
  mockMvc.perform(get("/api/products"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$").isArray());
    }

    // 4.2.2c - Test GET /api/products/{id} (Read one)
    @Test
    @DisplayName("4.2.2c - Get Product By Id")
    void testGetProductById() throws Exception {
  mockMvc.perform(get("/api/products/1"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.id").exists());
    }

    // 4.2.2d - Test PUT /api/products/{id} (Update)
    @Test
    @DisplayName("4.2.2d - Update Product")
    void testUpdateProduct() throws Exception {
  String updateJson = "{" +
    "\"name\":\"Updated\"," +
    "\"price\":100}";
  mockMvc.perform(put("/api/products/1")
    .contentType(MediaType.APPLICATION_JSON)
    .content(updateJson))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name").value("Updated"));
    }

    // 4.2.2e - Test DELETE /api/products/{id} (Delete)
    @Test
    @DisplayName("4.2.2e - Delete Product")
    void testDeleteProduct() throws Exception {
  mockMvc.perform(delete("/api/products/1"))
    .andExpect(status().isNoContent());
    }
}

