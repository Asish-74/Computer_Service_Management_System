package com.csms.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.Technician;


public interface TechnicianRepo extends JpaRepository<Technician, Integer>{
	
//	Optional<Technician> findByEmailAndPassword(String email, String Password);
	Optional<Technician> findByIdAndAvailableTrue(Integer id);
	Optional<Technician> findByEmail(String email);
	
	//or 
//	@Query("SELECT t FROM Technician t WHERE t.id = :id AND t.available = true")
//	Optional<Technician> findAvailableTechnician(@Param("id") Integer id);
}
