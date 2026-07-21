package com.csms.exception;

public class ResourceNotFoundException extends RuntimeException {
	public ResourceNotFoundException(String mssg) {
		super(mssg);
	}
}
