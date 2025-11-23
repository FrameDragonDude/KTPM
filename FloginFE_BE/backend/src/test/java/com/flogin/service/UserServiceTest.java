package com.flogin.service;


import com.flogin.dto.UserDTO;
import com.flogin.model.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User userTest;

    private UserDTO userDTOTest;

    @BeforeEach
    void setUp() {

        userTest = User.builder()
                .id(1L)
                .username("testuser")
                .password("Test123")
                .fullName("Test User")
                .email("testuser@example.com")
                .build();

        userDTOTest = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .password("Test123")
                .fullName("Test User")
                .email("testuser@example.com")
                .build();



    }

//    login_test_cases:
//            - id: TC_LOGIN_001
//    name: "Successful login with valid credentials"
//    priority: Critical
//    preconditions:
//            - "User account exists"
//            - "Application running"
//    steps:
//            - "Navigate to login page"
//            - "Enter valid username"
//            - "Enter valid password"
//            - "Click Login button"
//    test_data:
//    username: "testuser"
//    password: "Test123"
//    expected_result:
//            - "Success message displayed"
//            - "Token stored"
//            - "Redirect to dashboard"
//    actual_result: ""
//    status: "Not Run"
    @Test
    @DisplayName("Tạo user mới")
    void testCreateUser() {
        when(userRepository.save(any(User.class))).thenReturn(userTest);
        UserDTO result = userService.createUser(userDTOTest);
        assertNotNull(result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("Test User", result.getFullName());
        assertEquals("testuser@example.com", result.getEmail());
    }

    //
//            - id: TC_LOGIN_002
//    name: "Fail login with empty username"
//    priority: High
//    preconditions:
//            - "Application running"
//    steps:
//            - "Navigate to login page"
//            - "Leave username empty"
//            - "Enter valid password"
//            - "Click Login button"
//    test_data:
//    username: ""
//    password: "Test123"
//    expected_result:
//            - 'Throws RuntimeException: "Username cannot be empty"'
//    actual_result: ""
//    status: "Not Run"
    @Test
    @DisplayName("Lỗi: username rỗng")
    void testCreateUserEmptyUsername() {
        userDTOTest.setUsername("");
        Exception exception = assertThrows(RuntimeException.class,
                () -> userService.createUser(userDTOTest));
        assertEquals("Username không được để trống", exception.getMessage());
    }


//
//            - id: TC_LOGIN_003
//    name: "Fail login with empty password"
//    priority: High
//    preconditions:
//            - "Application running"
//    steps:
//            - "Navigate to login page"
//            - "Enter valid username"
//            - "Leave password empty"
//            - "Click Login button"
//    test_data:
//    username: "testuser"
//    password: ""
//    expected_result:
//            - 'Throws RuntimeException: "Password cannot be empty"'
//    actual_result: ""
//    status: "Not Run"
    @Test
    @DisplayName("Lỗi: password rỗng")
    void testCreateUserEmptyPassword() {
        userDTOTest.setPassword("");
        Exception exception = assertThrows(RuntimeException.class,
                () -> userService.createUser(userDTOTest));
        assertEquals("Password không được để trống", exception.getMessage());
    }

    //
//            - id: TC_LOGIN_004
//    name: "Fail login with wrong password"
//    priority: Critical
//    preconditions:
//            - "User account exists"
//    steps:
//            - "Navigate to login page"
//            - "Enter valid username"
//            - "Enter wrong password"
//            - "Click Login button"
//    test_data:
//    username: "testuser"
//    password: "WrongPass123"
//    expected_result:
//            - 'Throws RuntimeException: "Wrong password"'
//    actual_result: ""
//    status: "Not Run"
//
    @Test
    @DisplayName("Đăng nhập thất bại do mật khẩu sai")
    void testLoginWrongPassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(java.util.Optional.of(userTest));
        Exception exception = assertThrows(RuntimeException.class,
                () -> userService.login("testuser", "WrongPass123"));
        assertEquals("Sai mật khẩu", exception.getMessage());
    }


    //            - id: TC_LOGIN_005
//    name: "Fail login with non-existent username"
//    priority: Critical
//    preconditions:
//            - "Application running"
//    steps:
//            - "Navigate to login page"
//            - "Enter username that does not exist"
//            - "Enter any password"
//            - "Click Login button"
//    test_data:
//    username: "unknownuser"
//    password: "Test123"
//    expected_result:
//            - 'Throws RuntimeException: "User does not exist"'
//    actual_result: ""
//    status: "Not Run"
    @Test
    @DisplayName("Login fails with non-existent username")
    void testLoginNonExistentUsername() {
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class,
                () -> userService.login("unknownuser", "Test123"));
        assertEquals("User không tồn tại", exception.getMessage());
    }





}
