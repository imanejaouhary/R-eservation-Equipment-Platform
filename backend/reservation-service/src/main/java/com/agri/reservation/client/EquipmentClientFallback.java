package com.agri.reservation.client;

import com.agri.reservation.dto.EquipmentDTO;
import org.springframework.stereotype.Component;

@Component
public class EquipmentClientFallback implements EquipmentClient {

    @Override
    public EquipmentDTO getEquipmentById(Long id) {
        // Fallback en cas d'indisponibilité du service equipment
        return EquipmentDTO.builder()
                .id(id)
                .name("Équipement Temporairement Indisponible")
                .isAvailable(false)
                .build();
    }
}
