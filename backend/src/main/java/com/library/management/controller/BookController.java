package com.library.management.controller;

import com.library.management.dto.BookRequestDto;
import com.library.management.dto.BookResponseDto;
import com.library.management.response.ApiResponse;
import com.library.management.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Book management APIs")
public class BookController {

    private final BookService bookService;

    @PostMapping
    @Operation(summary = "Add a new book")
    public ResponseEntity<ApiResponse<BookResponseDto>> createBook(@Valid @RequestBody BookRequestDto request) {
        BookResponseDto book = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book created successfully", book));
    }

    @GetMapping
    @Operation(summary = "Get all books")
    public ResponseEntity<ApiResponse<List<BookResponseDto>>> getAllBooks() {
        return ResponseEntity.ok(ApiResponse.success(bookService.getAllBooks()));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available books")
    public ResponseEntity<ApiResponse<List<BookResponseDto>>> getAvailableBooks() {
        return ResponseEntity.ok(ApiResponse.success(bookService.getAvailableBooks()));
    }

    @GetMapping("/title/{title}")
    @Operation(summary = "Search books by title")
    public ResponseEntity<ApiResponse<List<BookResponseDto>>> searchByTitle(@PathVariable String title) {
        return ResponseEntity.ok(ApiResponse.success(bookService.searchByTitle(title)));
    }

    @GetMapping("/author/{author}")
    @Operation(summary = "Search books by author")
    public ResponseEntity<ApiResponse<List<BookResponseDto>>> searchByAuthor(@PathVariable String author) {
        return ResponseEntity.ok(ApiResponse.success(bookService.searchByAuthor(author)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a book")
    public ResponseEntity<ApiResponse<BookResponseDto>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Book updated successfully", bookService.updateBook(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a book")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted successfully", null));
    }
}
