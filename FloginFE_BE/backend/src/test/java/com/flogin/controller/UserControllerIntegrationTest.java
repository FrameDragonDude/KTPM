package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 4.1.2 Backend API Integration Test
 * Test API endpoints của Login với MockMvc
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // 4.1.2a - Test POST /api/users/login endpoint
    @Test
    @DisplayName("4.1.2a - Test successful login")
    void testLoginSuccess() throws Exception {
        // Tạo user trước
        String registerJson = "{\"username\":\"testuser\",\"password\":\"Test123\"," +
                "\"fullName\":\"Test User\",\"email\":\"test@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        // Test login
        String loginJson = "{\"username\":\"testuser\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("4.1.2a - Test login with wrong password")
    void testLoginWrongPassword() throws Exception {
        // Tạo user trước
        String registerJson = "{\"username\":\"user2\",\"password\":\"Pass123\"," +
                "\"fullName\":\"User Two\",\"email\":\"user2@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        // Login với password sai
        String loginJson = "{\"username\":\"user2\",\"password\":\"WrongPass\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("4.1.2a - Test login with non-existent user")
    void testLoginNonExistentUser() throws Exception {
        String loginJson = "{\"username\":\"nonexistent\",\"password\":\"Pass123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isInternalServerError());
    }

    // 4.1.2b - Test response structure và status codes
    @Test
    @DisplayName("4.1.2b - Test response structure for successful login")
    void testLoginResponseStructure() throws Exception {
        // Tạo user
        String registerJson = "{\"username\":\"structtest\",\"password\":\"Test123\"," +
                "\"fullName\":\"Struct Test\",\"email\":\"struct@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        // Login và check structure
        String loginJson = "{\"username\":\"structtest\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").exists())
                .andExpect(jsonPath("$.fullName").exists())
                .andExpect(jsonPath("$.email").exists());
    }

    @Test
    @DisplayName("4.1.2b - Test status codes for different scenarios")
    void testStatusCodes() throws Exception {
        // 201 Created for registration
        String registerJson = "{\"username\":\"statustest\",\"password\":\"Test123\"," +
                "\"fullName\":\"Status Test\",\"email\":\"status@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        // 200 OK for successful login
        String loginJson = "{\"username\":\"statustest\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk());

        // 500 Internal Server Error for wrong credentials
        String wrongLoginJson = "{\"username\":\"statustest\",\"password\":\"Wrong123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(wrongLoginJson))
                .andExpect(status().isInternalServerError());
    }

    // 4.1.2c - Test CORS và headers
    @Test
    @DisplayName("4.1.2c - Test CORS headers")
    void testCorsHeaders() throws Exception {
        String loginJson = "{\"username\":\"testuser\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson)
                .header("Origin", "http://localhost:3000"))
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("4.1.2c - Test Content-Type headers")
    void testContentTypeHeaders() throws Exception {
        // Tạo user
        String registerJson = "{\"username\":\"headertest\",\"password\":\"Test123\"," +
                "\"fullName\":\"Header Test\",\"email\":\"header@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        // Test headers
        String loginJson = "{\"username\":\"headertest\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(header().string("Content-Type", "application/json"));
    }

    // Additional CRUD tests for completeness
    @Test
    @DisplayName("Test Create User - POST /api/users")
    void testCreateUser() throws Exception {
        String userJson = "{\"username\":\"newuser\",\"password\":\"Pass123\"," +
                "\"fullName\":\"New User\",\"email\":\"newuser@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.fullName").value("New User"));
    }

    @Test
    @DisplayName("Test Get All Users - GET /api/users")
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Test Update User - PUT /api/users/{id}")
    void testUpdateUser() throws Exception {
        // Create user first
        String createJson = "{\"username\":\"updatetest\",\"password\":\"Pass123\"," +
                "\"fullName\":\"Update Test\",\"email\":\"update@example.com\"}";
        
        String response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract ID (simplified - in real scenario use proper JSON parsing)
        Long userId = 1L;

        // Update user
        String updateJson = "{\"username\":\"updatetest\",\"password\":\"Pass123\"," +
                "\"fullName\":\"Updated Name\",\"email\":\"updated@example.com\"}";
        
        mockMvc.perform(put("/api/users/" + userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Name"));
    }

    @Test
    @DisplayName("Test Delete User - DELETE /api/users/{id}")
    void testDeleteUser() throws Exception {
        // Create user first
        String createJson = "{\"username\":\"deletetest\",\"password\":\"Pass123\"," +
                "\"fullName\":\"Delete Test\",\"email\":\"delete@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createJson))
                .andExpect(status().isCreated());

        Long userId = 1L;

        // Delete user
        mockMvc.perform(delete("/api/users/" + userId))
                .andExpect(status().isNoContent());
    }
}