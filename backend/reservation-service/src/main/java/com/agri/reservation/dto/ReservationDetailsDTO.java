package com.agri.reservation.dto;

import com.agri.reservation.model.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDetailsDTO {
    private Reservation reservation;
    private UserDTO user;
    private EquipmentDTO equipment;
}
