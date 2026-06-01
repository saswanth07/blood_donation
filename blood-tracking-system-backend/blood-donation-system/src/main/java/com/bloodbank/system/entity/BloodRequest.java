package com.bloodbank.system.entity;

import java.time.LocalDate;

import com.bloodbank.system.enums.RequestStatus;
import com.bloodbank.system.enums.UrgencyLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class BloodRequest {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hospital hospital;

    private String bloodGroup;
    private String city;
    private int unitsRequired;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgencyLevel;

    @Enumerated(EnumType.STRING)
    @Column(length = 50,nullable = false)
    private RequestStatus status;
    
    private LocalDate expiryDate;


    public BloodRequest() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
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
