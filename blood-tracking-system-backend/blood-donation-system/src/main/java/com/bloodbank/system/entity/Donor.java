package com.bloodbank.system.entity;

import java.time.LocalDate;

import com.bloodbank.system.enums.HealthStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Size;

@Entity
public class Donor {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
    private User user;

    private String fullName;
    private String bloodGroup;
    private String city;
    private String address;
    @Size(min =  10,max=10)
    private String phone;

    @Column(name = "last_donation_date", nullable = true)
    private LocalDate lastDonationDate;
    
    
    @Enumerated(EnumType.STRING)
    private HealthStatus healthStatus;

    private boolean active = true;

    public Donor() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

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

	public void setHealthStatus(HealthStatus healthStatus2) {
		this.healthStatus = healthStatus2;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
    
    
    
}
