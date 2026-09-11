package com.example.beprogettosettimana4.payloads;

public class PhotoResponseDTO {

    private Long id;
    private String url;
    private String title;
    private boolean visible;

    public PhotoResponseDTO() {
    }

    public PhotoResponseDTO(Long id, String url, String title, boolean visible) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.visible = visible;
    }

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getTitle() {
        return title;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
