package com.example.beprogettosettimana4.repositories;

import com.example.beprogettosettimana4.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserUsernameOrderByCreatedAtDesc(String username);

    List<Post> findByVisibleTrueOrderByCreatedAtDesc();
}
