package com.example.beprogettosettimana4.repositories;

import com.example.beprogettosettimana4.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUserUsername(String username);
}