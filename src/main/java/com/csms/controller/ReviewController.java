package com.csms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.ReviewDto;
import com.csms.entity.Review;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService service;

    // ==========================================
    // Submit Review
    // ==========================================

    @PostMapping
    public ResponseEntity<ResponseStructure<Review>> saveReview(
            @Valid @RequestBody ReviewDto dto) {

        Review review = service.save(dto).get();

        ResponseStructure<Review> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.CREATED.value());
        response.setMsg("Review Submitted Successfully");
        response.setData(review);
        response.setTimedate(LocalDate.now());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ==========================================
    // Get All Reviews
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<ResponseStructure<List<ReviewDto>>> getAllReviews() {

        List<ReviewDto> reviews = service.getAllReviews();

        ResponseStructure<List<ReviewDto>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("All Reviews Fetched Successfully");
        response.setData(reviews);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Get Reviews By User
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseStructure<List<ReviewDto>>> getReviewsByUser(
            @PathVariable Integer userId) {

        List<ReviewDto> reviews = service.getReviewsByUser(userId);

        ResponseStructure<List<ReviewDto>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("User Reviews Fetched Successfully");
        response.setData(reviews);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Get Reviews By Technician
    // ==========================================

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<ResponseStructure<List<ReviewDto>>> getReviewsByTechnician(
            @PathVariable Integer technicianId) {

        List<ReviewDto> reviews = service.getReviewsByTechnician(technicianId);

        ResponseStructure<List<ReviewDto>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Technician Reviews Fetched Successfully");
        response.setData(reviews);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

}