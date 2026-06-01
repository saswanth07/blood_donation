package com.bloodbank.system.dto;

import com.bloodbank.system.enums.DonationStatus;

public class DonationDTO {
	
	private Long id;
    private Long donorId;
    private Long requestId;
    private DonationStatus status;

    public DonationDTO() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getDonorId() {
		return donorId;
	}

	public void setDonorId(Long donorId) {
		this.donorId = donorId;
	}

	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	public DonationStatus getStatus() {
		return status;
	}

	public void setStatus(DonationStatus status) {
		this.status = status;
	}
    
}
