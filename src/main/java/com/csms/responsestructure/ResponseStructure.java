package com.csms.responsestructure;

import java.time.LocalDate;

public class ResponseStructure<T> {
	private int statuscode;
	private String msg;
	private T data;
	private LocalDate timedate;
	public int getStatuscode() {
		return statuscode;
	}
	public void setStatuscode(int statuscode) {
		this.statuscode = statuscode;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	public LocalDate getTimedate() {
		return timedate;
	}
	public void setTimedate(LocalDate timedate) {
		this.timedate = timedate;
	}
	
}
