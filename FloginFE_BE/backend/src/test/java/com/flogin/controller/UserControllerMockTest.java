package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
// import com.flogin.controller.UserController; // Xóa vì không dùng
import com.flogin.dto.UserDTO;
import com.flogin.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 5.1.2 Backend Mocking
 * Mock dependencies trong Backend tests
 * Test UserController với mocked UserService
 */
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(UserController.class)
@Import(UserControllerMockTest.NoSecurityConfig.class)
@AutoConfigureMockMvc(addFilters = false)

public class UserControllerMockTest {
        // Disable security for mock tests
        @TestConfiguration
        static class NoSecurityConfig {
                @Bean
                public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                        http.csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
                        return http.build();
                }
        }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // 5.1.2a - Mock UserService với @MockBean
    @MockBean
    private UserService userService;

    // 5.1.2b - Test controller với mocked service
    @Test
    @DisplayName("5.1.2b - Test login with mocked service - Success")
    void testLoginWithMockedServiceSuccess() throws Exception {
        // Mock data
        UserDTO mockUser = UserDTO.builder()
                .id(1)
                .username("testuser")
                .password("Test123")
                .fullName("Test User")
                .email("test@example.com")
                .build();

        // Mock service behavior
        when(userService.login(eq("testuser"), eq("Test123")))
                .thenReturn(mockUser);

        // Test login endpoint
        String loginJson = "{\"username\":\"testuser\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        // 5.1.2c - Verify mock interactions
        verify(userService, times(1)).login("testuser", "Test123");
    }

    @Test
    @DisplayName("5.1.2b - Test login with mocked service - Wrong Password")
    void testLoginWithMockedServiceWrongPassword() throws Exception {
        // Mock service to throw exception for wrong password
        when(userService.login(eq("testuser"), eq("WrongPass")))
                .thenThrow(new RuntimeException("Sai mật khẩu"));

        String loginJson = "{\"username\":\"testuser\",\"password\":\"WrongPass\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isInternalServerError());

        // Verify mock was called
        verify(userService, times(1)).login("testuser", "WrongPass");
    }

    @Test
    @DisplayName("5.1.2b - Test login with mocked service - User Not Found")
    void testLoginWithMockedServiceUserNotFound() throws Exception {
        // Mock service to throw exception for non-existent user
        when(userService.login(eq("nonexistent"), anyString()))
                .thenThrow(new RuntimeException("User không tồn tại"));

        String loginJson = "{\"username\":\"nonexistent\",\"password\":\"Pass123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isInternalServerError());

        verify(userService, times(1)).login("nonexistent", "Pass123");
    }

    @Test
    @DisplayName("5.1.2b - Test create user with mocked service")
    void testCreateUserWithMockedService() throws Exception {
        UserDTO inputDTO = UserDTO.builder()
                .username("newuser")
                .password("Pass123")
                .fullName("New User")
                .email("newuser@example.com")
                .build();

        UserDTO createdDTO = UserDTO.builder()
                .id(10)
                .username("newuser")
                .password("Pass123")
                .fullName("New User")
                .email("newuser@example.com")
                .build();

        when(userService.createUser(any(UserDTO.class)))
                .thenReturn(createdDTO);

        String userJson = objectMapper.writeValueAsString(inputDTO);
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.username").value("newuser"));

        verify(userService, times(1)).createUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("5.1.2b - Test get all users with mocked service")
    void testGetAllUsersWithMockedService() throws Exception {
        List<UserDTO> mockUsers = Arrays.asList(
                UserDTO.builder()
                        .id(1)
                        .username("user1")
                        .fullName("User One")
                        .email("user1@example.com")
                        .build(),
                UserDTO.builder()
                        .id(2)
                        .username("user2")
                        .fullName("User Two")
                        .email("user2@example.com")
                        .build()
        );

        when(userService.getAllUsers()).thenReturn(mockUsers);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].username").value("user1"))
                .andExpect(jsonPath("$[1].username").value("user2"));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    @DisplayName("5.1.2b - Test get user by id with mocked service")
    void testGetUserByIdWithMockedService() throws Exception {
        UserDTO mockUser = UserDTO.builder()
                .id(5)
                .username("user5")
                .fullName("User Five")
                .email("user5@example.com")
                .build();

        when(userService.getUserById(5)).thenReturn(mockUser);

        mockMvc.perform(get("/api/users/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.username").value("user5"));

        verify(userService, times(1)).getUserById(5);
    }

    @Test
    @DisplayName("5.1.2b - Test update user with mocked service")
    void testUpdateUserWithMockedService() throws Exception {
        UserDTO updatedDTO = UserDTO.builder()
                .id(3)
                .username("user3")
                .password("NewPass123")
                .fullName("Updated User Three")
                .email("updated3@example.com")
                .build();

        when(userService.updateUser(eq(3), any(UserDTO.class)))
                .thenReturn(updatedDTO);

        String updateJson = "{\"username\":\"user3\",\"password\":\"NewPass123\"," +
                "\"fullName\":\"Updated User Three\",\"email\":\"updated3@example.com\"}";
        
        mockMvc.perform(put("/api/users/3")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated User Three"));

        verify(userService, times(1)).updateUser(eq(3), any(UserDTO.class));
    }

    @Test
    @DisplayName("5.1.2b - Test delete user with mocked service")
    void testDeleteUserWithMockedService() throws Exception {
        doNothing().when(userService).deleteUser(7);

        mockMvc.perform(delete("/api/users/7"))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(7);
    }

    // 5.1.2c - Verify mock interactions
    @Test
    @DisplayName("5.1.2c - Verify multiple mock interactions")
    void testVerifyMultipleMockInteractions() throws Exception {
        UserDTO mockUser = UserDTO.builder()
                .id(1)
                .username("testuser")
                .password("Test123")
                .fullName("Test User")
                .email("test@example.com")
                .build();

        when(userService.login(anyString(), anyString())).thenReturn(mockUser);

        // Perform multiple login requests
        String loginJson1 = "{\"username\":\"user1\",\"password\":\"Pass1\"}";
        String loginJson2 = "{\"username\":\"user2\",\"password\":\"Pass2\"}";
        String loginJson3 = "{\"username\":\"user3\",\"password\":\"Pass3\"}";

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson1));

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson2));

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson3));

        // Verify service was called exactly 3 times
        verify(userService, times(3)).login(anyString(), anyString());
        
        // Verify specific calls
        verify(userService).login("user1", "Pass1");
        verify(userService).login("user2", "Pass2");
        verify(userService).login("user3", "Pass3");
    }

    @Test
    @DisplayName("5.1.2c - Verify no interactions after failed login")
    void testVerifyNoInteractionsAfterFailedLogin() throws Exception {
        when(userService.login(anyString(), anyString()))
                .thenThrow(new RuntimeException("Sai mật khẩu"));

        String loginJson = "{\"username\":\"test\",\"password\":\"wrong\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isInternalServerError());

        // Verify service was called once
        verify(userService, times(1)).login("test", "wrong");
        
        // Verify no other methods were called
        verify(userService, never()).createUser(any());
        verify(userService, never()).getAllUsers();
        verify(userService, never()).getUserById(anyInt());
    }

    @Test
    @DisplayName("5.1.2c - Verify argument matchers")
    void testVerifyArgumentMatchers() throws Exception {
        UserDTO mockUser = UserDTO.builder()
                .id(1)
                .username("testuser")
                .password("Test123")
                .fullName("Test User")
                .email("test@example.com")
                .build();

        when(userService.login(anyString(), anyString())).thenReturn(mockUser);

        String loginJson = "{\"username\":\"testuser\",\"password\":\"Test123\"}";
        
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson));

        // Verify with exact arguments
        verify(userService).login(eq("testuser"), eq("Test123"));
        
        // Verify with any matchers
        verify(userService).login(anyString(), anyString());
        
        // Verify NOT called with specific arguments
        verify(userService, never()).login(eq("wronguser"), anyString());
    }
}