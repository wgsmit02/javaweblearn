package com.taskmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

// @Entity tells JPA: "this class represents a database table"
@Entity
// @Table lets us specify the exact table name in PostgreSQL
@Table(name = "tasks")
public class Task {

    // @Id marks this field as the primary key
    // @GeneratedValue tells the DB to auto-increment it — we never set this manually
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column defines the column properties
    // nullable = false → NOT NULL constraint in the DB
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be 255 characters or less")
    @Column(nullable = false)
    private String title;

    // @Lob stores this as a large text field (TEXT type in PostgreSQL)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    // Whether the task is done — defaults to false
    @Column(nullable = false)
    private boolean completed = false;

    // We use an enum to represent priority — stored as a string in the DB
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    // Timestamps — set automatically, never by the user
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // @PrePersist runs automatically just before a new record is saved to the DB
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // @PreUpdate runs automatically just before an existing record is updated
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // The Priority enum lives inside the Task class — it belongs to Task
    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    // --- Getters and Setters ---
    // Java requires these for JPA and JSON serialization to work.
    // In a real project you'd use Lombok (@Data) to generate these automatically,
    // but we're writing them out so you can see what's happening.

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
