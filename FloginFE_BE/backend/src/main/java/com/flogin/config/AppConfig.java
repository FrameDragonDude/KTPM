package com.flogin.config;

import com.flogin.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.default.username}")
    private String username;

    @Value("${app.default.password}")
    private String password;

    @Value("${app.default.name}")
    private String name;

    public UserDTO getDefaultUser() {
        return UserDTO.builder()
                .id(1)
                .username(username)
                .password(password)
                .name(name)
                .build();
    }
}
