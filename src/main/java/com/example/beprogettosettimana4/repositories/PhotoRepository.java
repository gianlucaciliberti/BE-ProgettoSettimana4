package com.example.beprogettosettimana4.repositories;

import com.example.beprogettosettimana4.entities.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
}
