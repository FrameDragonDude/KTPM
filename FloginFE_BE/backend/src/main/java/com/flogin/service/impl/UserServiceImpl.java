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

        if (!passwordEncoder.matches(password, user.getPassword())) {
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
}
