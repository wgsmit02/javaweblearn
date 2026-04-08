package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication is a shortcut for three annotations:
//   @Configuration      — this class can define Spring beans
//   @EnableAutoConfiguration — Spring Boot auto-configures based on what's on the classpath
//   @ComponentScan      — scan this package and sub-packages for Spring components
@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        // Bootstraps the entire Spring application context and starts the embedded Tomcat server
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
