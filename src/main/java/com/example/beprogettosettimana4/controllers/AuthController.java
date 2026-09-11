package com.example.beprogettosettimana4.controllers;

import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.payloads.LoginDTO;
import com.example.beprogettosettimana4.payloads.RegisterDTO;
import com.example.beprogettosettimana4.services.AuthService;
import jakarta.validation.Valid;
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
    public User register(@Valid @RequestBody RegisterDTO registerDTO) {
        return authService.register(registerDTO);
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }
}
