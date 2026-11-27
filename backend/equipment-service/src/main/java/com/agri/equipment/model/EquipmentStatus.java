package com.agri.equipment.model;

/**
 * État opérationnel d'un équipement agricole.
 * Un équipement non OPERATIONAL ne peut pas être disponible à la location.
 */
public enum EquipmentStatus {
    OPERATIONAL,
    MAINTENANCE,
    OUT_OF_SERVICE
}
