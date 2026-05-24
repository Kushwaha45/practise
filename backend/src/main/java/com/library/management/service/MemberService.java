package com.library.management.service;

import com.library.management.dto.MemberRequestDto;
import com.library.management.dto.MemberResponseDto;

import java.util.List;

public interface MemberService {

    MemberResponseDto createMember(MemberRequestDto request);

    MemberResponseDto updateMember(Long id, MemberRequestDto request);

    void deleteMember(Long id);

    MemberResponseDto getMemberById(Long id);

    MemberResponseDto getMemberByEmail(String email);

    List<MemberResponseDto> getAllMembers();
}
