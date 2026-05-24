package com.library.management.service.impl;

import com.library.management.dto.BookRequestDto;
import com.library.management.dto.BookResponseDto;
import com.library.management.entity.Book;
import com.library.management.exception.BusinessException;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookIssueRepository;
import com.library.management.repository.BookRepository;
import com.library.management.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookIssueRepository bookIssueRepository;

    @Override
    public BookResponseDto createBook(BookRequestDto request) {
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new DuplicateResourceException("Book with ISBN " + request.getIsbn() + " already exists");
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .category(request.getCategory())
                .totalCopies(request.getTotalCopies())
                .availableCopies(request.getTotalCopies())
                .available(true)
                .build();

        return toResponse(bookRepository.save(book));
    }

    @Override
    public BookResponseDto updateBook(Long id, BookRequestDto request) {
        Book book = findBookOrThrow(id);

        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new DuplicateResourceException("Book with ISBN " + request.getIsbn() + " already exists");
        }

        int issuedCopies = book.getTotalCopies() - book.getAvailableCopies();
        if (request.getTotalCopies() < issuedCopies) {
            throw new BusinessException("Total copies cannot be less than currently issued copies (" + issuedCopies + ")");
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setCategory(request.getCategory());
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(request.getTotalCopies() - issuedCopies);
        book.setAvailable(book.getAvailableCopies() > 0);

        return toResponse(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {
        Book book = findBookOrThrow(id);

        if (bookIssueRepository.findByBookIdAndReturnedFalse(id).isPresent()) {
            throw new BusinessException("Cannot delete book with active issues");
        }

        bookRepository.delete(book);
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponseDto getBookById(Long id) {
        return toResponse(findBookOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> getAllBooks() {
        return bookRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> getAvailableBooks() {
        return bookRepository.findByAvailableTrue().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author).stream().map(this::toResponse).toList();
    }

    private Book findBookOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    private BookResponseDto toResponse(Book book) {
        return BookResponseDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .category(book.getCategory())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .available(book.getAvailable())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
