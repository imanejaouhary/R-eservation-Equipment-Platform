package com.agri.equipment.service;

import com.agri.equipment.dto.EquipmentRequestDTO;
import com.agri.equipment.dto.EquipmentResponseDTO;
import com.agri.equipment.exception.EquipmentNotFoundException;
import com.agri.equipment.mapper.EquipmentMapper;
import com.agri.equipment.model.Equipment;
import com.agri.equipment.model.EquipmentCategory;
import com.agri.equipment.model.EquipmentStatus;
import com.agri.equipment.repository.EquipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTest {

    @Mock
    private EquipmentRepository equipmentRepository;

    private EquipmentService equipmentService;

    @BeforeEach
    void setUp() {
        equipmentService = new EquipmentService(equipmentRepository, new EquipmentMapper());
    }

    @Test
    void createEquipment_forcesUnavailable_whenStatusIsNotOperational() {
        EquipmentRequestDTO request = EquipmentRequestDTO.builder()
                .name("Tracteur John Deere")
                .category(EquipmentCategory.TRACTOR)
                .pricePerDay(new BigDecimal("250.00"))
                .status(EquipmentStatus.MAINTENANCE)
                .isAvailable(true)
                .build();

        when(equipmentRepository.save(any(Equipment.class))).thenAnswer(inv -> {
            Equipment eq = inv.getArgument(0);
            eq.setId(1L);
            return eq;
        });

        EquipmentResponseDTO result = equipmentService.createEquipment(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo("MAINTENANCE");
        assertThat(result.getIsAvailable()).isFalse();
    }

    @Test
    void updateAvailability_throwsException_whenEquipmentNotOperational() {
        Equipment eq = Equipment.builder()
                .id(1L)
                .name("Semoir")
                .category(EquipmentCategory.SEEDER)
                .pricePerDay(new BigDecimal("120.00"))
                .status(EquipmentStatus.OUT_OF_SERVICE)
                .isAvailable(false)
                .build();

        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(eq));

        assertThatThrownBy(() -> equipmentService.updateAvailability(1L, true))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("OUT_OF_SERVICE");
    }

    @Test
    void getEquipmentById_throwsNotFound_whenMissing() {
        when(equipmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> equipmentService.getEquipmentById(99L))
                .isInstanceOf(EquipmentNotFoundException.class);
    }

    @Test
    void deleteEquipment_deletesExistingEntity() {
        Equipment eq = Equipment.builder().id(5L).build();
        when(equipmentRepository.findById(5L)).thenReturn(Optional.of(eq));

        equipmentService.deleteEquipment(5L);

        verify(equipmentRepository).delete(eq);
    }
}
