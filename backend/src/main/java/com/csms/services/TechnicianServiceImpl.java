package com.csms.services;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.csms.dto.LoginResponseDto;
import com.csms.dto.TechnicianDashboardDto;
import com.csms.dto.TechnicianLoginDto;
import com.csms.dto.TechnicianUpdateDto;
import com.csms.dto.UpdateStatusDto;
import com.csms.email.EmailService;
import com.csms.email.EmailTemplates;
import com.csms.entity.ServiceRequest;
import com.csms.entity.Technician;
import com.csms.repository.ServiceRequestRepo;
import com.csms.repository.TechnicianRepo;
import com.csms.security.JwtService;

import com.csms.exception.BadRequestException;
import com.csms.exception.ResourceNotFoundException;

@Service
public class TechnicianServiceImpl implements TechnicianService {
	@Autowired
	private ServiceRequestRepo requestRepo;
	@Autowired
	private TechnicianRepo techRepo;
	@Autowired
	private EmailService emailService;
	@Autowired
	private ActivityLogService activityLogService;
	@Autowired
	private FileStorageService fileStorageService;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	@Autowired
	private InvoiceService invoiceService;
	@Autowired
	private JwtService jwtService;
	
	@Override
	public Optional<LoginResponseDto> login(TechnicianLoginDto dto) {

	    Technician technician = techRepo.findByEmail(dto.getEmail())
	            .filter(t -> passwordEncoder.matches(
	                    dto.getPassword(),
	                    t.getPassword()))
	            .orElseThrow(() ->
	            new BadRequestException("Invalid Email or Password"));

	    String token = jwtService.generateToken(
	            technician.getEmail(),
	            technician.getRole());

	    LoginResponseDto response = new LoginResponseDto();
	    response.setToken(token);
	    response.setExpiresIn(1800000L);
	    response.setUser(technician);

	    return Optional.of(response);
	}
	
	@Override
	public List<ServiceRequest> getAssignedRequests(String email) {

	    Technician technician = techRepo.findByEmail(email)
	            .orElseThrow(() ->
	            new ResourceNotFoundException("Technician Not Found"));

	    return requestRepo.findByTechnicianId(technician.getId());
	}
	
	@Override
	public Optional<ServiceRequest> updateStatus(UpdateStatusDto dto) {

	    ServiceRequest request = requestRepo.findById(dto.getRequestId())
	            .orElseThrow(() ->
	            new ResourceNotFoundException("Request Not Found"));
	    request.setStatus(dto.getStatus());

	    Optional.of(dto.getStatus())
        .filter(status ->"COMPLETED".equalsIgnoreCase(status))
        .ifPresent(status -> {
            request.setCompletedAt(LocalDateTime.now());

            Technician technician =request.getTechnician();
            technician.setAvailable(true);
            techRepo.save(technician);
            invoiceService.generateInvoice(request);
            try {

                emailService.sendEmail(
                        request.getUser().getEmail(),
                        "CSMS | Service Request Completed",
                        EmailTemplates.requestCompleted(
                                request.getUser(),
                                request));

            } catch (Exception exception) {
                exception.printStackTrace();
            }
            activityLogService.saveActivity(
                    "TECHNICIAN",
                    technician.getName(),
                    technician.getEmail(),
                    "Completed Service Request",
                    "Request ID : "
                            + request.getRequestId());

        });
	    ServiceRequest updatedRequest =requestRepo.save(request);
	    return Optional.of(updatedRequest);

	}
	@Override
	public TechnicianDashboardDto getDashboard(String email) {

	    Technician technician = techRepo.findByEmail(email)
	            .orElseThrow(() ->
	                    new RuntimeException("Technician Not Found"));

	    Integer technicianId = technician.getId();

	    TechnicianDashboardDto dto =
	            new TechnicianDashboardDto();

	    dto.setAssignedRequests(
	            requestRepo.countByTechnicianId(technicianId));

	    dto.setCompletedRequests(
	            requestRepo.countByTechnicianIdAndStatus(
	                    technicianId,
	                    "COMPLETED"));

	    return dto;
	}
	@Override
	public Optional<Technician> updateProfile(
	        String email,
	        TechnicianUpdateDto dto) { 

	        	Technician technician = techRepo.findByEmail(email)
	        	        .orElseThrow(() ->
	        	                new RuntimeException("Technician Not Found"));

	    Optional.ofNullable(dto.getName())
	            .filter(name -> !name.isBlank())
	            .ifPresent(technician::setName);

	    Optional.ofNullable(dto.getPhone())
	            .filter(phone -> !phone.isBlank())
	            .ifPresent(technician::setPhnumber);

//	    Optional.ofNullable(dto.getPassword())
//	            .filter(password -> !password.isBlank())
//	            .ifPresent(technician::setPassword);
	    
	    Optional.ofNullable(dto.getPassword())
        .filter(password -> !password.isBlank())
        .ifPresent(password ->
                technician.setPassword(
                        passwordEncoder.encode(password)));

//	    Optional.ofNullable(dto.getProfilePhoto())
//	            .filter(photo -> !photo.isBlank())
//	            .ifPresent(photo -> {
//
//	                fileStorageService.deleteProfilePhoto(
//	                        technician.getProfilePhoto());
//
//	                technician.setProfilePhoto(photo);
//
//	            });
	    Optional.ofNullable(dto.getProfilePhoto())
        .ifPresent(photo -> {

            fileStorageService.deleteProfilePhoto(
                    technician.getProfilePhoto());

            technician.setProfilePhoto(photo);

        });
	    Technician updatedTechnician =
	            techRepo.save(technician);

	    activityLogService.saveActivity(
	            "TECHNICIAN",
	            updatedTechnician.getName(),
	            updatedTechnician.getEmail(),
	            "Updated Profile",
	            "Technician updated profile.");

	    return Optional.of(updatedTechnician);

	}
}
