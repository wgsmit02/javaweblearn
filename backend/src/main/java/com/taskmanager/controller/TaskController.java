package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.entity.Task;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController = @Controller + @ResponseBody
// Every method return value is automatically serialized to JSON
@RestController

// All routes in this class are prefixed with /api/tasks
@RequestMapping("/api/tasks")

// @CrossOrigin allows the React frontend (running on a different port) to call this API
// We'll tighten this up later when we add Kong
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET /api/tasks          → all tasks
    // GET /api/tasks?completed=true  → filtered by status
    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(required = false) Boolean completed) {

        List<Task> tasks = (completed != null)
                ? taskService.getTasksByStatus(completed)
                : taskService.getAllTasks();

        return ResponseEntity.ok(tasks);  // 200 OK with JSON body
    }

    // GET /api/tasks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // POST /api/tasks
    // @RequestBody — deserializes the incoming JSON into a TaskRequest object
    // @Valid       — triggers the validation annotations on TaskRequest
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        Task created = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);  // 201 Created
    }

    // PUT /api/tasks/{id}  — full update
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    // PATCH /api/tasks/{id}/toggle  — flip the completed flag
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleComplete(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.toggleComplete(id));
    }

    // DELETE /api/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();  // 204 No Content
    }
}
