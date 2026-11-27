package com.agri.user.service;

import com.agri.user.dto.LoginRequest;
import com.agri.user.dto.RoleUpdateRequest;
import com.agri.user.dto.UserDTO;
import com.agri.user.entity.Role;
import com.agri.user.entity.User;
import com.agri.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ─── AUTHENTICATE / LOGIN ──────────────────────────────────────────────────

    public UserDTO authenticate(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        return mapToDTO(user);
    }

    // ─── READ ───────────────────────────────────────────────────────────────────

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return mapToDTO(findOrThrow(id));
    }

    // ─── CREATE ─────────────────────────────────────────────────────────────────

    public UserDTO createUser(UserDTO userDTO) {

        if (userDTO.getPassword() == null
                || userDTO.getPassword().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Password is required");
        }

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .role(userDTO.getRole() == Role.AGENCY
                        ? Role.AGENCY
                        : Role.USER)
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .build();

        return mapToDTO(userRepository.save(user));
    }

    // ─── UPDATE ─────────────────────────────────────────────────────────────────

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = findOrThrow(id);

        if (userDTO.getUsername() != null
                && !userDTO.getUsername().equals(existingUser.getUsername())
                && userRepository.existsByUsername(userDTO.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (userDTO.getEmail() != null
                && !userDTO.getEmail().equals(existingUser.getEmail())
                && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email already exists");
        }

        if (userDTO.getUsername() != null) {
            existingUser.setUsername(userDTO.getUsername());
        }

        if (userDTO.getEmail() != null) {
            existingUser.setEmail(userDTO.getEmail());
        }

        if (userDTO.getFirstName() != null) {
            existingUser.setFirstName(userDTO.getFirstName());
        }

        if (userDTO.getLastName() != null) {
            existingUser.setLastName(userDTO.getLastName());
        }

        if (userDTO.getPassword() != null
                && !userDTO.getPassword().isBlank()) {
            existingUser.setPassword(
                    passwordEncoder.encode(userDTO.getPassword()));
        }

        return mapToDTO(userRepository.save(existingUser));
    }

    // ─── ROLE UPDATE ────────────────────────────────────────────────────────────

    public UserDTO updateRole(Long id, RoleUpdateRequest request) {
        User user = findOrThrow(id);
        user.setRole(request.getRole());
        return mapToDTO(userRepository.save(user));
    }

    // ─── DELETE ─────────────────────────────────────────────────────────────────

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found with id: " + id);
        }

        userRepository.deleteById(id);
    }

    // ─── HELPERS ────────────────────────────────────────────────────────────────

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with id: " + id));
    }

    public UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}
