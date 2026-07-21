package com.csms.email;

public interface EmailService {
	void sendEmail(
            String to,
            String subject,
            String body);
}
