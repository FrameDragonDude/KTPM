package com.flogin.dto;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    String username;

    String password;

    String name;
}
