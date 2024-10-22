package com.deeppurple.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommunicationDTO {

    @NotBlank(message = "Content cannot be empty")
    @Size(max = 1000, message = "Content cannot exceed 1000 characters")
    private String content;

    // Default constructor
    public CommunicationDTO() {
    }

    // Parameterized constructor
    public CommunicationDTO(String content) {
        this.content = content;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "CommunicationDTO{" +
                "content='" + content + '\'' +
                '}';
    }
}
