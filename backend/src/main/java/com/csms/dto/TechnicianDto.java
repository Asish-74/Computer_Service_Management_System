package com.csms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TechnicianDto {
	 	private Integer id;
	 	@NotBlank(message="Name is required")
	 	private String name;

	 	@NotBlank(message="Email is required")
	 	@Email(message="Enter valid email")
	 	private String email;

//	 	@NotBlank(message="Password is required")
	 	private String password;

	 	@NotBlank(message="Phone number is required")
	 	@Pattern(regexp="^[0-9]{10}$")
	 	private String phnumber;

	 	@NotBlank(message="Specialization is required")
	 	private String spec;
	    private int expe;
	    private String role;
	    private boolean available;
		public Integer getId() {
			return id;
		}
		public void setId(Integer id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getPhnumber() {
			return phnumber;
		}
		public void setPhnumber(String phnumber) {
			this.phnumber = phnumber;
		}
		public String getSpec() {
			return spec;
		}
		public void setSpec(String spec) {
			this.spec = spec;
		}
		public int getExpe() {
			return expe;
		}
		public void setExpe(int expe) {
			this.expe = expe;
		}
		public String getRole() {
			return role;
		}
		public void setRole(String role) {
			this.role = role;
		}
		public boolean isAvailable() {
			return available;
		}
		public void setAvailable(boolean available) {
			this.available = available;
		}
	    

}
