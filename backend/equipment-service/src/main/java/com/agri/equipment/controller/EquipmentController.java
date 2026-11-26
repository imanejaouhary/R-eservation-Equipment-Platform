package com.agri.equipment.controller;

import com.agri.equipment.dto.AvailabilityUpdateDTO;
import com.agri.equipment.dto.EquipmentRequestDTO;
import com.agri.equipment.dto.EquipmentResponseDTO;
import com.agri.equipment.model.EquipmentCategory;
import com.agri.equipment.model.EquipmentStatus;
import com.agri.equipment.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<Page<EquipmentResponseDTO>> getAllEquipments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EquipmentCategory category,
            @RequestParam(required = false) EquipmentStatus status,
            @RequestParam(required = false) Boolean isAvailable,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {

        return ResponseEntity.ok(equipmentService.getAllEquipments(
                search, category, status, isAvailable, ownerId, minPrice, maxPrice, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponseDTO> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @PostMapping
    public ResponseEntity<EquipmentResponseDTO> createEquipment(@Valid @RequestBody EquipmentRequestDTO request) {
        EquipmentResponseDTO created = equipmentService.createEquipment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponseDTO> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequestDTO request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<EquipmentResponseDTO> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityUpdateDTO request) {
        return ResponseEntity.ok(equipmentService.updateAvailability(id, request.getIsAvailable()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
