package com.csms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.Admin;

public interface AdminRepo extends JpaRepository<Admin, Integer> {
//	Optional<Admin> findByEmailAndPassword(String email, String password);
	Optional<Admin> findByEmail(String email);
	Optional<Admin> findFirstBy();
}
