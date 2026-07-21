package com.csms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.csms.entity.OtpVerification;

import jakarta.transaction.Transactional;

public interface OtpVerificationRepo
        extends JpaRepository<OtpVerification, Integer> {

    Optional<OtpVerification> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.email = ?1")
    void deleteByEmail(String email);

}