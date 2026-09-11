package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.exceptions.UserAlreadyExistsException;
import com.example.beprogettosettimana4.payloads.LoginDTO;
import com.example.beprogettosettimana4.payloads.RegisterDTO;
import com.example.beprogettosettimana4.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    public String login(LoginDTO loginDTO) {

        String username = loginDTO.getUsername().toLowerCase();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Username o password non corretti"));

        if (!passwordEncoder.matches(
                loginDTO.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Username o password non corretti");
        }

        return jwtService.generateToken(user.getUsername());
    }
}
