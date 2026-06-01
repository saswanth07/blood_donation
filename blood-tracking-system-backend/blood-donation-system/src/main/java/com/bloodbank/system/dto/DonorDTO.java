package com.bloodbank.system.dto;

import java.time.LocalDate;

import com.bloodbank.system.enums.HealthStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class DonorDTO {

	@JsonProperty("userId")
	private Long userId;
	
	
	 @NotBlank(message = "Full name is required")
    private String fullName;
	 
	  @NotBlank(message = "Blood group is required")
    private String bloodGroup;
	  
	  @NotBlank(message = "City is required")
    private String city;

    private String address;
	  

	    @Pattern(
	        regexp = "^[6-9]\\d{9}$",
	        message = "Phone number must be valid"
	    )
    private String phone;
    private LocalDate lastDonationDate;
    private HealthStatus healthStatus;
    private boolean eligible;
    private LocalDate nextEligibleDate;
    private Long totalDonations;

    public DonorDTO() {}

    
	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getBloodGroup() {
		return bloodGroup;
	}

	public void setBloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public LocalDate getLastDonationDate() {
		return lastDonationDate;
	}

	public void setLastDonationDate(LocalDate lastDonationDate) {
		this.lastDonationDate = lastDonationDate;
	}

	public HealthStatus getHealthStatus() {
		return healthStatus;
	}

	public void setHealthStatus(HealthStatus healthStatus) {
		this.healthStatus = healthStatus;
	}

	public boolean isEligible() {
		return eligible;
	}

	public void setEligible(boolean eligible) {
		this.eligible = eligible;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userid) {
		this.userId = userid;
	}

    public LocalDate getNextEligibleDate() {
        return nextEligibleDate;
    }

    public void setNextEligibleDate(LocalDate nextEligibleDate) {
        this.nextEligibleDate = nextEligibleDate;
    }

    public Long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(Long totalDonations) {
        this.totalDonations = totalDonations;
    }
    
    
}
