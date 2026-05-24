package com.library.management.service;

import com.library.management.dto.BookRequestDto;
import com.library.management.dto.BookResponseDto;

import java.util.List;

public interface BookService {

    BookResponseDto createBook(BookRequestDto request);

    BookResponseDto updateBook(Long id, BookRequestDto request);

    void deleteBook(Long id);

    BookResponseDto getBookById(Long id);

    List<BookResponseDto> getAllBooks();

    List<BookResponseDto> getAvailableBooks();

    List<BookResponseDto> searchByTitle(String title);

    List<BookResponseDto> searchByAuthor(String author);
}
