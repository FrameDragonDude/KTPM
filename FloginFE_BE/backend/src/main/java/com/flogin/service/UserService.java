package com.flogin.service;

import com.flogin.dto.UserDTO;

public interface UserService {
    UserDTO createUser(UserDTO dto);
    UserDTO login(String username, String password);
}
