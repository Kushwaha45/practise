package com.library.management.service.impl;

import com.library.management.dto.DashboardStatsDto;
import com.library.management.dto.IssueRequestDto;
import com.library.management.dto.IssueResponseDto;
import com.library.management.entity.Book;
import com.library.management.entity.BookIssue;
import com.library.management.entity.Member;
import com.library.management.exception.BusinessException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookIssueRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.MemberRepository;
import com.library.management.service.IssueService;
import com.library.management.validation.ValidationConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IssueServiceImpl implements IssueService {

    private final BookIssueRepository bookIssueRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    @Override
    public IssueResponseDto issueBook(IssueRequestDto request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.getBookId()));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + request.getMemberId()));

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new BusinessException("Book is not available for issue");
        }

        if (bookIssueRepository.findByBookIdAndMemberIdAndReturnedFalse(book.getId(), member.getId()).isPresent()) {
            throw new BusinessException("Member already has an active issue for this book");
        }

        long activeIssuesForBook = bookIssueRepository.countByBookIdAndReturnedFalse(book.getId());
        if (activeIssuesForBook >= book.getTotalCopies()) {
            throw new BusinessException("All copies of this book are currently issued");
        }

        long activeIssues = bookIssueRepository.countByMemberIdAndReturnedFalse(member.getId());
        if (activeIssues >= ValidationConstants.MAX_BOOKS_PER_MEMBER) {
            throw new BusinessException("Member has reached maximum limit of " + ValidationConstants.MAX_BOOKS_PER_MEMBER + " books");
        }

        if (request.getDueDate().isBefore(LocalDate.now())) {
            throw new BusinessException("Due date cannot be in the past");
        }

        BookIssue issue = BookIssue.builder()
                .book(book)
                .member(member)
                .issueDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .returned(false)
                .build();

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        book.setAvailable(book.getAvailableCopies() > 0);
        bookRepository.save(book);

        return toResponse(bookIssueRepository.save(issue));
    }

    @Override
    public IssueResponseDto returnBook(Long issueId) {
        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        if (Boolean.TRUE.equals(issue.getReturned())) {
            throw new BusinessException("Book has already been returned");
        }

        issue.setReturned(true);
        issue.setReturnDate(LocalDate.now());

        Book book = issue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        book.setAvailable(true);
        bookRepository.save(book);

        return toResponse(bookIssueRepository.save(issue));
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getAllIssues() {
        return bookIssueRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getActiveIssues() {
        return bookIssueRepository.findByReturnedFalse().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getMemberIssuedBooks(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResourceNotFoundException("Member not found with id: " + memberId);
        }
        return bookIssueRepository.findByMemberId(memberId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        return DashboardStatsDto.builder()
                .totalBooks(bookRepository.count())
                .availableBooks(bookRepository.countByAvailableTrue())
                .issuedBooks(bookIssueRepository.countByReturnedFalse())
                .totalMembers(memberRepository.count())
                .build();
    }

    private IssueResponseDto toResponse(BookIssue issue) {
        return IssueResponseDto.builder()
                .id(issue.getId())
                .bookId(issue.getBook().getId())
                .bookTitle(issue.getBook().getTitle())
                .bookAuthor(issue.getBook().getAuthor())
                .memberId(issue.getMember().getId())
                .memberName(issue.getMember().getName())
                .issueDate(issue.getIssueDate())
                .dueDate(issue.getDueDate())
                .returnDate(issue.getReturnDate())
                .returned(issue.getReturned())
                .createdAt(issue.getCreatedAt())
                .build();
    }
}
