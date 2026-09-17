package com.example.beprogettosettimana4.payloads;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponseDTO {

    private Long id;
    private String caption;
    private boolean visible;
    private Double latitude;
    private Double longitude;
    private String address;
    private LocalDateTime createdAt;
    private String username;
    private List<String> photoUrls;

    public PostResponseDTO() {
    }

    public PostResponseDTO(Long id, String caption, boolean visible, Double latitude,
                            Double longitude, String address, LocalDateTime createdAt,
                            String username, List<String> photoUrls) {
        this.id = id;
        this.caption = caption;
        this.visible = visible;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.createdAt = createdAt;
        this.username = username;
        this.photoUrls = photoUrls;
    }

    public Long getId() {
        return id;
    }

    public String getCaption() {
        return caption;
    }

    public boolean isVisible() {
        return visible;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public String getAddress() {
        return address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getUsername() {
        return username;
    }

    public List<String> getPhotoUrls() {
        return photoUrls;
    }
}
