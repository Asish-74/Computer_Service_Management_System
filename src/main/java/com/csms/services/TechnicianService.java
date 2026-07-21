package com.csms.services;

import java.util.List;
import java.util.Optional;

import com.csms.dto.LoginResponseDto;
import com.csms.dto.TechnicianDashboardDto;
import com.csms.dto.TechnicianLoginDto;
import com.csms.dto.TechnicianUpdateDto;
import com.csms.dto.UpdateStatusDto;
import com.csms.entity.ServiceRequest;
import com.csms.entity.Technician;

public interface TechnicianService {
//	Optional<Technician> login(TechnicianLoginDto dto);
	 Optional<LoginResponseDto> login(TechnicianLoginDto dto);
	 List<ServiceRequest> getAssignedRequests(String email);
	Optional<ServiceRequest> updateStatus(UpdateStatusDto dto);
	
	TechnicianDashboardDto getDashboard(String email);
	Optional<Technician> updateProfile(String email,TechnicianUpdateDto dto);
	
}
