package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.entity.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// @Service tells Spring this is a service component.
// Spring creates one instance of this class and injects it wherever it's needed.
@Service
public class TaskService {

    // Constructor injection — the preferred way to inject dependencies in Spring.
    // Spring sees this constructor and automatically passes in the TaskRepository.
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get a single task by ID — throws an exception if not found
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    // Get tasks filtered by completion status
    public List<Task> getTasksByStatus(boolean completed) {
        return taskRepository.findByCompletedOrderByCreatedAtDesc(completed);
    }

    // Create a new task from the incoming request data
    public Task createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());
        task.setPriority(request.getPriority());
        return taskRepository.save(task);  // save() triggers @PrePersist, then INSERT
    }

    // Update an existing task — only change the fields the client sent
    public Task updateTask(Long id, TaskRequest request) {
        Task task = getTaskById(id);  // reuse our method — throws if not found
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());
        task.setPriority(request.getPriority());
        return taskRepository.save(task);  // save() on existing entity triggers UPDATE
    }

    // Toggle the completed flag — useful for a checkbox in the UI
    public Task toggleComplete(Long id) {
        Task task = getTaskById(id);
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    // Delete a task
    public void deleteTask(Long id) {
        Task task = getTaskById(id);  // verify it exists first — gives a better error if not
        taskRepository.delete(task);
    }
}
