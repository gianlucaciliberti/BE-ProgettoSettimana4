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
        photo.setVisible(false);
        photo.setUser(user);

        return photoRepository.save(photo);
    }

    public List<Photo> getMyPhotos(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Utente non trovato"));

        return photoRepository.findAll()
                .stream()
                .filter(photo -> photo.getUser().getId().equals(user.getId()))
                .toList();
    }
}
