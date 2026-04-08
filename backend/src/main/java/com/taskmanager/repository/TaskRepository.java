package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// JpaRepository<Task, Long> gives us these methods for FREE — no SQL needed:
//
//   save(task)          → INSERT or UPDATE
//   findById(id)        → SELECT WHERE id = ?
//   findAll()           → SELECT * FROM tasks
//   deleteById(id)      → DELETE WHERE id = ?
//   count()             → SELECT COUNT(*)
//   existsById(id)      → SELECT 1 WHERE id = ?
//
// Spring reads the method names below and generates the SQL automatically.
// This is called "derived queries" — the method name IS the query.

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Spring sees "findByCompleted" and generates:
    // SELECT * FROM tasks WHERE completed = ?
    List<Task> findByCompleted(boolean completed);

    // SELECT * FROM tasks WHERE priority = ?
    List<Task> findByPriority(Task.Priority priority);

    // SELECT * FROM tasks WHERE completed = ? ORDER BY created_at DESC
    List<Task> findByCompletedOrderByCreatedAtDesc(boolean completed);
}
