package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.entities.Photo;
import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.payloads.PhotoDTO;
import com.example.beprogettosettimana4.repositories.PhotoRepository;
import com.example.beprogettosettimana4.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    public PhotoService(PhotoRepository photoRepository,
                        UserRepository userRepository) {
        this.photoRepository = photoRepository;
        this.userRepository = userRepository;
    }

    public Photo createPhoto(PhotoDTO photoDTO, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Utente non trovato"));

        Photo photo = new Photo();

        photo.setUrl(photoDTO.getUrl());
        photo.setTitle(photoDTO.getTitle());
        photo.setVisible(photoDTO.isVisible());
        photo.setUser(user);

        return photoRepository.save(photo);
    }

    public List<Photo> getMyPhotos(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Utente non trovato"));

        return photoRepository.findAll()
                .stream()
                .filter(photo ->
                        photo.getUser().getId().equals(user.getId()))
                .toList();
    }

    public List<Photo> getPublicPhotos() {

        return photoRepository.findAll()
                .stream()
                .filter(Photo::isVisible)
                .toList();
    }

    public Photo updatePhoto(
            Long photoId,
            PhotoDTO photoDTO,
            String username) {

        Photo photo = getUserPhoto(photoId, username);

        photo.setUrl(photoDTO.getUrl());
        photo.setTitle(photoDTO.getTitle());
        photo.setVisible(photoDTO.isVisible());

        return photoRepository.save(photo);
    }

    public void deletePhoto(
            Long photoId,
            String username) {

        Photo photo = getUserPhoto(photoId, username);

        photoRepository.delete(photo);
    }

    private Photo getUserPhoto(
            Long photoId,
            String username) {

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() ->
                        new RuntimeException("Foto non trovata"));

        if (!photo.getUser().getUsername().equals(username)) {
            throw new RuntimeException(
                    "Non puoi modificare questa foto");
        }

        return photo;
    }
}
