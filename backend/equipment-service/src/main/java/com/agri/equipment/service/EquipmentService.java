package com.agri.equipment.service;

import com.agri.equipment.dto.EquipmentRequestDTO;
import com.agri.equipment.dto.EquipmentResponseDTO;
import com.agri.equipment.exception.EquipmentNotFoundException;
import com.agri.equipment.mapper.EquipmentMapper;
import com.agri.equipment.model.Equipment;
import com.agri.equipment.model.EquipmentCategory;
import com.agri.equipment.model.EquipmentStatus;
import com.agri.equipment.repository.EquipmentRepository;
import com.agri.equipment.repository.EquipmentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    @Transactional(readOnly = true)
    public Page<EquipmentResponseDTO> getAllEquipments(
            String search,
            EquipmentCategory category,
            EquipmentStatus status,
            Boolean isAvailable,
            Long ownerId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable) {

        Specification<Equipment> spec = EquipmentSpecification.withFilters(
                search, category, status, isAvailable, ownerId, minPrice, maxPrice);
        return equipmentRepository.findAll(spec, pageable)
                .map(equipmentMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public EquipmentResponseDTO getEquipmentById(Long id) {
        return equipmentMapper.toResponseDTO(findOrThrow(id));
    }

    @Transactional
    public EquipmentResponseDTO createEquipment(EquipmentRequestDTO request) {
        Equipment equipment = equipmentMapper.toEntity(request);
        Equipment saved = equipmentRepository.save(equipment);
        return equipmentMapper.toResponseDTO(saved);
    }

    @Transactional
    public EquipmentResponseDTO updateEquipment(Long id, EquipmentRequestDTO request) {
        Equipment existing = findOrThrow(id);
        equipmentMapper.updateEntity(existing, request);
        Equipment saved = equipmentRepository.save(existing);
        return equipmentMapper.toResponseDTO(saved);
    }

    @Transactional
    public EquipmentResponseDTO updateAvailability(Long id, boolean isAvailable) {
        Equipment existing = findOrThrow(id);
        if (isAvailable && existing.getStatus() != EquipmentStatus.OPERATIONAL) {
            throw new IllegalStateException(
                    "Un équipement avec le statut " + existing.getStatus() + " ne peut pas être rendu disponible");
        }
        existing.setIsAvailable(isAvailable);
        Equipment saved = equipmentRepository.save(existing);
        return equipmentMapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        Equipment existing = findOrThrow(id);
        equipmentRepository.delete(existing);
    }

    private Equipment findOrThrow(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new EquipmentNotFoundException(id));
    }
}
