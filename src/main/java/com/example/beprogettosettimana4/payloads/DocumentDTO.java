package com.example.beprogettosettimana4.payloads;

import jakarta.validation.constraints.NotBlank;

public class DocumentDTO {

    @NotBlank(message = "Il nome del documento è obbligatorio")
    private String name;

    @NotBlank(message = "L'URL del documento è obbligatorio")
    private String url;

    public DocumentDTO() {
    }

    public DocumentDTO(String name, String url) {
        this.name = name;
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
