package com.bizsahayak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BizSahayakApplication {

    public static void main(String[] args) {
        SpringApplication.run(BizSahayakApplication.class, args);
    }
}
