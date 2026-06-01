package com.bloodbank.system.dto;

import java.util.Map;

public class DonationStatusDTO {
    private long totalDonations;
    private Map<String, Long> donationsByStatus;
    private Map<String, Long> donationsByBloodGroup;
	public long getTotalDonations() {
		return totalDonations;
	}
	public void setTotalDonations(long totalDonations) {
		this.totalDonations = totalDonations;
	}
	public Map<String, Long> getDonationsByStatus() {
		return donationsByStatus;
	}
	public void setDonationsByStatus(Map<String, Long> donationsByStatus) {
		this.donationsByStatus = donationsByStatus;
	}
	public Map<String, Long> getDonationsByBloodGroup() {
		return donationsByBloodGroup;
	}
	public void setDonationsByBloodGroup(Map<String, Long> donationsByBloodGroup) {
		this.donationsByBloodGroup = donationsByBloodGroup;
	}
    
}
