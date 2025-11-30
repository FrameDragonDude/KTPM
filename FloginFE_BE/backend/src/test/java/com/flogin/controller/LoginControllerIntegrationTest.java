package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(LoginControllerIntegrationTest.class)
public class LoginControllerIntegrationTest {

    // @org.springframework.boot.test.context.TestConfiguration
    // static class TestSecurityConfig {
    //     @org.springframework.context.annotation.Bean
    //     public org.springframework.security.web.SecurityFilterChain filterChain(
    //             org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {
    //         http.csrf().disable().authorizeHttpRequests().anyRequest().permitAll();
    //         return http.build();
    //     }
    // }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    // success
    @Test
    @DisplayName("Integration - Login Success")
    void testLoginSuccess() throws Exception {

        String json = "{ \"email\": \"user@gmail.com\", \"password\": \"123456\" }";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.type").value("Bearer"));
    }

    @Test
    @DisplayName("Integration - Login Failed")
    void testLoginFailed() throws Exception {

        String json = "{ \"email\": \"wrong@gmail.com\", \"password\": \"111\" }";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }
}
