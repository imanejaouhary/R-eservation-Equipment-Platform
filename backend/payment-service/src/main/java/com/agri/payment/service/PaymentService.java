package com.agri.payment.service;

import com.agri.payment.dto.PaymentRequestDTO;
import com.agri.payment.dto.PaymentResponseDTO;
import com.agri.payment.model.Payment;
import com.agri.payment.model.PaymentStatus;
import com.agri.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    /**
     * Process a payment request with simulated payment gateway logic.
     * Generates a unique transactionId and sets status based on simulation.
     */
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        log.info("Processing payment for reservationId={}, userId={}, amount={}",
                request.getReservationId(), request.getUserId(), request.getAmount());

        // Simulate payment processing: 90% success rate
        PaymentStatus status = simulatePaymentProcessing();
        String transactionId = generateTransactionId();

        Payment payment = Payment.builder()
                .reservationId(request.getReservationId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(status)
                .transactionId(transactionId)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment saved: id={}, status={}, transactionId={}", saved.getId(), saved.getStatus(), saved.getTransactionId());

        return toResponseDTO(saved);
    }

    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return toResponseDTO(payment);
    }

    public List<PaymentResponseDTO> getPaymentsByReservationId(Long reservationId) {
        return paymentRepository.findByReservationId(reservationId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private PaymentStatus simulatePaymentProcessing() {
        // Simulate a 90% success rate
        double random = Math.random();
        if (random < 0.9) {
            return PaymentStatus.SUCCESS;
        } else {
            return PaymentStatus.FAILED;
        }
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().toUpperCase().replace("-", "").substring(0, 16);
    }

    private PaymentResponseDTO toResponseDTO(Payment payment) {
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .reservationId(payment.getReservationId())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .transactionId(payment.getTransactionId())
                .build();
    }
}
