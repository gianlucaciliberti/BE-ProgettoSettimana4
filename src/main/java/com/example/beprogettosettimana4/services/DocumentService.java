package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.entities.Document;
import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.payloads.DocumentDTO;
import com.example.beprogettosettimana4.repositories.DocumentRepository;
import com.example.beprogettosettimana4.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public DocumentService(
            DocumentRepository documentRepository,
            UserRepository userRepository) {

        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    public Document createDocument(
            DocumentDTO documentDTO,
            String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Utente non trovato"));

        Document document = new Document();

        document.setName(documentDTO.getName());
        document.setUrl(documentDTO.getUrl());
        document.setUser(user);

        return documentRepository.save(document);
    }

    public List<Document> getMyDocuments(String username) {
        return documentRepository.findByUserUsername(username);
    }

    public void deleteDocument(
            Long id,
            String username) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Documento non trovato"));

        if (!document.getUser().getUsername().equals(username)) {
            throw new RuntimeException(
                    "Non puoi eliminare questo documento");
        }

        documentRepository.delete(document);
    }
}
