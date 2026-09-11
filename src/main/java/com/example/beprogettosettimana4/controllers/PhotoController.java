package com.example.beprogettosettimana4.controllers;

import com.example.beprogettosettimana4.entities.Photo;
import com.example.beprogettosettimana4.payloads.PhotoDTO;
import com.example.beprogettosettimana4.payloads.PhotoResponseDTO;
import com.example.beprogettosettimana4.services.PhotoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PhotoResponseDTO createPhoto(
            @Valid @RequestBody PhotoDTO photoDTO,
            Authentication authentication) {

        Photo photo = photoService.createPhoto(
                photoDTO,
                authentication.getName()
        );

        return toDTO(photo);
    }

    @GetMapping
    public List<PhotoResponseDTO> getMyPhotos(
            Authentication authentication) {

        return photoService.getMyPhotos(authentication.getName())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping("/public")
    public List<PhotoResponseDTO> getPublicPhotos() {

        return photoService.getPublicPhotos()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @PutMapping("/{id}")
    public PhotoResponseDTO updatePhoto(
            @PathVariable Long id,
            @Valid @RequestBody PhotoDTO photoDTO,
            Authentication authentication) {

        Photo photo = photoService.updatePhoto(
                id,
                photoDTO,
                authentication.getName()
        );

        return toDTO(photo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePhoto(
            @PathVariable Long id,
            Authentication authentication) {

        photoService.deletePhoto(
                id,
                authentication.getName()
        );
    }

    private PhotoResponseDTO toDTO(Photo photo) {

        return new PhotoResponseDTO(
                photo.getId(),
                photo.getUrl(),
                photo.getTitle(),
                photo.isVisible()
        );
    }
}
