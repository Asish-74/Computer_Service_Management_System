package com.csms.dto;

public class UserDashboardDto {
	private long totalRequests;
    private long pendingRequests;
    private long assignedRequests;
    private long completedRequests;
	public long getTotalRequests() {
		return totalRequests;
	}
	public void setTotalRequests(long totalRequests) {
		this.totalRequests = totalRequests;
	}
	public long getPendingRequests() {
		return pendingRequests;
	}
	public void setPendingRequests(long pendingRequests) {
		this.pendingRequests = pendingRequests;
	}
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
    
}
