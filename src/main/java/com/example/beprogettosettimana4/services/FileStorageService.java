package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.exceptions.InvalidFileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp");

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp");

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file, String subfolder) {

        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Il file è obbligatorio");
        }

        String extension = extractExtension(file.getOriginalFilename());

        if (!ALLOWED_EXTENSIONS.contains(extension)
                || !ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException(
                    "Formato non supportato: sono ammessi solo file JPG, PNG o WEBP");
        }

        try {
            Path targetDir = uploadRoot.resolve(subfolder);
            Files.createDirectories(targetDir);

            String storedName = UUID.randomUUID() + "." + extension;
            Path targetFile = targetDir.resolve(storedName);

            file.transferTo(targetFile);

            return subfolder + "/" + storedName;

        } catch (IOException e) {
            throw new RuntimeException("Impossibile salvare il file", e);
        }
    }

    public void delete(String relativePath) {

        if (relativePath == null) {
            return;
        }

        try {
            Files.deleteIfExists(uploadRoot.resolve(relativePath));
        } catch (IOException e) {
            throw new RuntimeException("Impossibile eliminare il file", e);
        }
    }

    public File resolve(String relativePath) {
        return uploadRoot.resolve(relativePath).toFile();
    }

    private String extractExtension(String originalFilename) {

        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new InvalidFileException("Nome file non valido");
        }

        return originalFilename
                .substring(originalFilename.lastIndexOf('.') + 1)
                .toLowerCase();
    }
}
