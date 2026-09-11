package com.example.beprogettosettimana4.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String title;

    private boolean visible;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Photo() {
    }

    public Photo(String url, String title, boolean visible, User user) {
        this.url = url;
        this.title = title;
        this.visible = visible;
        this.user = user;
    }

    public Long getId() {
        return id;
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

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
