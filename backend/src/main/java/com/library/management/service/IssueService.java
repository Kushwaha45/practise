package com.library.management.service;

import com.library.management.dto.DashboardStatsDto;
import com.library.management.dto.IssueRequestDto;
import com.library.management.dto.IssueResponseDto;

import java.util.List;

public interface IssueService {

    IssueResponseDto issueBook(IssueRequestDto request);

    IssueResponseDto returnBook(Long issueId);

    List<IssueResponseDto> getAllIssues();

    List<IssueResponseDto> getActiveIssues();

    List<IssueResponseDto> getMemberIssuedBooks(Long memberId);

    DashboardStatsDto getDashboardStats();
}
