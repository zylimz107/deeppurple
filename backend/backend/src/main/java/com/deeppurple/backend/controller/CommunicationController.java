package com.deeppurple.backend.controller;

import com.deeppurple.backend.dto.CommunicationDTO;
import com.deeppurple.backend.entity.Communication;
import com.deeppurple.backend.entity.EmotionDetails;
import com.deeppurple.backend.service.CommunicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/communications")
public class CommunicationController {
    private final CommunicationService service;

    public CommunicationController(CommunicationService service) {
        this.service = service;
    }

    // Get all communications
    @GetMapping
    public Flux<Communication> getAllCommunications() {
        return Flux.fromIterable(service.getAllCommunications());
    }

    // Save a new communication with model and classification type
    @PostMapping
    public Mono<ResponseEntity<Communication>> saveCommunication(
            @Valid @RequestBody CommunicationDTO communicationDTO) {
        Communication communication = new Communication();
        communication.setModelName(communicationDTO.getModelName());
        communication.setClassificationType(communicationDTO.getClassificationType());
        communication.setContent(communicationDTO.getContent());
        EmotionDetails primaryEmotion = communicationDTO.getPrimaryEmotion();
        if (primaryEmotion != null) {
            communication.setPrimaryEmotion(primaryEmotion); // Set EmotionDetails object (with emotion and percentage)
        }

        // Extract and set secondary emotions as a list of EmotionDetails
        List<EmotionDetails> secondaryEmotions = communicationDTO.getSecondaryEmotions();
        if (secondaryEmotions != null && !secondaryEmotions.isEmpty()) {
            communication.setSecondaryEmotions(secondaryEmotions); // Set list of EmotionDetails
        }

        communication.setSummary(communicationDTO.getSummary());

        return service.saveCommunication(communicationDTO.getModelName(),
                        communicationDTO.getClassificationType(), communication)
                .map(savedCommunication -> ResponseEntity.ok(savedCommunication))
                .defaultIfEmpty(ResponseEntity.badRequest().build());
    }

    // Get communication by ID
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Communication>> getCommunicationById(@PathVariable Long id) {
        return service.getCommunicationById(id)
                .map(ResponseEntity::ok)  // Return 200 OK with the communication entity
                .defaultIfEmpty(ResponseEntity.notFound().build());  // Return 404 if not found
    }

    // Update communication by ID with model and classification type
    @PutMapping("/{id}")
    public Mono<ResponseEntity<Communication>> updateCommunication(
            @PathVariable Long id,
            @Valid @RequestBody CommunicationDTO communicationDTO) {
        Communication updatedCommunication = new Communication();
        updatedCommunication.setModelName(communicationDTO.getModelName());
        updatedCommunication.setClassificationType(communicationDTO.getClassificationType());
        updatedCommunication.setContent(communicationDTO.getContent());
        EmotionDetails primaryEmotion = communicationDTO.getPrimaryEmotion();
        if (primaryEmotion != null) {
            updatedCommunication.setPrimaryEmotion(primaryEmotion); // Set EmotionDetails object (with emotion and percentage)
        }

        // Extract and set secondary emotions as a list of EmotionDetails
        List<EmotionDetails> secondaryEmotions = communicationDTO.getSecondaryEmotions();
        if (secondaryEmotions != null && !secondaryEmotions.isEmpty()) {
            updatedCommunication.setSecondaryEmotions(secondaryEmotions); // Set list of EmotionDetails
        }
        updatedCommunication.setSummary(communicationDTO.getSummary());

        return service.updateCommunication(id, communicationDTO.getModelName(),
                        communicationDTO.getClassificationType(), updatedCommunication)
                .map(updated -> ResponseEntity.ok(updated))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    // Delete communication by ID
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteCommunication(@PathVariable Long id) {
        return service.deleteCommunication(id)
                .flatMap(deleted -> deleted
                        ? Mono.just(ResponseEntity.noContent().build()) // Return 204 No Content for successful deletion
                        : Mono.just(ResponseEntity.notFound().build())); // Return 404 if not found
    }
}
