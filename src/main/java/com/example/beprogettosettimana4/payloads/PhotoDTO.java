package com.example.beprogettosettimana4.payloads;

import jakarta.validation.constraints.NotBlank;

public class PhotoDTO {

    @NotBlank(message = "L'URL della foto è obbligatoria")
    private String url;

    @NotBlank(message = "Il titolo è obbligatorio")
    private String title;

    public PhotoDTO() {
    }

    public PhotoDTO(String url, String title) {
        this.url = url;
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
