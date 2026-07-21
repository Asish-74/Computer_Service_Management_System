package com.csms.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.csms.repository.AdminRepo;
import com.csms.repository.TechnicianRepo;
import com.csms.repository.UserRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private TechnicianRepo technicianRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        return userRepo.findByEmail(email)
                .<UserDetails>map(user -> new CustomUserDetails(
                        user.getEmail(),
                        user.getPassword(),
                        user.getRole()))

                .or(() -> adminRepo.findByEmail(email)
                        .map(admin -> new CustomUserDetails(
                                admin.getEmail(),
                                admin.getPassword(),
                                admin.getRole())))

                .or(() -> technicianRepo.findByEmail(email)
                        .map(technician -> new CustomUserDetails(
                                technician.getEmail(),
                                technician.getPassword(),
                                technician.getRole())))

                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));
    }
}