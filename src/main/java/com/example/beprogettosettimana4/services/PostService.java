package com.example.beprogettosettimana4.services;

import com.example.beprogettosettimana4.entities.Photo;
import com.example.beprogettosettimana4.entities.Post;
import com.example.beprogettosettimana4.entities.User;
import com.example.beprogettosettimana4.exceptions.InvalidFileException;
import com.example.beprogettosettimana4.payloads.PostCreateDTO;
import com.example.beprogettosettimana4.payloads.PostUpdateDTO;
import com.example.beprogettosettimana4.repositories.PostRepository;
import com.example.beprogettosettimana4.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public PostService(PostRepository postRepository,
                        UserRepository userRepository,
                        FileStorageService fileStorageService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public Post createPost(PostCreateDTO data, List<MultipartFile> photos, String username) {

        if (photos == null || photos.isEmpty()) {
            throw new InvalidFileException("È necessario allegare almeno una foto");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        Post post = new Post();
        post.setCaption(data.getCaption());
        post.setVisible(data.isVisible());
        post.setLatitude(data.getLatitude());
        post.setLongitude(data.getLongitude());
        post.setAddress(data.getAddress());
        post.setUser(user);

        for (MultipartFile file : photos) {
            String fileName = fileStorageService.store(file, "photos");
            post.getPhotos().add(new Photo(fileName, post));
        }

        return postRepository.save(post);
    }

    public List<Post> getMyPosts(String username) {
        return postRepository.findByUserUsernameOrderByCreatedAtDesc(username);
    }

    public List<Post> getPublicPosts() {
        return postRepository.findByVisibleTrueOrderByCreatedAtDesc();
    }

    public Post updatePost(Long postId, PostUpdateDTO data, String username) {

        Post post = getUserPost(postId, username);

        post.setCaption(data.getCaption());
        post.setVisible(data.isVisible());
        post.setLatitude(data.getLatitude());
        post.setLongitude(data.getLongitude());
        post.setAddress(data.getAddress());

        return postRepository.save(post);
    }

    public void deletePost(Long postId, String username) {

        Post post = getUserPost(postId, username);

        post.getPhotos().forEach(photo -> fileStorageService.delete(photo.getFileName()));

        postRepository.delete(post);
    }

    private Post getUserPost(Long postId, String username) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post non trovato"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non puoi modificare questo post");
        }

        return post;
    }
}
