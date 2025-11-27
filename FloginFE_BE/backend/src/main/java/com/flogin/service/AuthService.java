package com.flogin.service;

import com.flogin.config.AppConfig;
import com.flogin.dto.UserDTO;
import com.flogin.model.UserRequest;
import com.flogin.model.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppConfig appConfig;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private String generateToken(UserDTO user) {
        String data = user.getId() + ":" + (System.currentTimeMillis() + 3600000);
        return Base64.getEncoder().encodeToString((data + ":SECRET_KEY").getBytes());
    }

    public UserResponse login(UserRequest request) {
        UserDTO user = appConfig.getDefaultUser();

        if (!user.getUsername().equals(request.getUsername()) ||
                !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng!");
        }

        String token = generateToken(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .token(token)
                .build();
    }
}
