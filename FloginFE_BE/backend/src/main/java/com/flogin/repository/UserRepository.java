package com.flogin.repository;

import com.flogin.dto.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserDTO, Integer> {
    Optional<UserDTO> findByUsername(String username);
    boolean existsByUsername(String username);
}