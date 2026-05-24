package com.library.management.controller;

import com.library.management.dto.DashboardStatsDto;
import com.library.management.dto.IssueRequestDto;
import com.library.management.dto.IssueResponseDto;
import com.library.management.response.ApiResponse;
import com.library.management.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Tag(name = "Issues", description = "Book issue and return APIs")
public class IssueController {

    private final IssueService issueService;

    @PostMapping("/issue")
    @Operation(summary = "Issue a book to a member")
    public ResponseEntity<ApiResponse<IssueResponseDto>> issueBook(@Valid @RequestBody IssueRequestDto request) {
        IssueResponseDto issue = issueService.issueBook(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book issued successfully", issue));
    }

    @PutMapping("/return/{issueId}")
    @Operation(summary = "Return a book")
    public ResponseEntity<ApiResponse<IssueResponseDto>> returnBook(@PathVariable Long issueId) {
        return ResponseEntity.ok(ApiResponse.success("Book returned successfully", issueService.returnBook(issueId)));
    }

    @GetMapping
    @Operation(summary = "Get all issued books")
    public ResponseEntity<ApiResponse<List<IssueResponseDto>>> getAllIssues() {
        return ResponseEntity.ok(ApiResponse.success(issueService.getAllIssues()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active issues")
    public ResponseEntity<ApiResponse<List<IssueResponseDto>>> getActiveIssues() {
        return ResponseEntity.ok(ApiResponse.success(issueService.getActiveIssues()));
    }
}
