package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.payloads.RegisterDTO;
import com.example.beprogettosettimana4.repositories.UserRepository;
import com.example.beprogettosettimana4.exceptions.UserAlreadyExistsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterDTO registerDTO) {

        String username = registerDTO.getUsername().toLowerCase();
        String email = registerDTO.getEmail().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username già in uso");
        }

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email già in uso");
        }

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        return userRepository.save(user);
    }
}
