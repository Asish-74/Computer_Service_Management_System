package com.csms.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.entity.Admin;
import com.csms.entity.Technician;
import com.csms.entity.User;
import com.csms.repository.AdminRepo;
import com.csms.repository.TechnicianRepo;
import com.csms.repository.UserRepo;

@Service
public class JwtAuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private TechnicianRepo technicianRepo;

    public boolean isValidUser(String email, String role) {

        switch (role.toUpperCase()) {

        case "USER":
            return userRepo.findByEmail(email).isPresent();

        case "ADMIN":
            return adminRepo.findByEmail(email).isPresent();

        case "TECHNICIAN":
            return technicianRepo.findByEmail(email).isPresent();

        default:
            return false;
        }

    }

    public Optional<User> getUser(String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<Admin> getAdmin(String email) {
        return adminRepo.findByEmail(email);
    }

    public Optional<Technician> getTechnician(String email) {
        return technicianRepo.findByEmail(email);
    }
}