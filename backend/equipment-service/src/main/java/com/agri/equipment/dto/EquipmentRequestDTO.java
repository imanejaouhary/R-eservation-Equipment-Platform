package com.agri.equipment.dto;

import com.agri.equipment.model.EquipmentCategory;
import com.agri.equipment.model.EquipmentStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentRequestDTO {

    @NotBlank(message = "Le nom de l'équipement est obligatoire")
    @Size(max = 120, message = "Le nom ne doit pas dépasser 120 caractères")
    private String name;

    @Size(max = 2000, message = "La description ne doit pas dépasser 2000 caractères")
    private String description;

    @NotNull(message = "La catégorie est obligatoire")
    private EquipmentCategory category;

    @NotNull(message = "Le prix journalier est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix journalier doit être supérieur à 0")
    @Digits(integer = 8, fraction = 2, message = "Format du prix invalide (max 8 chiffres entiers, 2 décimales)")
    private BigDecimal pricePerDay;

    @JsonProperty("isAvailable")
    private Boolean isAvailable;

    private EquipmentStatus status;

    private Long ownerId;

    @Size(max = 150, message = "La localisation ne doit pas dépasser 150 caractères")
    private String location;

    @Size(max = 500, message = "L'URL de l'image ne doit pas dépasser 500 caractères")
    private String imageUrl;
}
