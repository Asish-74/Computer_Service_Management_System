package com.csms.dto;

import java.time.LocalDateTime;

public class TechnicianDashboardDto {
	 private long assignedRequests;
	 private long completedRequests;
	 private LocalDateTime lastCompletedAt;
	 
	 public long getAssignedRequests() {
		 return assignedRequests;
	 }
	 public void setAssignedRequests(long assignedRequests) {
		 this.assignedRequests = assignedRequests;
	 }
	 public long getCompletedRequests() {
		 return completedRequests;
	 }
	 public void setCompletedRequests(long completedRequests) {
		 this.completedRequests = completedRequests;
	 }
	 public LocalDateTime getLastCompletedAt() {
		 return lastCompletedAt;
	 }
	 public void setLastCompletedAt(LocalDateTime lastCompletedAt) {
		 this.lastCompletedAt = lastCompletedAt;
	 }
	 
	 
}
