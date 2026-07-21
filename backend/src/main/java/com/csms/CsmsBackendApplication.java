package com.csms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CsmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CsmsBackendApplication.class, args);
		
		
	}

}

/*
✅ User Register
✅ User Login
✅ Admin Login
✅ Technician Register
✅ Technician Login
✅ Create Service Request

⬜ Admin View All Requests
⬜ Admin Assign Technician
⬜ Technician View Assigned Requests
⬜ Technician Update Status
⬜ User View My Requests
⬜ User Profile
⬜ Admin Dashboard Statistics
⬜ React Integration
  */