package com.agri.reservation.controller;

import com.agri.reservation.dto.ReservationDetailsDTO;
import com.agri.reservation.model.Reservation;
import com.agri.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ReservationDetailsDTO> getReservationDetails(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationDetails(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<List<Reservation>> getReservationsByEquipment(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(reservationService.getReservationsByEquipment(equipmentId));
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody Reservation reservation) {
        Reservation created = reservationService.createReservation(reservation);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Reservation> confirmAndPay(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String paymentMethod = payload != null ? payload.get("paymentMethod") : "CARD";
        return ResponseEntity.ok(reservationService.confirmAndPayReservation(id, paymentMethod));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
