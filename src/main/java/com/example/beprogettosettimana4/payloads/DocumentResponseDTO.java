package com.example.beprogettosettimana4.payloads;

public class DocumentResponseDTO {

    private Long id;
    private String name;
    private String fileUrl;
    private String extractedText;

    public DocumentResponseDTO() {
    }

    public DocumentResponseDTO(Long id, String name, String fileUrl, String extractedText) {
        this.id = id;
        this.name = name;
        this.fileUrl = fileUrl;
        this.extractedText = extractedText;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public String getExtractedText() {
        return extractedText;
    }
}
