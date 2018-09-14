package com.zbwb.mengxi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

@Configuration
@ComponentScan("com.thinkgem.config")
@PropertySources(@PropertySource("classpath:showdoc.properties"))
public class ShowDocConfig {

    @Value("${show.doc.api.gen}")
    private String updateDoc;
    @Value("${show.doc.api.url}")
    private String apiUrl;
    @Value("${show.doc.api.key}")
    private String apiKey;
    @Value("${show.doc.api.token}")
    private String apiToken;

    public String getUpdateDoc() {
        return updateDoc;
    }

    public void setUpdateDoc(String updateDoc) {
        this.updateDoc = updateDoc;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }
}