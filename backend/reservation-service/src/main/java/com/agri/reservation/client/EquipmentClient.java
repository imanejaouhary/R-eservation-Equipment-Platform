package com.agri.reservation.client;

import com.agri.reservation.dto.EquipmentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "equipment-service", url = "${application.clients.equipment-service.url:}", fallback = EquipmentClientFallback.class)
public interface EquipmentClient {

    @GetMapping("/api/equipments/{id}")
    EquipmentDTO getEquipmentById(@PathVariable("id") Long id);
}
