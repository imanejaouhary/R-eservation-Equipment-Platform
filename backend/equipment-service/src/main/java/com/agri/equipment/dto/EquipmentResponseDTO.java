package com.agri.equipment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String category;
    private String status;
    private BigDecimal pricePerDay;

    @JsonProperty("isAvailable")
    private Boolean isAvailable;

    private Long ownerId;
    private String location;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
