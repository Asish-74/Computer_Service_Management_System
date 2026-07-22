package com.csms.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.dto.ForgotPasswordDto;
import com.csms.dto.ResetPasswordDto;
import com.csms.dto.VerifyOtpDto;
import com.csms.email.EmailService;
import com.csms.email.EmailTemplates;
import com.csms.entity.Admin;
import com.csms.entity.OtpVerification;
import com.csms.entity.Technician;
import com.csms.entity.User;
import com.csms.exception.BadRequestException;
import com.csms.exception.ResourceNotFoundException;
import com.csms.repository.AdminRepo;
import com.csms.repository.OtpVerificationRepo;
import com.csms.repository.TechnicianRepo;
import com.csms.repository.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private TechnicianRepo technicianRepo;

    @Autowired
    private OtpVerificationRepo otpRepo;

    @Autowired
    private EmailService emailService;

    @Override
    public void sendOtp(ForgotPasswordDto dto) {

        String email = dto.getEmail();

        boolean exists
                = userRepo.findByEmail(email).isPresent()
                || adminRepo.findByEmail(email).isPresent()
                || technicianRepo.findByEmail(email).isPresent();

        if (!exists) {
            throw new ResourceNotFoundException("Email Not Registered");
        }

        otpRepo.deleteByEmail(email);

        String otp = String.valueOf(
                100000 + new Random().nextInt(900000));

        OtpVerification verification = new OtpVerification();

        verification.setEmail(email);
        verification.setOtp(otp);
        verification.setVerified(false);
        verification.setExpiryTime(
                LocalDateTime.now().plusMinutes(5));

        otpRepo.save(verification);

        emailService.sendEmail(
                email,
                "CSMS | Password Reset OTP",
                EmailTemplates.forgotPasswordOtp(otp));

    }

    @Override
    public boolean verifyOtp(VerifyOtpDto dto) {

        OtpVerification otp = otpRepo.findByEmail(dto.getEmail())
                .orElseThrow(()
                        -> new ResourceNotFoundException("OTP Not Found"));

        if (!otp.getOtp().equals(dto.getOtp())) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otp.getExpiryTime())) {
            return false;
        }

        otp.setVerified(true);

        otpRepo.save(otp);

        return true;

    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordDto dto) {

        OtpVerification otp = otpRepo.findByEmail(dto.getEmail())
                .orElseThrow(()
                        -> new ResourceNotFoundException("OTP Not Found"));

        if (!otp.isVerified()) {
            throw new BadRequestException("Please verify OTP first.");
        }

        Optional<User> user
                = userRepo.findByEmail(dto.getEmail());

        user.ifPresent(value -> {

            value.setPassword(dto.getNewPassword());

            userRepo.save(value);

        });

        Optional<Admin> admin
                = adminRepo.findByEmail(dto.getEmail());

        admin.ifPresent(value -> {

            value.setPassword(dto.getNewPassword());

            adminRepo.save(value);

        });

        Optional<Technician> technician
                = technicianRepo.findByEmail(dto.getEmail());

        technician.ifPresent(value -> {

            value.setPassword(dto.getNewPassword());

            technicianRepo.save(value);

        });

        otpRepo.deleteByEmail(dto.getEmail());

    }

}
