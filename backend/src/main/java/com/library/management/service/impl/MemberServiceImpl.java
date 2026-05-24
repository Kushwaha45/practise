package com.library.management.service.impl;

import com.library.management.dto.MemberRequestDto;
import com.library.management.dto.MemberResponseDto;
import com.library.management.entity.Member;
import com.library.management.exception.BusinessException;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookIssueRepository;
import com.library.management.repository.MemberRepository;
import com.library.management.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final BookIssueRepository bookIssueRepository;

    @Override
    public MemberResponseDto createMember(MemberRequestDto request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Member with email " + request.getEmail() + " already exists");
        }
        if (memberRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Member with phone " + request.getPhone() + " already exists");
        }

        Member member = Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        return toResponse(memberRepository.save(member));
    }

    @Override
    public MemberResponseDto updateMember(Long id, MemberRequestDto request) {
        Member member = findMemberOrThrow(id);

        if (!member.getEmail().equals(request.getEmail()) && memberRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Member with email " + request.getEmail() + " already exists");
        }
        if (!member.getPhone().equals(request.getPhone()) && memberRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Member with phone " + request.getPhone() + " already exists");
        }

        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());

        return toResponse(memberRepository.save(member));
    }

    @Override
    public void deleteMember(Long id) {
        findMemberOrThrow(id);

        if (bookIssueRepository.countByMemberIdAndReturnedFalse(id) > 0) {
            throw new BusinessException("Cannot delete member with active book issues");
        }

        memberRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public MemberResponseDto getMemberById(Long id) {
        return toResponse(findMemberOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public MemberResponseDto getMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with email: " + email));
        return toResponse(member);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MemberResponseDto> getAllMembers() {
        return memberRepository.findAll().stream().map(this::toResponse).toList();
    }

    private Member findMemberOrThrow(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    private MemberResponseDto toResponse(Member member) {
        int activeIssues = (int) bookIssueRepository.countByMemberIdAndReturnedFalse(member.getId());
        return MemberResponseDto.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .address(member.getAddress())
                .activeIssuesCount(activeIssues)
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}
