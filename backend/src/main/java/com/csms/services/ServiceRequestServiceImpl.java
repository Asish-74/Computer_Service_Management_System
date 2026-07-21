package com.csms.services;

import java.time.LocalDate;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.dto.ServiceRequestDto;
import com.csms.entity.ServiceCatalog;
import com.csms.entity.ServiceRequest;
import com.csms.entity.User;
import com.csms.repository.AdminRepo;
import com.csms.repository.ServiceCatalogRepo;
import com.csms.repository.ServiceRequestRepo;
import com.csms.repository.UserRepo;

import com.csms.email.EmailService;
import com.csms.email.EmailTemplates;
import com.csms.exception.ResourceNotFoundException;

@Service
public class ServiceRequestServiceImpl  implements ServiceRequestService{
	@Autowired
	private ServiceRequestRepo repo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private ActivityLogService activityLogService;
	
	@Autowired
	private ServiceCatalogRepo serviceCatalogRepo;
	
	@Autowired
	private AdminRepo adminRepo;
	
	public ServiceRequest convert(ServiceRequestDto dto) {
	    ServiceRequest request = new ServiceRequest();

	    request.setServiceType(dto.getServiceType());
	    request.setBrandName(dto.getBrandName());
	    request.setModelNumber(dto.getModelNumber());
	    request.setPriority(dto.getPriority());
	    request.setProblemDescription(dto.getProblemDescription());
	    request.setRequestDate(LocalDate.now());
	    request.setStatus("PENDING");

	    return request;
	}
	
	
	@Override
	public Optional<ServiceRequest> save(
	        ServiceRequestDto dto,
	        String email){

		User user = userRepo.findByEmail(email)
		        .orElseThrow(() ->
		        new ResourceNotFoundException("User Not Found"));

	    ServiceCatalog service = serviceCatalogRepo
	            .findByServiceName(dto.getServiceType())
	            .orElseThrow(() ->
	            new ResourceNotFoundException("Service Not Found"));

	    ServiceRequest request = convert(dto);

	    request.setUser(user);
	    request.setStatus("PENDING");

	    request.setBasePrice(service.getBasePrice());

	    double gst = service.getBasePrice() * 0.10;
	    request.setGstAmount(gst);
	    request.setTotalAmount(service.getBasePrice() + gst);
	    request.setEstimatedDays(service.getEstimatedDays());

	    ServiceRequest savedRequest = repo.save(request);

	    try {

	        // Email to User
	        emailService.sendEmail(
	                user.getEmail(),
	                "CSMS | Service Request Created",
	                EmailTemplates.requestCreated(user, savedRequest));

	        // Email to Admin
	        adminRepo.findFirstBy().ifPresent(admin ->
	                emailService.sendEmail(
	                        admin.getEmail(),
	                        "CSMS | New Service Request",
	                        EmailTemplates.adminNewRequest(user, savedRequest))
	        );

	    } catch (Exception exception) {

	        exception.printStackTrace();

	    }

	    activityLogService.saveActivity(
	            "USER",
	            user.getName(),
	            user.getEmail(),
	            "Created Service Request",
	            "Request ID : " + savedRequest.getRequestId());

	    return Optional.of(savedRequest);

	}
	
	@Override
	public void deleteRequest(Integer requestId, String email) {

	    User user = userRepo.findByEmail(email)
	            .orElseThrow(() ->
	            new ResourceNotFoundException("User Not Found"));

	    ServiceRequest request = repo
	            .findByRequestIdAndUserIdAndStatus(
	                    requestId,
	                    user.getId(),
	                    "PENDING")
	            .orElseThrow(() ->
	            new ResourceNotFoundException(
	                    "Pending Service Request Not Found"));

	    repo.delete(request);

	    try {
	        emailService.sendEmail(
	                user.getEmail(),
	                "CSMS | Service Request Cancelled",
	                EmailTemplates.requestCancelled(user, request));
	    } catch (Exception exception) {
	        exception.printStackTrace();
	    }

	    activityLogService.saveActivity(
	            "USER",
	            user.getName(),
	            user.getEmail(),
	            "Cancelled Service Request",
	            "Request ID : " + request.getRequestId());
	}
}
