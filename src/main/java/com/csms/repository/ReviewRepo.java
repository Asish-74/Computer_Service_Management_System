package com.csms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.Review;

public interface ReviewRepo extends JpaRepository<Review, Integer> {

    // Check if review already exists for a service request
    Optional<Review> findByServiceRequestRequestId(Integer requestId);

    // All reviews given by a user
    List<Review> findByUserId(Integer userId);

    // All reviews of a technician
    List<Review> findByTechnicianId(Integer technicianId);

    // Reviews ordered by latest first
    List<Review> findAllByOrderByReviewDateDesc();

}