package com.deeppurple.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class OpenAIServiceCacheTest {

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    public void testCacheFunctionality() {
        String text = "I am feeling great!";

        // First call - should trigger an API request
        var response1 = openAIService.analyzeEmotion(text).block();

        // Second call with the same input - should hit the cache
        var response2 = openAIService.analyzeEmotion(text).block();

        // Verify that both responses are identical
        assertThat(response1).isEqualTo(response2);

        // Verify that the cache contains the entry
        assertThat(cacheManager.getCache("emotionCache")
                .get(text).get()).isEqualTo(response1);
    }
}
