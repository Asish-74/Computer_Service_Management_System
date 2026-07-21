package com.csms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.AdminDashboardDto;
import com.csms.dto.AdminLoginDto;
import com.csms.dto.AdminUpdateDto;
import com.csms.dto.AssignTechnicianDto;
import com.csms.dto.LoginResponseDto;
import com.csms.dto.TechnicianDto;
import com.csms.entity.Admin;
import com.csms.entity.ServiceRequest;
import com.csms.entity.Technician;
import com.csms.entity.User;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService service;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Admin API Running");
    }

    // ==========================================
    // Admin Login
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<ResponseStructure<LoginResponseDto>> login(
            @Valid @RequestBody AdminLoginDto dto) {

        LoginResponseDto loginResponse = service.login(dto).get();

        ResponseStructure<LoginResponseDto> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Login Successful");
        response.setData(loginResponse);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Register Technician
    // ==========================================

    @PostMapping("/technician/register")
    public ResponseEntity<ResponseStructure<Technician>> registerTechnician(
            @Valid @RequestBody TechnicianDto dto) {

        Technician technician = service.save(dto).get();

        ResponseStructure<Technician> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.CREATED.value());
        response.setMsg("Technician Registered Successfully");
        response.setData(technician);
        response.setTimedate(LocalDate.now());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ==========================================
    // Get All Requests
    // ==========================================

    @GetMapping("/requests")
    public ResponseEntity<ResponseStructure<List<ServiceRequest>>> getAllRequests() {

        List<ServiceRequest> requests = service.getAllRequests();

        ResponseStructure<List<ServiceRequest>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("All Requests Retrieved Successfully");
        response.setData(requests);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Assign Technician
    // ==========================================

    @PostMapping("/assign-technician")
    public ResponseEntity<ResponseStructure<ServiceRequest>> assignTechnician(
            @Valid @RequestBody AssignTechnicianDto dto) {

        ServiceRequest request =
                service.assignTechnician(dto).get();

        ResponseStructure<ServiceRequest> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Technician Assigned Successfully");
        response.setData(request);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Dashboard
    // ==========================================

    @GetMapping("/dashboard")
    public ResponseEntity<ResponseStructure<AdminDashboardDto>> dashboard() {

        AdminDashboardDto dashboard = service.getDashboard();

        ResponseStructure<AdminDashboardDto> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Dashboard Loaded Successfully");
        response.setData(dashboard);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Get All Users
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<ResponseStructure<List<User>>> getAllUsers() {

        List<User> users = service.getAllUsers();

        ResponseStructure<List<User>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Users Retrieved Successfully");
        response.setData(users);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Get All Technicians
    // ==========================================

    @GetMapping("/technicians")
    public ResponseEntity<ResponseStructure<List<Technician>>> getAllTechnicians() {

        List<Technician> technicians =
                service.getAllTechnicians();

        ResponseStructure<List<Technician>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Technicians Retrieved Successfully");
        response.setData(technicians);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Update Technician
    // ==========================================

    @PutMapping("/technician")
    public ResponseEntity<ResponseStructure<Technician>> updateTechnician(
            @Valid @RequestBody TechnicianDto dto) {

        Technician technician =
                service.updateTechnician(dto).get();

        ResponseStructure<Technician> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Technician Updated Successfully");
        response.setData(technician);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Delete Technician
    // ==========================================

    @DeleteMapping("/technician/{id}")
    public ResponseEntity<ResponseStructure<String>> deleteTechnician(
            @PathVariable Integer id) {

        service.deleteTechnician(id);

        ResponseStructure<String> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Technician Deleted Successfully");
        response.setData("Deleted Successfully");
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Update Admin Profile
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<ResponseStructure<Admin>> updateProfile(
            @Valid @RequestBody AdminUpdateDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Admin admin =
                service.updateProfile(email, dto).get();

        ResponseStructure<Admin> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Profile Updated Successfully");
        response.setData(admin);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }
}