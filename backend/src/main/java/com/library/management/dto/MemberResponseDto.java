package com.library.management.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponseDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Integer activeIssuesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
