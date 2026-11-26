package com.agri.equipment.controller;

import com.agri.equipment.repository.EquipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
class EquipmentControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private EquipmentRepository equipmentRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        equipmentRepository.deleteAll();
    }

    @Test
    void fullCrudAndFeignContractFlow() throws Exception {
        String createPayload = """
                {
                  "name": "Tracteur Massey Ferguson",
                  "description": "Tracteur 150ch",
                  "category": "TRACTOR",
                  "pricePerDay": 300.50,
                  "isAvailable": true,
                  "status": "OPERATIONAL",
                  "ownerId": 10,
                  "location": "Meknes",
                  "imageUrl": "https://example.com/tractor.jpg"
                }
                """;

        MvcResult postResult = mockMvc.perform(post("/api/equipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Tracteur Massey Ferguson"))
                .andExpect(jsonPath("$.category").value("TRACTOR"))
                .andExpect(jsonPath("$.status").value("OPERATIONAL"))
                .andExpect(jsonPath("$.pricePerDay").value(300.50))
                .andExpect(jsonPath("$.isAvailable").value(true))
                .andExpect(jsonPath("$.ownerId").value(10))
                .andExpect(jsonPath("$.createdAt").isNotEmpty())
                .andReturn();

        String body = postResult.getResponse().getContentAsString();
        String id = body.replaceAll(".*\"id\":(\\d+).*", "$1");

        // GET by ID (Feign contract check)
        mockMvc.perform(get("/api/equipments/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(Long.parseLong(id)))
                .andExpect(jsonPath("$.pricePerDay").value(300.50))
                .andExpect(jsonPath("$.isAvailable").value(true))
                .andExpect(jsonPath("$.category").value("TRACTOR"))
                .andExpect(jsonPath("$.status").value("OPERATIONAL"));

        // PATCH availability -> false
        mockMvc.perform(patch("/api/equipments/" + id + "/availability")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isAvailable\": false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isAvailable").value(false));

        // PUT -> status MAINTENANCE forces isAvailable=false even if true sent
        String updatePayload = """
                {
                  "name": "Tracteur Massey Ferguson",
                  "category": "TRACTOR",
                  "pricePerDay": 320.00,
                  "isAvailable": true,
                  "status": "MAINTENANCE"
                }
                """;
        mockMvc.perform(put("/api/equipments/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("MAINTENANCE"))
                .andExpect(jsonPath("$.isAvailable").value(false));

        // PATCH availability -> true while MAINTENANCE must fail with 400
        mockMvc.perform(patch("/api/equipments/" + id + "/availability")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isAvailable\": true}"))
                .andExpect(status().isBadRequest());

        // GET search & filters with pagination
        mockMvc.perform(get("/api/equipments")
                        .param("search", "Massey")
                        .param("category", "TRACTOR")
                        .param("status", "MAINTENANCE")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.totalElements").value(1));

        // DELETE -> 204 then GET -> 404
        mockMvc.perform(delete("/api/equipments/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/equipments/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void createEquipment_returns400_whenValidationFails() throws Exception {
        String invalidPayload = """
                {
                  "name": "",
                  "pricePerDay": -10
                }
                """;

        mockMvc.perform(post("/api/equipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.name").isNotEmpty())
                .andExpect(jsonPath("$.details.category").isNotEmpty())
                .andExpect(jsonPath("$.details.pricePerDay").isNotEmpty());
    }
}
