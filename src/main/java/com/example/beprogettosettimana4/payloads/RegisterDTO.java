package com.example.beprogettosettimana4.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterDTO {

    @NotBlank(message = "Lo username è obbligatorio")
    @Size(
            min = 3,
            max = 30,
            message = "Lo username deve avere tra 3 e 30 caratteri"
    )
    @Pattern(
            regexp = "^[a-zA-Z0-9._]+$",
            message = "Lo username può contenere solo lettere, numeri, punti e underscore"
    )
    private String username;

    @NotBlank(message = "L'email è obbligatoria")
    @Email(message = "L'email non è valida")
    private String email;

    @NotBlank(message = "La password è obbligatoria")
    @Size(
            min = 8,
            max = 50,
            message = "La password deve avere tra 8 e 50 caratteri"
    )
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$",
            message = "La password deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale"
    )
    private String password;

    public RegisterDTO() {
    }

    public RegisterDTO(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
