package com.csms.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.ServiceRequestDto;
import com.csms.entity.ServiceRequest;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.ServiceRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/request")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService service;

    // ==========================================
    // Create Service Request
    // ==========================================

    @PostMapping("/create")
    public ResponseEntity<ResponseStructure<ServiceRequest>> save(
            @Valid @RequestBody ServiceRequestDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        ServiceRequest request = service.save(dto, email).get();

        ResponseStructure<ServiceRequest> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.CREATED.value());
        response.setMsg("Service Request Created Successfully");
        response.setData(request);
        response.setTimedate(LocalDate.now());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ==========================================
    // Delete Service Request
    // ==========================================

    @DeleteMapping("/{requestId}")
    public ResponseEntity<ResponseStructure<String>> deleteRequest(
            @PathVariable Integer requestId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        service.deleteRequest(requestId, email);

        ResponseStructure<String> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Service Request Deleted Successfully");
        response.setData("Deleted Successfully");
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

}