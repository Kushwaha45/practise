package com.library.management.controller;

import com.library.management.dto.IssueResponseDto;
import com.library.management.dto.MemberRequestDto;
import com.library.management.dto.MemberResponseDto;
import com.library.management.response.ApiResponse;
import com.library.management.service.IssueService;
import com.library.management.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "Members", description = "Member management APIs")
public class MemberController {

    private final MemberService memberService;
    private final IssueService issueService;

    @PostMapping
    @Operation(summary = "Register a new member")
    public ResponseEntity<ApiResponse<MemberResponseDto>> createMember(@Valid @RequestBody MemberRequestDto request) {
        MemberResponseDto member = memberService.createMember(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member registered successfully", member));
    }

    @GetMapping
    @Operation(summary = "Get all members")
    public ResponseEntity<ApiResponse<List<MemberResponseDto>>> getAllMembers() {
        return ResponseEntity.ok(ApiResponse.success(memberService.getAllMembers()));
    }

    @GetMapping("/by-email/{email}")
    @Operation(summary = "Get member by email (member login)")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMemberByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMemberByEmail(email)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get member by ID")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMemberById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update member")
    public ResponseEntity<ApiResponse<MemberResponseDto>> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Member updated successfully", memberService.updateMember(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete member")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok(ApiResponse.success("Member deleted successfully", null));
    }

    @GetMapping("/{id}/books")
    @Operation(summary = "Get books issued to member")
    public ResponseEntity<ApiResponse<List<IssueResponseDto>>> getMemberBooks(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(issueService.getMemberIssuedBooks(id)));
    }
}
