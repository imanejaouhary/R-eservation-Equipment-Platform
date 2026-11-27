package com.agri.user.dto;

import com.agri.user.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateRequest {

    @NotNull(message = "Role must not be null. Accepted values: USER, ADMIN, AGENCY")
    private Role role;
}
