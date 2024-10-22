package com.deeppurple.backend.controller;

import com.deeppurple.backend.dto.CommunicationDTO; // Import the DTO
import com.deeppurple.backend.entity.Communication;
import com.deeppurple.backend.service.CommunicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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

    // Save a new communication
    @PostMapping
    public Mono<ResponseEntity<Communication>> saveCommunication(@Valid @RequestBody CommunicationDTO communicationDTO) {
        Communication communication = new Communication();
        communication.setContent(communicationDTO.getContent());

        return service.saveCommunication(communication)
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

    // Update communication by ID
    @PutMapping("/{id}")
    public Mono<ResponseEntity<Communication>> updateCommunication(@PathVariable Long id, @RequestBody CommunicationDTO dto) {
        Communication updatedCommunication = new Communication();
        updatedCommunication.setContent(dto.getContent());

        return service.updateCommunication(id, updatedCommunication)
                .map(updated -> ResponseEntity.ok(updated)) // Return 200 OK with the updated communication
                .defaultIfEmpty(ResponseEntity.notFound().build()); // Return 404 if not found
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
