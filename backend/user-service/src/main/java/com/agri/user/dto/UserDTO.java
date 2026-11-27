package com.agri.user.dto;

import com.agri.user.entity.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    /**
     * Returned in responses as a string (e.g. "USER", "ADMIN", "AGENCY").
     * Ignored on registration — role is always forced to Role.USER.
     * Only modifiable via PUT /api/users/{id}/role (admin-only endpoint).
     */
    private Role role;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
