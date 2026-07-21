package com.csms.services;

import java.time.LocalDate;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.dto.ReviewDto;
import com.csms.entity.Review;
import com.csms.entity.ServiceRequest;
import com.csms.entity.Technician;
import com.csms.entity.User;
import com.csms.repository.ReviewRepo;
import com.csms.repository.ServiceRequestRepo;
import com.csms.exception.BadRequestException;
import com.csms.exception.ResourceNotFoundException;


@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ServiceRequestRepo requestRepo;

    @Autowired
    private ActivityLogService activityLogService;

    // =====================================
    // Convert Entity -> DTO
    // =====================================

    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setReview(review.getReview());
        dto.setReviewDate(review.getReviewDate());
        Optional.ofNullable(review.getUser())
                .ifPresent(user -> {
                    dto.setUserId(user.getId());
                    dto.setUserName(user.getName());
                });
        Optional.ofNullable(review.getTechnician())
                .ifPresent(technician -> {
                    dto.setTechnicianId(technician.getId());
                    dto.setTechnicianName(technician.getName());
                });

        Optional.ofNullable(review.getServiceRequest())
                .ifPresent(request -> {
                    dto.setRequestId(
                            request.getRequestId());
                });
        dto.setReviewed(true);
        return dto;
    }

    // =====================================
    // Convert DTO -> Entity
    // =====================================

    private Review convertToEntity(
            ReviewDto dto,
            User user,
            Technician technician,
            ServiceRequest request) {

        Review review = new Review();
        review.setRating(dto.getRating());
        review.setReview(dto.getReview());
        review.setReviewDate(LocalDate.now());
        review.setUser(user);
        review.setTechnician(technician);
        review.setServiceRequest(request);
        return review;

    }
    // =====================================
    // Save Review
    // =====================================

    @Override
    public Optional<Review> save(ReviewDto dto) {

        ServiceRequest request = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() ->
                new ResourceNotFoundException("Service Request Not Found"));

        User user = request.getUser();

        Technician technician = request.getTechnician();

        Optional.of(request)
                .filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus()))
                .orElseThrow(() ->
                new BadRequestException("Review can only be submitted after service completion."));

        reviewRepo.findByServiceRequestRequestId(request.getRequestId())
                .ifPresent(review -> {
                	throw new BadRequestException(
                	        "You have already submitted a review.");
                });

        Review savedReview = reviewRepo.save(
                convertToEntity(
                        dto,
                        user,
                        technician,
                        request));

        activityLogService.saveActivity(
                "USER",
                user.getName(),
                user.getEmail(),
                "Submitted Review",
                "Rated Technician : "
                        + technician.getName()
                        + " | Request ID : "
                        + request.getRequestId()
                        + " | Rating : "
                        + dto.getRating()
                        + "/5");

        return Optional.of(savedReview);
    }
    // =====================================
    // Admin - Get All Reviews
    // =====================================

    @Override
    public List<ReviewDto> getAllReviews() {

        return reviewRepo
                .findAllByOrderByReviewDateDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }

    // =====================================
    // User - Get Own Reviews
    // =====================================

    @Override
    public List<ReviewDto> getReviewsByUser(
            Integer userId) {

        return reviewRepo
                .findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }

    // =====================================
    // Technician - Get Reviews Received
    // =====================================

    @Override
    public List<ReviewDto> getReviewsByTechnician(
            Integer technicianId) {

        return reviewRepo
                .findByTechnicianId(technicianId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }

}