package com.agri.user.controller;

import com.agri.user.dto.LoginRequest;
import com.agri.user.dto.RoleUpdateRequest;
import com.agri.user.dto.UserDTO;
import com.agri.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ─── LOGIN ───────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@Valid @RequestBody LoginRequest request) {
        UserDTO user = userService.authenticate(request);
        return ResponseEntity.ok(user);
    }

    // ─── GET ALL ─────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ─── GET BY ID ───────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ─── CREATE (role forced to USER) ────────────────────────────────────────
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO created = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─── UPDATE PROFILE ──────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {
        UserDTO updated = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updated);
    }

    // ─── UPDATE ROLE (admin-only — ⚠️ unprotected until Spring Security added) ──
    /**
     * Changes the role of an existing user.
     * Accepts: { "role": "USER" | "ADMIN" | "AGENCY" }
     *
     * ⚠️  TO PROTECT: add @PreAuthorize("hasRole('ADMIN')") once Spring Security
     *     is configured in this service.
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequest request) {
        UserDTO updated = userService.updateRole(id, request);
        return ResponseEntity.ok(updated);
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
