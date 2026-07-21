package com.csms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.LoginResponseDto;
import com.csms.dto.TechnicianDashboardDto;
import com.csms.dto.TechnicianLoginDto;
import com.csms.dto.TechnicianUpdateDto;
import com.csms.dto.UpdateStatusDto;
import com.csms.entity.ServiceRequest;
import com.csms.entity.Technician;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.TechnicianService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/technician")
public class TechnicianController {

    @Autowired
    private TechnicianService service;

    // ==========================================
    // Technician Login
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<ResponseStructure<LoginResponseDto>> login(
            @Valid @RequestBody TechnicianLoginDto dto) {

        LoginResponseDto loginResponse = service.login(dto).get();

        ResponseStructure<LoginResponseDto> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Login Successful");
        response.setData(loginResponse);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Assigned Requests
    // ==========================================

    @GetMapping("/requests")
    public ResponseEntity<ResponseStructure<List<ServiceRequest>>> getAssignedRequests() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        List<ServiceRequest> requests = service.getAssignedRequests(email);

        ResponseStructure<List<ServiceRequest>> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Assigned Requests Retrieved Successfully");
        response.setData(requests);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Update Request Status
    // ==========================================

    @PutMapping("/update-status")
    public ResponseEntity<ResponseStructure<ServiceRequest>> updateStatus(
            @Valid @RequestBody UpdateStatusDto dto) {

        ServiceRequest request = service.updateStatus(dto).get();

        ResponseStructure<ServiceRequest> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Request Status Updated Successfully");
        response.setData(request);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Dashboard
    // ==========================================

    @GetMapping("/dashboard")
    public ResponseEntity<ResponseStructure<TechnicianDashboardDto>> dashboard() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        TechnicianDashboardDto dashboard = service.getDashboard(email);

        ResponseStructure<TechnicianDashboardDto> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Dashboard Loaded Successfully");
        response.setData(dashboard);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Update Profile
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<ResponseStructure<Technician>> updateProfile(
            @Valid @RequestBody TechnicianUpdateDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Technician technician = service.updateProfile(email, dto).get();

        ResponseStructure<Technician> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Technician Profile Updated Successfully");
        response.setData(technician);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }
}