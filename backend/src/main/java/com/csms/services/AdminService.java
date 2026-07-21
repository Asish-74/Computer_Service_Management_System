package com.csms.services;

import java.util.List;
import java.util.Optional;

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

public interface AdminService {

//    Optional<Admin> login(AdminLoginDto dto);
	Optional<LoginResponseDto> login(AdminLoginDto dto);
    Optional<Technician> save(TechnicianDto dto);
    List<ServiceRequest> getAllRequests();
    Optional<ServiceRequest> assignTechnician(AssignTechnicianDto dto);
    AdminDashboardDto getDashboard();
    List<User> getAllUsers();
    List<Technician> getAllTechnicians();
    Optional<Technician> getTechnicianById(Integer id);
    Optional<Technician> updateTechnician(TechnicianDto dto);
    void deleteTechnician(Integer id);
    
    Optional<Admin> updateProfile(String email, AdminUpdateDto dto);
    
}