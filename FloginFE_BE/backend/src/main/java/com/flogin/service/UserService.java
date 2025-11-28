package com.flogin.service;

import com.flogin.dto.UserDTO;
import java.util.List;

/**
 * Interface cho User Service
 * Chứa các phương thức CRUD và quản lý user, bao gồm đăng nhập
 */
public interface UserService {

    /**
     * Tạo user mới (đăng ký)
     * @param dto thông tin user
     * @return UserDTO đã tạo
     */
    UserDTO createUser(UserDTO dto);

    /**
     * Lấy danh sách tất cả user
     * @return List<UserDTO>
     */
    List<UserDTO> getAllUsers();

    /**
     * Lấy thông tin user theo ID
     * @param id ID của user
     * @return UserDTO
     */
    UserDTO getUserById(int id);

    /**
     * Cập nhật thông tin user
     * @param id ID của user
     * @param dto thông tin mới
     * @return UserDTO đã cập nhật
     */
    UserDTO updateUser(int id, UserDTO dto);

    /**
     * Xóa user theo ID
     * @param id ID của user
     */
    void deleteUser(int id);

    /**
     * Đăng nhập user
     * @param username username
     * @param password password
     * @return UserDTO nếu đăng nhập thành công, throw exception nếu thất bại
     */
    UserDTO login(String username, String password);
}