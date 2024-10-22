package com.deeppurple.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "communications")
public class Communication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private String primaryEmotion; // New field for the primary emotion
    private String secondaryEmotions; // New field for secondary emotions
    private String summary; // New field for a brief analysis summary

    @Column(nullable = false, updatable = false) // Ensure this column is not updated after creation
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the current date and time
    }
}
