package com.agri.payment.controller;

import com.agri.payment.dto.PaymentRequestDTO;
import com.agri.payment.dto.PaymentResponseDTO;
import com.agri.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * POST /api/payments
     * Called by reservation-service via OpenFeign to process a payment.
     */
    @PostMapping
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody PaymentRequestDTO request) {
        log.info("Received payment request: {}", request);
        PaymentResponseDTO response = paymentService.processPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/payments/{id}
     * Retrieve a payment by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long id) {
        PaymentResponseDTO response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/payments/reservation/{reservationId}
     * Retrieve all payments linked to a specific reservation.
     */
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByReservation(@PathVariable Long reservationId) {
        List<PaymentResponseDTO> payments = paymentService.getPaymentsByReservationId(reservationId);
        return ResponseEntity.ok(payments);
    }
}
