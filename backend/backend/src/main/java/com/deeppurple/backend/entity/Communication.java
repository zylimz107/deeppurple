package com.deeppurple.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "communications")
public class Communication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    // List of secondary emotions as @ElementCollection (embeddable type)
    @ElementCollection
    @CollectionTable(name = "communication_secondary_emotions", joinColumns = @JoinColumn(name = "communication_id"))
    private List<EmotionDetails> secondaryEmotions;

    // Primary emotion stored as an embeddable type
    @Embedded
    private EmotionDetails primaryEmotion;

    private String summary;

    private String modelName; // Add field for the model used
    private String classificationType; // Add field for emotion classification type (e.g., "Positive", "Negative", etc.)

    @Column(nullable = false, updatable = false) // Ensure this column is not updated after creation
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the current date and time
    }
}
