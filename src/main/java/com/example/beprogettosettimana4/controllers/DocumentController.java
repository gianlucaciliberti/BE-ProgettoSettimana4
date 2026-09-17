package com.example.beprogettosettimana4.controllers;

import com.example.beprogettosettimana4.entities.Document;
import com.example.beprogettosettimana4.payloads.DocumentResponseDTO;
import com.example.beprogettosettimana4.services.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentResponseDTO createDocument(
            @RequestParam("name") String name,
            @RequestPart("file") MultipartFile file,
            Authentication authentication) {

        Document document = documentService.createDocument(
                name,
                file,
                authentication.getName()
        );

        return toDTO(document);
    }

    @GetMapping
    public List<DocumentResponseDTO> getMyDocuments(
            Authentication authentication) {

        return documentService.getMyDocuments(authentication.getName())
                .stream()
                .map(this::toDTO)
                .toList();
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

    private DocumentResponseDTO toDTO(Document document) {

        return new DocumentResponseDTO(
                document.getId(),
                document.getName(),
                "/uploads/" + document.getFileName(),
                document.getExtractedText()
        );
    }
}
