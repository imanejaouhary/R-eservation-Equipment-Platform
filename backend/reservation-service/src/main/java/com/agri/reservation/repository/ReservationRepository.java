package com.agri.reservation.repository;

import com.agri.reservation.model.Reservation;
import com.agri.reservation.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByEquipmentId(Long equipmentId);
    List<Reservation> findByStatus(ReservationStatus status);
}
