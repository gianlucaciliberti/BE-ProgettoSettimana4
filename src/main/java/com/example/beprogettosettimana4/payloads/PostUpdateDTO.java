package com.example.beprogettosettimana4.payloads;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

public class PostUpdateDTO {

    @NotBlank(message = "La didascalia è obbligatoria")
    private String caption;

    private boolean visible;

    @DecimalMin(value = "-90.0", message = "Latitudine non valida")
    @DecimalMax(value = "90.0", message = "Latitudine non valida")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitudine non valida")
    @DecimalMax(value = "180.0", message = "Longitudine non valida")
    private Double longitude;

    private String address;

    public PostUpdateDTO() {
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
