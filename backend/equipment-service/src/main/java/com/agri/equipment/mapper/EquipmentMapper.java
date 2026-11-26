package com.agri.equipment.mapper;

import com.agri.equipment.dto.EquipmentRequestDTO;
import com.agri.equipment.dto.EquipmentResponseDTO;
import com.agri.equipment.model.Equipment;
import com.agri.equipment.model.EquipmentStatus;
import org.springframework.stereotype.Component;

@Component
public class EquipmentMapper {

    public Equipment toEntity(EquipmentRequestDTO dto) {
        EquipmentStatus status = dto.getStatus() != null ? dto.getStatus() : EquipmentStatus.OPERATIONAL;
        boolean available = dto.getIsAvailable() != null ? dto.getIsAvailable() : true;

        Equipment equipment = Equipment.builder()
                .name(dto.getName().trim())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .pricePerDay(dto.getPricePerDay())
                .status(status)
                .isAvailable(available)
                .ownerId(dto.getOwnerId())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .build();
        equipment.enforceAvailabilityConsistency();
        return equipment;
    }

    public void updateEntity(Equipment equipment, EquipmentRequestDTO dto) {
        equipment.setName(dto.getName().trim());
        equipment.setDescription(dto.getDescription());
        equipment.setCategory(dto.getCategory());
        equipment.setPricePerDay(dto.getPricePerDay());
        if (dto.getStatus() != null) {
            equipment.setStatus(dto.getStatus());
        }
        if (dto.getIsAvailable() != null) {
            equipment.setIsAvailable(dto.getIsAvailable());
        }
        equipment.setOwnerId(dto.getOwnerId());
        equipment.setLocation(dto.getLocation());
        equipment.setImageUrl(dto.getImageUrl());
        equipment.enforceAvailabilityConsistency();
    }

    public EquipmentResponseDTO toResponseDTO(Equipment equipment) {
        return EquipmentResponseDTO.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .description(equipment.getDescription())
                .category(equipment.getCategory() != null ? equipment.getCategory().name() : null)
                .status(equipment.getStatus() != null ? equipment.getStatus().name() : null)
                .pricePerDay(equipment.getPricePerDay())
                .isAvailable(equipment.getIsAvailable())
                .ownerId(equipment.getOwnerId())
                .location(equipment.getLocation())
                .imageUrl(equipment.getImageUrl())
                .createdAt(equipment.getCreatedAt())
                .updatedAt(equipment.getUpdatedAt())
                .build();
    }
}
