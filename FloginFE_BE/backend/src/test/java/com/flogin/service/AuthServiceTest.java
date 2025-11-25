package com.flogin.service;

import com.flogin.dto.UserDTO;
import com.flogin.model.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private User sampleUser;

    @BeforeEach
    void setup() {
        sampleUser = User.builder()
                .id(1L)
                .username("testuser")
                .password(passwordEncoder.encode("Test123"))
                .fullName("Test User")
                .email("test@example.com")
                .build();
    }

    @Test
    void testLoginSuccess() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));

        UserDTO dto = userService.login("testuser", "Test123");

        assertNotNull(dto);
        assertEquals("testuser", dto.getUsername());
        assertNull(dto.getPassword());
    }

    @Test
    void testLoginUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.login("unknown", "Test123"));

        assertEquals("User không tồn tại", ex.getMessage());
    }

    @Test
    void testLoginWrongPassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.login("testuser", "WrongPass"));

        assertEquals("Sai mật khẩu", ex.getMessage());
    }

    @Test
    void testLoginEmptyUsernameOrPassword() {
        RuntimeException ex1 = assertThrows(RuntimeException.class,
                () -> userService.login("", "Test123"));
        assertEquals("Username cannot be empty", ex1.getMessage());

        RuntimeException ex2 = assertThrows(RuntimeException.class,
                () -> userService.login("testuser", ""));
        assertEquals("Password cannot be empty", ex2.getMessage());
    }
}
