package com.library.management.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    private Long totalBooks;
    private Long availableBooks;
    private Long issuedBooks;
    private Long totalMembers;
}
