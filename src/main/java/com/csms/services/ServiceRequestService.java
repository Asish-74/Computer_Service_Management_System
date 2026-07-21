package com.csms.services;

import java.util.Optional;

import com.csms.dto.ServiceRequestDto;
import com.csms.entity.ServiceRequest;

public interface ServiceRequestService {
	Optional<ServiceRequest> save(ServiceRequestDto dto, String email);

	void deleteRequest(Integer requestId, String email);
}
