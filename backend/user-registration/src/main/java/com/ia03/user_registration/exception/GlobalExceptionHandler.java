package com.ia03.user_registration.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;
import java.util.HashMap;

@ControllerAdvice
public class GlobalExceptionHandler {
    // This handles the "Email is already in use" error
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        // Return 409 Conflict, which your frontend is set up to handle
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // This handles the @Valid (e.g., "Password must be 6 characters") errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> error = new HashMap<>();
        // Get the first error message
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        error.put("message", errorMessage);
        // Return 400 Bad Request
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
