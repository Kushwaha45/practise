package com.library.management.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueResponseDto {

    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private Long memberId;
    private String memberName;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private Boolean returned;
    private LocalDateTime createdAt;
}
