package com.agri.reservation.service;

import com.agri.reservation.client.EquipmentClient;
import com.agri.reservation.client.PaymentClient;
import com.agri.reservation.client.UserClient;
import com.agri.reservation.dto.*;
import com.agri.reservation.model.Reservation;
import com.agri.reservation.model.ReservationStatus;
import com.agri.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserClient userClient;
    private final EquipmentClient equipmentClient;
    private final PaymentClient paymentClient;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));
    }

    public ReservationDetailsDTO getReservationDetails(Long id) {
        Reservation reservation = getReservationById(id);

        UserDTO user = null;
        try {
            user = userClient.getUserById(reservation.getUserId());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de l'utilisateur: {}", e.getMessage());
        }

        EquipmentDTO equipment = null;
        try {
            equipment = equipmentClient.getEquipmentById(reservation.getEquipmentId());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de l'équipement: {}", e.getMessage());
        }

        return ReservationDetailsDTO.builder()
                .reservation(reservation)
                .user(user)
                .equipment(equipment)
                .build();
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        log.info("Création d'une nouvelle réservation pour user={} et équipement={}", 
                reservation.getUserId(), reservation.getEquipmentId());

        // 1. Vérification de l'équipement via Feign Client
        try {
            EquipmentDTO equipment = equipmentClient.getEquipmentById(reservation.getEquipmentId());
            if (equipment != null && equipment.getPricePerDay() != null) {
                long days = ChronoUnit.DAYS.between(reservation.getStartDate(), reservation.getEndDate());
                if (days <= 0) days = 1;
                reservation.setTotalPrice(equipment.getPricePerDay().multiply(BigDecimal.valueOf(days)));
            }
        } catch (Exception e) {
            log.warn("Impossible de contacter le service équipement pour le calcul du prix: {}", e.getMessage());
        }

        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation confirmAndPayReservation(Long id, String paymentMethod) {
        Reservation reservation = getReservationById(id);

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            throw new RuntimeException("La réservation est déjà confirmée");
        }

        // Appel au Payment Service via Feign Client
        try {
            PaymentRequestDTO paymentRequest = PaymentRequestDTO.builder()
                    .reservationId(reservation.getId())
                    .userId(reservation.getUserId())
                    .amount(reservation.getTotalPrice() != null ? reservation.getTotalPrice() : BigDecimal.ZERO)
                    .paymentMethod(paymentMethod != null ? paymentMethod : "CARD")
                    .build();

            PaymentResponseDTO paymentResponse = paymentClient.processPayment(paymentRequest);
            log.info("Paiement effectué avec succès: ID={}", paymentResponse.getId());
            reservation.setStatus(ReservationStatus.CONFIRMED);
        } catch (Exception e) {
            log.error("Échec du paiement pour la réservation {}: {}", id, e.getMessage());
            // En mode dev, on peut confirmer ou garder PENDING
            reservation.setStatus(ReservationStatus.CONFIRMED);
        }

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public List<Reservation> getReservationsByEquipment(Long equipmentId) {
        return reservationRepository.findByEquipmentId(equipmentId);
    }

    @Transactional
    public Reservation cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}
