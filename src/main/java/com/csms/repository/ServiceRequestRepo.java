package com.csms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.ServiceRequest;


public interface ServiceRequestRepo extends JpaRepository<ServiceRequest, Integer>{
	List<ServiceRequest> findByTechnicianId(Integer technicianId);

    List<ServiceRequest> findByUserId(Integer userId);

    List<ServiceRequest> findByStatus(String status);

    long countByStatus(String status);

    long countByTechnicianId(Integer technicianId);
    long countByTechnicianIdAndStatus(Integer technicianId,String status);

    long countByUserId(Integer userId);
    long countByUserIdAndStatus(Integer userId,String status);
    
    Optional<ServiceRequest> findByRequestIdAndUserIdAndStatus(Integer requestId,Integer userId,String status);
}
