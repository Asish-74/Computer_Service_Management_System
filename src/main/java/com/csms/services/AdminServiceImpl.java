package com.csms.services;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
import com.csms.repository.AdminRepo;
import com.csms.repository.ServiceRequestRepo;
import com.csms.repository.TechnicianRepo;
import com.csms.repository.UserRepo;
import com.csms.security.JwtService;

import jakarta.transaction.Transactional;

import com.csms.email.EmailService;
import com.csms.email.EmailTemplates;

import com.csms.exception.BadRequestException;
import com.csms.exception.ResourceNotFoundException;



@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepo repo;

    @Autowired
    private TechnicianRepo techRepo;

    @Autowired
    private ServiceRequestRepo requestRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    public Optional<LoginResponseDto> login(AdminLoginDto dto) {

        Admin admin = repo.findByEmail(dto.getEmail())
                .orElseThrow(() ->
                new BadRequestException("Invalid Email or Password"));
        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new BadRequestException("Invalid Email or Password");
        }

        String token = jwtService.generateToken(
                admin.getEmail(),
                admin.getRole());

        LoginResponseDto response = new LoginResponseDto();
        response.setToken(token);
        response.setExpiresIn(1800000L);
        response.setUser(admin);

        return Optional.of(response);
    }
    public Technician convert(TechnicianDto dto) {

        Technician tech = new Technician();

        tech.setName(dto.getName());
        tech.setEmail(dto.getEmail());
        tech.setPassword(passwordEncoder.encode(dto.getPassword()));
        tech.setPhnumber(dto.getPhnumber());
        tech.setSpec(dto.getSpec());
        tech.setExpe(dto.getExpe());

        tech.setRole("TECHNICIAN");
        tech.setAvailable(true);

        return tech;
    }

    @Override
    public Optional<Technician> save(TechnicianDto dto) {

    	Technician technician =
    	        techRepo.save(convert(dto));

    	activityLogService.saveActivity(
    	        "ADMIN",
    	        "Administrator",
    	        "admin@csms.com",
    	        "Added Technician",
    	        "Technician : " + technician.getName());

    	return Optional.of(technician);
    }
    
    @Override
    public List<ServiceRequest> getAllRequests() {
        return requestRepo.findAll();
    }
    
    @Transactional
    @Override
    public Optional<ServiceRequest> assignTechnician(
            AssignTechnicianDto dto) {

        ServiceRequest request = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() ->new ResourceNotFoundException("Service Request Not Found"));

        Optional.of(request)
                .filter(r -> "PENDING".equalsIgnoreCase(r.getStatus()))
                .orElseThrow(() ->new BadRequestException("This request has already been assigned."));

        Technician technician = techRepo
                .findByIdAndAvailableTrue(dto.getTechnicianId())
                .orElseThrow(() ->new ResourceNotFoundException("Technician Not Available"));

        request.setTechnician(technician);
        request.setStatus("ASSIGNED");
        request.setAssignedAt(LocalDateTime.now());

        technician.setAvailable(false);

        ServiceRequest updatedRequest = requestRepo.save(request);
        techRepo.save(technician);

        try {
            emailService.sendEmail(
                    updatedRequest.getUser().getEmail(),
                    "CSMS | Technician Assigned",
                    EmailTemplates.technicianAssigned(updatedRequest.getUser(),updatedRequest,technician));

            emailService.sendEmail(
                    technician.getEmail(),
                    "CSMS | New Service Request Assigned",
                    EmailTemplates.technicianNotification(technician,updatedRequest));
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        
        activityLogService.saveActivity(
                "ADMIN",
                "Administrator",
                "admin@csms.com",
                "Assigned Technician",
                "Request ID : "
                        + updatedRequest.getRequestId()
                        + " -> "
                        + technician.getName());
        
        return Optional.of(updatedRequest);
    }
    
    @Override
    public AdminDashboardDto getDashboard() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalUsers(userRepo.count());
        dto.setTotalTechnicians(techRepo.count());
        dto.setPendingRequests(
                requestRepo.findByStatus("PENDING").size());
        dto.setAssignedRequests(
                requestRepo.findByStatus("ASSIGNED").size());
        dto.setCompletedRequests(
                requestRepo.findByStatus("COMPLETED").size());
        return dto;
    }
    
    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    @Override
    public List<Technician> getAllTechnicians() {
        return techRepo.findAll();
    }
    
    @Override
    public Optional<Technician> updateTechnician(TechnicianDto dto) {

        Technician technician = techRepo.findById(dto.getId())
                .orElseThrow(() ->
                new ResourceNotFoundException("Technician Not Found"));

        technician.setName(dto.getName());
        technician.setEmail(dto.getEmail());
//        technician.setPassword(dto.getPassword());
        if (dto.getPassword() != null &&
        	    !dto.getPassword().isBlank()) {

        	    technician.setPassword(
        	            passwordEncoder.encode(dto.getPassword()));
        	}
        technician.setPhnumber(dto.getPhnumber());
        technician.setSpec(dto.getSpec());
        technician.setExpe(dto.getExpe());

        Technician updated = techRepo.save(technician);
        activityLogService.saveActivity(
                "ADMIN",
                "Administrator",
                "asishkhuntia07@gmail.com",
                "Updated Technician Profile",
                "Technician Name : "
                        + technician.getName()
                        + ", Email : "
                        + technician.getEmail());

        return Optional.of(updated);
    }
    
    @Override
    public void deleteTechnician(Integer id) {

        Technician technician = techRepo.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException("Technician Not Found"));
        String technicianName = technician.getName();
        techRepo.delete(technician);
        activityLogService.saveActivity(
                "ADMIN",
                "Administrator",
                "asishkhuntia07@gmail.com",
                "Deleted Technician",
                "Technician : " + technicianName);
    }
    @Override
    public Optional<Technician> getTechnicianById(Integer id) {
        return techRepo.findById(id);
    }
    
    @Override
    public Optional<Admin> updateProfile(
            String email,
            AdminUpdateDto dto) {

        Admin admin = repo.findByEmail(email)
                .orElseThrow(() ->
                new ResourceNotFoundException("Admin Not Found"));

        Optional.ofNullable(dto.getName())
                .filter(name -> !name.isBlank())
                .ifPresent(admin::setName);

        Optional.ofNullable(dto.getPhone())
                .filter(phone -> !phone.isBlank())
                .ifPresent(admin::setPhnumber);

        Optional.ofNullable(dto.getPassword())
                .filter(password -> !password.isBlank())
                .ifPresent(password ->
                        admin.setPassword(
                                passwordEncoder.encode(password)));

//        Optional.ofNullable(dto.getProfilePhoto())
//                .filter(photo -> !photo.isBlank())
//                .ifPresent(photo -> {
//
//                    fileStorageService.deleteProfilePhoto(
//                            admin.getProfilePhoto());
//
//                    admin.setProfilePhoto(photo);
//
//                });
        Optional.ofNullable(dto.getProfilePhoto())
        .ifPresent(photo -> {

            fileStorageService.deleteProfilePhoto(
                    admin.getProfilePhoto());

            admin.setProfilePhoto(photo);

        });

        Admin updatedAdmin = repo.save(admin);

        activityLogService.saveActivity(
                "ADMIN",
                updatedAdmin.getName(),
                updatedAdmin.getEmail(),
                "Updated Profile",
                "Administrator updated profile.");

        return Optional.of(updatedAdmin);
    }
}