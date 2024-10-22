package com.deeppurple.backend.service;

import com.deeppurple.backend.entity.Communication;
import com.deeppurple.backend.repository.CommunicationRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class CommunicationService {
    private final CommunicationRepository repository;
    private final OpenAIService openAIService;

    public CommunicationService(CommunicationRepository repository, OpenAIService openAIService) {
        this.repository = repository;
        this.openAIService = openAIService;
    }

    // Retrieve all communications
    public List<Communication> getAllCommunications() {
        return repository.findAll();
    }

    // Save new communication and analyze emotion
    public Mono<Communication> saveCommunication(Communication communication) {
        return openAIService.analyzeEmotion(communication.getContent())
                .map(emotionAnalysis -> {
                    // Extract values from the emotion analysis
                    String primaryEmotion = (String) emotionAnalysis.get("primaryEmotion");
                    List<String> secondaryEmotions = (List<String>) emotionAnalysis.get("secondaryEmotions");
                    String summary = (String) emotionAnalysis.get("summary");

                    // Set the fields in the communication object
                    communication.setPrimaryEmotion(primaryEmotion);
                    communication.setSecondaryEmotions(String.join(", ", secondaryEmotions));
                    communication.setSummary(summary);

                    return repository.save(communication);
                });
    }

    // Get communication by ID
    public Mono<Communication> getCommunicationById(Long id) {
        return Mono.justOrEmpty(repository.findById(id)); // Return Mono.empty() if not found
    }

    // Update communication by ID (Re-analyze the content for emotion)
    public Mono<Communication> updateCommunication(Long id, Communication updatedCommunication) {
        return getCommunicationById(id)
                .flatMap(existingCommunication -> {
                    existingCommunication.setContent(updatedCommunication.getContent());

                    // Re-analyze the emotion for the updated content
                    return openAIService.analyzeEmotion(existingCommunication.getContent())
                            .map(emotionAnalysis -> {
                                String primaryEmotion = (String) emotionAnalysis.get("primaryEmotion");
                                List<String> secondaryEmotions = (List<String>) emotionAnalysis.get("secondaryEmotions");
                                String summary = (String) emotionAnalysis.get("summary");

                                existingCommunication.setPrimaryEmotion(primaryEmotion);
                                existingCommunication.setSecondaryEmotions(String.join(", ", secondaryEmotions));
                                existingCommunication.setSummary(summary);

                                return repository.save(existingCommunication);
                            });
                });
    }

    // Delete communication by ID
    public Mono<Boolean> deleteCommunication(Long id) {
        return getCommunicationById(id)
                .flatMap(existingCommunication -> {
                    if (existingCommunication != null) {
                        repository.deleteById(id);
                        return Mono.just(true); // Successfully deleted
                    }
                    return Mono.just(false); // Communication not found
                });
    }
}
