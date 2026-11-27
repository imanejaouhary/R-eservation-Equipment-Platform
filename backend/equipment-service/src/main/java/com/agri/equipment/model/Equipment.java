package com.agri.equipment.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EquipmentCategory category;

    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EquipmentStatus status;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(length = 150)
    private String location;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = EquipmentStatus.OPERATIONAL;
        }
        if (this.isAvailable == null) {
            this.isAvailable = true;
        }
        enforceAvailabilityConsistency();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        enforceAvailabilityConsistency();
    }

    /**
     * Garantit qu'un équipement non opérationnel n'est jamais marqué disponible.
     */
    public void enforceAvailabilityConsistency() {
        if (this.status != EquipmentStatus.OPERATIONAL) {
            this.isAvailable = false;
        }
    }
}
