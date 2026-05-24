package com.library.management.repository;

import com.library.management.entity.BookIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {

    List<BookIssue> findByReturnedFalse();

    List<BookIssue> findByMemberId(Long memberId);

    List<BookIssue> findByMemberIdAndReturnedFalse(Long memberId);

    long countByMemberIdAndReturnedFalse(Long memberId);

    Optional<BookIssue> findByBookIdAndReturnedFalse(Long bookId);

    Optional<BookIssue> findByBookIdAndMemberIdAndReturnedFalse(Long bookId, Long memberId);

    long countByBookIdAndReturnedFalse(Long bookId);

    long countByReturnedFalse();
}
