package com.example.beprogettosettimana4.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    public Photo() {
    }

    public Photo(String fileName, Post post) {
        this.fileName = fileName;
        this.post = post;
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}
