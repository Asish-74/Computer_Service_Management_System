package com.csms.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.csms.dto.LoginResponseDto;
import com.csms.dto.ServiceRequestResponseDto;
import com.csms.dto.UserDashboardDto;
import com.csms.dto.UserDto;
import com.csms.dto.UserLoginDto;
import com.csms.dto.UserUpdateDto;
import com.csms.entity.ServiceRequest;
import com.csms.entity.User;
import com.csms.repository.ReviewRepo;
import com.csms.repository.ServiceRequestRepo;
import com.csms.repository.UserRepo;
import com.csms.security.JwtService;

import com.csms.exception.BadRequestException;
import com.csms.exception.ResourceNotFoundException;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private ServiceRequestRepo requestRepo;

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    // ===========================================
    // Convert UserDto -> User
    // ===========================================

    private User convert(UserDto dto) {

        User user = new User();

        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhnumber(dto.getPhone());
//        user.setPassword(dto.getPassword());
        user.setPassword(
                passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");

        return user;
    }

    // ===========================================
    // Convert ServiceRequest -> Response DTO
    // ===========================================

    private ServiceRequestResponseDto convertToDto(ServiceRequest request) {

        ServiceRequestResponseDto dto =new ServiceRequestResponseDto();

        dto.setRequestId(request.getRequestId());
        dto.setServiceType(request.getServiceType());
        dto.setBrandName(request.getBrandName());
        dto.setModelNumber(request.getModelNumber());
        dto.setPriority(request.getPriority());
        dto.setProblemDescription(request.getProblemDescription());
        dto.setRequestDate(request.getRequestDate());
        dto.setAssignedAt(request.getAssignedAt());
        dto.setCompletedAt(request.getCompletedAt());
        dto.setStatus(request.getStatus());
        dto.setBasePrice(request.getBasePrice());
        dto.setGstAmount(request.getGstAmount());
        dto.setTotalAmount(request.getTotalAmount());
        dto.setEstimatedDays(request.getEstimatedDays());

        Optional.ofNullable(request.getTechnician()).ifPresent(technician -> {
                    dto.setTechnicianId(technician.getId());
                    dto.setTechnicianName(technician.getName());
                });

        dto.setReviewed(reviewRepo.findByServiceRequestRequestId(request.getRequestId()).isPresent());

        return dto;
    }

    // ===========================================
    // Register User
    // ===========================================

    @Override
    public Optional<User> save(UserDto dto) {
        return Optional.of(repo.save(convert(dto)));
    }

    // ===========================================
    // Login
    // ===========================================

    @Override
    public Optional<LoginResponseDto> login(UserLoginDto dto) {

        User user = repo.findByEmail(dto.getEmail())
                .filter(u -> passwordEncoder.matches(
                        dto.getPassword(),
                        u.getPassword()))
                .orElseThrow(() ->
                new BadRequestException("Invalid Email or Password"));

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole());

        LoginResponseDto response = new LoginResponseDto();
        response.setToken(token);
        response.setExpiresIn(1800000L);
        response.setUser(user);

        return Optional.of(response);
    }

    // ===========================================
    // My Requests
    // ===========================================

    @Override
    public List<ServiceRequestResponseDto> getMyRequests(String email) {

        User user = repo.findByEmail(email)
                .orElseThrow(() ->
                new ResourceNotFoundException("User Not Found"));

        return requestRepo.findByUserId(user.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    // ===========================================
    // Dashboard
    // ===========================================

    @Override
    public UserDashboardDto getDashboard(String email) {

        User user = repo.findByEmail(email)
                .orElseThrow(() ->
                new ResourceNotFoundException("User Not Found"));

        Integer userId = user.getId();

        UserDashboardDto dto = new UserDashboardDto();

        dto.setTotalRequests(
                requestRepo.countByUserId(userId));

        dto.setPendingRequests(
                requestRepo.countByUserIdAndStatus(
                        userId,
                        "PENDING"));

        dto.setAssignedRequests(
                requestRepo.countByUserIdAndStatus(
                        userId,
                        "ASSIGNED"));

        dto.setCompletedRequests(
                requestRepo.countByUserIdAndStatus(
                        userId,
                        "COMPLETED"));

        return dto;
    }

    // ===========================================
    // Update Profile
    // ===========================================

    @Override
    public Optional<User> updateProfile(
            String email,
            UserUpdateDto dto) {

        User user = repo.findByEmail(email)
                .orElseThrow(() ->
                new ResourceNotFoundException("User Not Found"));

        Optional.ofNullable(dto.getName())
                .filter(name -> !name.isBlank())
                .ifPresent(user::setName);

        Optional.ofNullable(dto.getPhone())
                .filter(phone -> !phone.isBlank())
                .ifPresent(user::setPhnumber);

        Optional.ofNullable(dto.getAddress())
                .filter(address -> !address.isBlank())
                .ifPresent(user::setAddr);

        Optional.ofNullable(dto.getPassword())
                .filter(password -> !password.isBlank())
                .ifPresent(password ->
                        user.setPassword(
                                passwordEncoder.encode(password)));
        
        Optional.ofNullable(dto.getProfilePhoto())
        .ifPresent(photo -> {

            fileStorageService.deleteProfilePhoto(
                    user.getProfilePhoto());

            user.setProfilePhoto(photo);

        });

        User updatedUser = repo.save(user);

        activityLogService.saveActivity(
                "USER",
                updatedUser.getName(),
                updatedUser.getEmail(),
                "Updated Profile",
                "Profile information updated.");

        return Optional.of(updatedUser);
    }

}