package com.flogin.service.impl;

import com.flogin.dto.UserDTO;
import com.flogin.model.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của UserService
 * Xử lý business logic cho User/Authentication
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO dto) {
        // Validate username không rỗng
        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username không được để trống");
        }
        
        // Validate password không rỗng
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password không được để trống");
        }

        // Kiểm tra username đã tồn tại chưa
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã tồn tại");
        }

        // Tạo user mới
        User user = User.builder()
                .username(dto.getUsername())
                .password(dto.getPassword()) // Trong thực tế nên mã hóa password
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .build();

        return toDTO(userRepository.save(user));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với id: " + id));
        return toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với id: " + id));

        // Update các fields
        if (dto.getUsername() != null && !dto.getUsername().trim().isEmpty()) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(dto.getPassword());
        }
        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }

        return toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User không tồn tại với id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO login(String username, String password) {
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username không được để trống");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password không được để trống");
        }

        // Tìm user theo username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // Kiểm tra password
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // Login thành công
        return toDTO(user);
    }

    /**
     * Helper method: Convert User entity sang UserDTO
     */
    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword()) // Trong thực tế không nên return password
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}