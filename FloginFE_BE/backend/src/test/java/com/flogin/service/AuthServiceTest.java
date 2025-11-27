package com.flogin.service;

import com.flogin.config.AppConfig;
import com.flogin.dto.UserDTO;
import com.flogin.model.UserRequest;
import com.flogin.model.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private AuthService authService;
    private AppConfig appConfig;
    private BCryptPasswordEncoder passwordEncoder;

    private UserDTO defaultUser;

    @BeforeEach
    void setUp() {
        appConfig = mock(AppConfig.class);
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(appConfig);
        defaultUser = UserDTO.builder()
                .id(1)
                .username("testuser")
                .password(passwordEncoder.encode("Test123"))
                .name("Demo User")
                .build();

        when(appConfig.getDefaultUser()).thenReturn(defaultUser);
    }

    @Test
    @DisplayName("TC_LOGIN_001 - Dang nhap thanh cong voi credentials hop le")
    void testLoginSuccess() {
        UserRequest request = new UserRequest();
        request.setUsername("testuser");
        request.setPassword("Test123");

        UserResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals(defaultUser.getId(), response.getId());
        assertEquals(defaultUser.getUsername(), response.getUsername());
        assertEquals(defaultUser.getName(), response.getName());
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC_LOGIN_002 - Dang nhap that bai khi username de trong")
    void testLoginUsernameEmpty() {
        UserRequest request = new UserRequest();
        request.setUsername("");
        request.setPassword("Test123");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Ten dang nhap hoac mat khau khong dung!", exception.getMessage());
    }

    @Test
    @DisplayName("TC_LOGIN_003 - Dang nhap that bai khi password de trong")
    void testLoginPasswordEmpty() {
        UserRequest request = new UserRequest();
        request.setUsername("testuser");
        request.setPassword("");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Ten dang nhap hoac mat khau khong dung!", exception.getMessage());
    }

    @Test
    @DisplayName("TC_LOGIN_004 - Dang nhap that bai khi password sai")
    void testLoginWrongPassword() {
        UserRequest request = new UserRequest();
        request.setUsername("testuser");
        request.setPassword("WrongPass123");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Ten dang nhap hoac mat khau khong dung!", exception.getMessage());
    }

    @Test
    @DisplayName("TC_LOGIN_005 - Dang nhap that bai khi username khong ton tai")
    void testLoginUserNotExist() {
        UserRequest request = new UserRequest();
        request.setUsername("unknownuser");
        request.setPassword("Test123");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Ten dang nhap hoac mat khau khong dung!", exception.getMessage());
    }
}
