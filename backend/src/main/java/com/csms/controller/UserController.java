package com.csms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csms.dto.LoginResponseDto;
import com.csms.dto.ServiceRequestResponseDto;
import com.csms.dto.UserDashboardDto;
import com.csms.dto.UserDto;
import com.csms.dto.UserLoginDto;
import com.csms.dto.UserUpdateDto;
import com.csms.entity.User;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("CSMS Backend Running Successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseStructure<User>> save(
            @Valid @RequestBody UserDto dto) {

        User user = service.save(dto).get();

        ResponseStructure<User> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.CREATED.value());
        response.setMsg("User Registered Successfully");
        response.setData(user);
        response.setTimedate(LocalDate.now());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseStructure<LoginResponseDto>> login(
            @Valid @RequestBody UserLoginDto dto) {

        LoginResponseDto loginResponse = service.login(dto).get();

        ResponseStructure<LoginResponseDto> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Login Successful");
        response.setData(loginResponse);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests")
    public ResponseEntity<ResponseStructure<List<ServiceRequestResponseDto>>> getMyRequests() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        ResponseStructure<List<ServiceRequestResponseDto>> response = new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Requests Retrieved Successfully");
        response.setData(service.getMyRequests(email));
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ResponseStructure<UserDashboardDto>> dashboard() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        UserDashboardDto dashboard = service.getDashboard(email);

        ResponseStructure<UserDashboardDto> response = new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Dashboard Loaded Successfully");
        response.setData(dashboard);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseStructure<User>> updateProfile(
            @Valid @RequestBody UserUpdateDto dto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User updatedUser = service.updateProfile(email, dto).get();

        ResponseStructure<User> response = new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Profile Updated Successfully");
        response.setData(updatedUser);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

}