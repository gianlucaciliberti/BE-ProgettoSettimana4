package com.example.beprogettosettimana4.controllers;

import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.payloads.RegisterDTO;
import com.example.beprogettosettimana4.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@RequestBody RegisterDTO registerDTO) {
        return authService.register(registerDTO);
    }
}
