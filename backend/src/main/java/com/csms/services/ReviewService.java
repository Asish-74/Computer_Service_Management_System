package com.csms.services;

import java.util.List;
import java.util.Optional;

import com.csms.dto.ReviewDto;
import com.csms.entity.Review;

public interface ReviewService {

    // User submits a review
    Optional<Review> save(ReviewDto dto);

    // Admin - View all reviews
    List<ReviewDto> getAllReviews();

    // User - View own reviews
    List<ReviewDto> getReviewsByUser(Integer userId);

    // Technician - View reviews received
    List<ReviewDto> getReviewsByTechnician(Integer technicianId);

}