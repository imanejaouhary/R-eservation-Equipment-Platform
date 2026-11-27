package com.agri.equipment.exception;

public class EquipmentNotFoundException extends RuntimeException {

    public EquipmentNotFoundException(Long id) {
        super("Équipement non trouvé avec l'ID : " + id);
    }
}
