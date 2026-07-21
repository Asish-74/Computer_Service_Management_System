package com.csms.email;

import com.csms.entity.ServiceRequest;
import com.csms.entity.Technician;
import com.csms.entity.User;

public class EmailTemplates {

    private EmailTemplates() {
    }

    public static String requestCreated(
            User user,
            ServiceRequest request) {

        return """
                Dear %s,

                Your service request has been submitted successfully.

                -----------------------------------------
                Request Details
                -----------------------------------------
                Request ID   : %d
                Service Type : %s
                Brand        : %s
                Model        : %s
                Priority     : %s
                Status       : %s
                -----------------------------------------

                We will assign a technician shortly.

                Thank you,

                Computer Service Management System
                """
                .formatted(
                        user.getName(),
                        request.getRequestId(),
                        request.getServiceType(),
                        request.getBrandName(),
                        request.getModelNumber(),
                        request.getPriority(),
                        request.getStatus());
    }
    
    public static String adminNewRequest(
            User user,
            ServiceRequest request) {

        return """
                Dear Admin,

                A new service request has been submitted.

                -----------------------------------------
                Customer Name : %s
                Customer Email: %s

                Request ID    : %d
                Service Type  : %s
                Brand         : %s
                Model         : %s
                Priority      : %s
                -----------------------------------------

                Please login to CSMS and assign a technician.

                Regards,
                Computer Service Management System
                """
                .formatted(
                        user.getName(),
                        user.getEmail(),
                        request.getRequestId(),
                        request.getServiceType(),
                        request.getBrandName(),
                        request.getModelNumber(),
                        request.getPriority());
    }
    
    public static String technicianAssigned(
            User user,
            ServiceRequest request,
            Technician technician) {

        return """
                Dear %s,

                A technician has been assigned to your service request.

                -----------------------------------------
                Technician Details
                -----------------------------------------
                Name  : %s
                Phone : %s
                -----------------------------------------

                Request ID : %d

                Status : ASSIGNED

                Thank you,

                Computer Service Management System
                """
                .formatted(
                        user.getName(),
                        technician.getName(),
                        technician.getPhnumber(),
                        request.getRequestId());
    }

    public static String technicianNotification(
            Technician technician,
            ServiceRequest request) {

        return """
                Dear %s,

                A new service request has been assigned to you.

                -----------------------------------------
                Request ID : %d
                Service    : %s
                Brand      : %s
                Model      : %s
                Priority   : %s
                -----------------------------------------

                Please login to CSMS and update the request status.

                Thank you,

                Computer Service Management System
                """
                .formatted(
                        technician.getName(),
                        request.getRequestId(),
                        request.getServiceType(),
                        request.getBrandName(),
                        request.getModelNumber(),
                        request.getPriority());
    }

    public static String requestCompleted(
            User user,
            ServiceRequest request) {

        return """
                Dear %s,

                Great news!

                Your service request has been completed successfully.

                ------------------------------------
                Request ID : %d
                Service    : %s
                Brand      : %s
                Model      : %s
                Status     : COMPLETED
                ------------------------------------

                You may now collect your device or contact us for further assistance.

                Thank you for choosing CSMS.

                Regards,
                Computer Service Management System
                """
                .formatted(
                        user.getName(),
                        request.getRequestId(),
                        request.getServiceType(),
                        request.getBrandName(),
                        request.getModelNumber());
    }
    
    public static String requestCancelled(
            User user,
            ServiceRequest request) {

        return """
                Dear %s,

                Your service request has been cancelled successfully.

                ------------------------------------
                Request ID : %d
                Service    : %s
                Brand      : %s
                Model      : %s
                Status     : CANCELLED
                ------------------------------------

                If this was done by mistake, you can create a new service request anytime.

                Thank you for using Computer Service Management System.

                Regards,
                CSMS Team
                """
                .formatted(
                        user.getName(),
                        request.getRequestId(),
                        request.getServiceType(),
                        request.getBrandName(),
                        request.getModelNumber());
    }
    
    public static String forgotPasswordOtp(String otp) {

        return """
                Dear User,

                We received a request to reset your password.

                ======================================

                         PASSWORD RESET OTP

                             %s

                ======================================

                This OTP is valid for only 5 minutes.

                If you didn't request this password reset,
                simply ignore this email.

                Regards,
                CSMS Team
                """
                .formatted(otp);
    }
}