package com.example.beprogettosettimana4.controllers;

import com.example.beprogettosettimana4.entities.Photo;
import com.example.beprogettosettimana4.entities.Post;
import com.example.beprogettosettimana4.payloads.PostCreateDTO;
import com.example.beprogettosettimana4.payloads.PostResponseDTO;
import com.example.beprogettosettimana4.payloads.PostUpdateDTO;
import com.example.beprogettosettimana4.services.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponseDTO createPost(
            @RequestPart("data") @Valid PostCreateDTO data,
            @RequestPart("photos") List<MultipartFile> photos,
            Authentication authentication) {

        Post post = postService.createPost(data, photos, authentication.getName());

        return toDTO(post);
    }

    @GetMapping
    public List<PostResponseDTO> getMyPosts(Authentication authentication) {

        return postService.getMyPosts(authentication.getName())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping("/public")
    public List<PostResponseDTO> getPublicPosts() {

        return postService.getPublicPosts()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @PutMapping("/{id}")
    public PostResponseDTO updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateDTO data,
            Authentication authentication) {

        Post post = postService.updatePost(id, data, authentication.getName());

        return toDTO(post);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(
            @PathVariable Long id,
            Authentication authentication) {

        postService.deletePost(id, authentication.getName());
    }

    private PostResponseDTO toDTO(Post post) {

        List<String> photoUrls = post.getPhotos()
                .stream()
                .map(Photo::getFileName)
                .map(fileName -> "/uploads/" + fileName)
                .toList();

        return new PostResponseDTO(
                post.getId(),
                post.getCaption(),
                post.isVisible(),
                post.getLatitude(),
                post.getLongitude(),
                post.getAddress(),
                post.getCreatedAt(),
                post.getUser().getUsername(),
                photoUrls
        );
    }
}
