package com.flogin.service.impl;

import com.flogin.dto.UserDTO;
import com.flogin.model.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional
    public UserDTO createUser(UserDTO dto) {
                if (dto.getUsername() == null || dto.getUsername().isBlank()) {
                    throw new RuntimeException("Username không được để trống");
                }
                if (dto.getPassword() == null || dto.getPassword().isBlank()) {
                    throw new RuntimeException("Password không được để trống");
                }
        // Kiểm tra tồn tại username
        userRepository.findByUsername(dto.getUsername()).ifPresent(u -> {
            throw new RuntimeException("Username already exists");
        });

        // Hash password
        String hashed = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .username(dto.getUsername())
                .password(hashed)
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .build();

        User saved = userRepository.save(user);
        dto.setId(saved.getId());
        dto.setPassword(null); // Không trả password ra client
        return dto;
    }

    @Override
    public UserDTO login(String username, String password) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Username cannot be empty");
        }
        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password cannot be empty");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // Temporary: Plain text password check for existing DB users
        if (!user.getPassword().equals(password) && !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // Trả về DTO (có thể thêm token/session)
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    @Override
public java.util.List<UserDTO> getAllUsers() {
    java.util.List<User> users = userRepository.findAll();
    java.util.List<UserDTO> dtos = new java.util.ArrayList<>();
    for (User user : users) {
        dtos.add(UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build());
    }
    return dtos;
}

@Override
public UserDTO getUserById(int id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    return UserDTO.builder()
        .id(user.getId())
        .username(user.getUsername())
        .fullName(user.getFullName())
        .email(user.getEmail())
        .build();
}

@Override
public UserDTO updateUser(int id, UserDTO dto) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    user.setUsername(dto.getUsername());
    if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
    }
    user.setFullName(dto.getFullName());
    user.setEmail(dto.getEmail());
    User updated = userRepository.save(user);
    return UserDTO.builder()
            .id(updated.getId())
            .username(updated.getUsername())
            .fullName(updated.getFullName())
            .email(updated.getEmail())
            .build();
}

@Override
public void deleteUser(int id) {
    userRepository.deleteById(id);
}
}