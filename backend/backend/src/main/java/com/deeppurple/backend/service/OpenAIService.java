package com.deeppurple.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {
    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);

    private final WebClient webClient;

    public OpenAIService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + System.getenv("OPENAI_API_KEY"))
                .build();
    }

    @Cacheable(value = "emotionCache", key = "#content")
    public Mono<Map<String, Object>> analyzeEmotion(String content) {
        logger.info("Calling OpenAI API for content: {}", content);

        // Create a chat message structure
        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", "Identify the primary emotion in the following text: \"" + content + "\". Please respond with a JSON object containing the primaryEmotion, secondaryEmotions, and summary.")
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", messages,
                "max_tokens", 100 // Increase max_tokens to ensure you can capture the entire response
        );

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(response -> {
                    // Print the entire response for debugging
                    System.out.println("API Response: " + response);

                    // Safely extract the nested fields from the response
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> firstChoice = choices.get(0);
                        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                        String text = (String) message.get("content");

                        if (text != null) {
                            // Clean up the response text before parsing as JSON
                            text = text.trim();
                            if (text.startsWith("```json") && text.endsWith("```")) {
                                // Remove the markdown syntax
                                text = text.substring(8, text.length() - 3).trim();
                            }

                            // Parse the JSON string
                            try {
                                // Convert the text to a JSON object
                                ObjectMapper objectMapper = new ObjectMapper();
                                Map<String, Object> emotionData = objectMapper.readValue(text, Map.class);
                                // Here you can access primaryEmotion, secondaryEmotions, and summary
                                return Mono.just(emotionData);
                            } catch (JsonProcessingException e) {
                                return Mono.error(new RuntimeException("Error parsing JSON response: " + e.getMessage()));
                            }
                        } else {
                            return Mono.error(new RuntimeException("No content found in the response"));
                        }
                    } else {
                        return Mono.error(new RuntimeException("No choices found in the response"));
                    }
                });
    }



}
