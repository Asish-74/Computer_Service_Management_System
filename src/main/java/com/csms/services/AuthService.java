package com.csms.services;

import com.csms.dto.ForgotPasswordDto;
import com.csms.dto.ResetPasswordDto;
import com.csms.dto.VerifyOtpDto;

public interface AuthService {

    void sendOtp(ForgotPasswordDto dto);

    boolean verifyOtp(VerifyOtpDto dto);

    void resetPassword(ResetPasswordDto dto);

}