package com.example.beprogettosettimana4.controllers;

import com.example.beprogettosettimana4.entities.Document;
import com.example.beprogettosettimana4.payloads.DocumentDTO;
import com.example.beprogettosettimana4.services.DocumentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Document createDocument(
            @Valid @RequestBody DocumentDTO documentDTO,
            Authentication authentication) {

        return documentService.createDocument(
                documentDTO,
                authentication.getName()
        );
    }

    @GetMapping
    public List<Document> getMyDocuments(
            Authentication authentication) {

        return documentService.getMyDocuments(
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDocument(
            @PathVariable Long id,
            Authentication authentication) {

        documentService.deleteDocument(
                id,
                authentication.getName()
        );
    }
}
