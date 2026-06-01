package com.bloodbank.system.entity;

import com.bloodbank.system.enums.DonationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Donation {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne
	    private Donor donor;

	    @ManyToOne
	    private BloodRequest bloodRequest;

	    @Enumerated(EnumType.STRING)
	    @Column(length = 30,nullable=false)
	    private DonationStatus status;

	    public Donation() {}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Donor getDonor() {
			return donor;
		}

		public void setDonor(Donor donor) {
			this.donor = donor;
		}

		public BloodRequest getBloodRequest() {
			return bloodRequest;
		}

		public void setBloodRequest(BloodRequest bloodRequest) {
			this.bloodRequest = bloodRequest;
		}

		public DonationStatus getStatus() {
			return status;
		}

		public void setStatus(DonationStatus status) {
			this.status = status;
		}
	    
	    
	    
}
