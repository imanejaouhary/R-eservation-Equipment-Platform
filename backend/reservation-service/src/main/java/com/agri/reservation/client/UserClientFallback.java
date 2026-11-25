package com.agri.reservation.client;

import com.agri.reservation.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserClientFallback implements UserClient {

    @Override
    public UserDTO getUserById(Long id) {
        // Fallback en cas d'indisponibilité du service user
        return UserDTO.builder()
                .id(id)
                .username("Utilisateur Indisponible")
                .email("indisponible@service.local")
                .build();
    }
}
