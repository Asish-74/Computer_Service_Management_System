package com.csms.dto;

import jakarta.validation.constraints.NotNull;

public class AssignTechnicianDto {
	@NotNull(message = "Request Id is required")
	private Integer requestId;

	@NotNull(message = "Technician Id is required")
	private Integer technicianId;
	public Integer getRequestId() {
		return requestId;
	}
	public void setRequestId(Integer requestId) {
		this.requestId = requestId;
	}
	public Integer getTechnicianId() {
		return technicianId;
	}
	public void setTechnicianId(Integer technicianId) {
		this.technicianId = technicianId;
	}
    
}
