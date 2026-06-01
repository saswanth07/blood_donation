package com.bloodbank.system.dto;

import java.time.LocalDate;

import com.bloodbank.system.enums.RequestStatus;
import com.bloodbank.system.enums.UrgencyLevel;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BloodRequestDTO {
	
	private Long id;
	
	 @NotBlank(message = "Blood group is required")
    private String bloodGroup;
	 
	@NotBlank(message = "City is required")
    private String city;
	
	 @NotNull(message = "Units required is mandatory")
	    @Min(value = 1, message = "Units must be at least 1")
    private int unitsRequired;
	 
	@NotBlank(message = "Urgency level is required")
    private UrgencyLevel urgencyLevel;
    private RequestStatus status;
    private LocalDate expiryDate;

    public BloodRequestDTO() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public int getUnitsRequired() {
		return unitsRequired;
	}

	public void setUnitsRequired(int unitsRequired) {
		this.unitsRequired = unitsRequired;
	}

	public UrgencyLevel getUrgencyLevel() {
		return urgencyLevel;
	}

	public void setUrgencyLevel(UrgencyLevel urgencyLevel) {
		this.urgencyLevel = urgencyLevel;
	}

	public RequestStatus getStatus() {
		return status;
	}

	public void setStatus(RequestStatus status) {
		this.status = status;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

    
    
}
