package com.csms.dto;

public class AdminDashboardDto {
	 private long totalUsers;
	    private long totalTechnicians;
	    private long pendingRequests;
	    private long assignedRequests;
	    private long completedRequests;

	    public long getTotalUsers() {
	        return totalUsers;
	    }

	    public void setTotalUsers(long totalUsers) {
	        this.totalUsers = totalUsers;
	    }

	    public long getTotalTechnicians() {
	        return totalTechnicians;
	    }

	    public void setTotalTechnicians(long totalTechnicians) {
	        this.totalTechnicians = totalTechnicians;
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
