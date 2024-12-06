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

    @Cacheable(value = "emotionCache", key = "#content + #modelName + #classificationType")
    public Mono<Map<String, Object>> analyzeEmotionWithModel(String content, String modelName, String classificationType) {
        logger.info("Calling OpenAI API for content: {} with model: {} and classification type: {}", content, modelName, classificationType);

        String format = "{\n" +
                "  \"primaryEmotion\": {\n" +
                "    \"emotion\": \"doubt\",\n" +
                "    \"percentage\": 40\n" +
                "  },\n" +
                "  \"secondaryEmotions\": [\n" +
                "    {\n" +
                "      \"emotion\": \"fear\",\n" +
                "      \"percentage\": 30\n" +
                "    },\n" +
                "    {\n" +
                "      \"emotion\": \"insecurity\",\n" +
                "      \"percentage\": 30\n" +
                "    }\n" +
                "  ],\n" +
                "  \"confidenceRating\": 75,\n" +
                "  \"summary\": \"The text evokes feelings of doubt, fear, and insecurity, suggesting an underlying struggle with self-perception.\"\n" +
                "}";
        // Construct a customized prompt based on the model and classification type
        String prompt = "Please only consider:\"" + classificationType + "\" emotions in the following text: \"" + content + "\". "
                + "Please respond with a JSON object containing the primaryEmotion with its percentage, secondaryEmotions with their percentages, an impartial confidenceRating out of 100 and the summary. The percentages should be a total of 100. Here's an example:\"" + format;

        // Create the chat message structure
        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", prompt)
        );

        Map<String, Object> requestBody = Map.of(
                "model", modelName,
                "messages", messages,
                "max_tokens", 1000 // Increase max_tokens to ensure you can capture the entire response
        );

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(response -> {
                    // Print the entire response for debugging
                    logger.info("API Response: " + response);

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
