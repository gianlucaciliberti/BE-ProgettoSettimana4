package com.example.beprogettosettimana4.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Document() {
    }

    public Document(String name, String fileName, User user) {
        this.name = name;
        this.fileName = fileName;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
