package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.entities.Document;
import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.repositories.DocumentRepository;
import com.example.beprogettosettimana4.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final OcrService ocrService;

    public DocumentService(
            DocumentRepository documentRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            OcrService ocrService) {

        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.ocrService = ocrService;
    }

    public Document createDocument(String name, MultipartFile file, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Utente non trovato"));

        String fileName = fileStorageService.store(file, "documents");

        String extractedText = ocrService.extractText(fileStorageService.resolve(fileName));

        Document document = new Document();

        document.setName(name);
        document.setFileName(fileName);
        document.setExtractedText(extractedText);
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

        fileStorageService.delete(document.getFileName());

        documentRepository.delete(document);
    }
}
