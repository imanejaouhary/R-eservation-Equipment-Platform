package com.agri.reservation.client;

import com.agri.reservation.dto.PaymentRequestDTO;
import com.agri.reservation.dto.PaymentResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service", url = "${application.clients.payment-service.url:}")
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentResponseDTO processPayment(@RequestBody PaymentRequestDTO paymentRequest);
}
