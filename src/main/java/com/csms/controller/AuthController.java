package com.csms.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.ForgotPasswordDto;
import com.csms.dto.ResetPasswordDto;
import com.csms.dto.VerifyOtpDto;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ==========================================
    // Forgot Password
    // ==========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseStructure<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordDto dto) {

        authService.sendOtp(dto);

        ResponseStructure<String> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("OTP Sent Successfully");
        response.setData("Check your email for the OTP.");
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Verify OTP
    // ==========================================

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseStructure<Boolean>> verifyOtp(
            @Valid @RequestBody VerifyOtpDto dto) {

        boolean verified = authService.verifyOtp(dto);

        ResponseStructure<Boolean> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg(
                verified
                        ? "OTP Verified Successfully"
                        : "Invalid or Expired OTP");
        response.setData(verified);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Reset Password
    // ==========================================

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseStructure<String>> resetPassword(
            @Valid @RequestBody ResetPasswordDto dto) {

        authService.resetPassword(dto);

        ResponseStructure<String> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Password Reset Successfully");
        response.setData("Password Updated Successfully.");
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

}