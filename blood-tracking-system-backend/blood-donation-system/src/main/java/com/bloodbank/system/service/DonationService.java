package com.bloodbank.system.service;

import com.bloodbank.system.dto.DonationDTO;
import com.bloodbank.system.dto.DonationStatusDTO;

import java.util.List;

public interface DonationService {

	DonationDTO donorRespondToRequest(Long requestId, boolean accept);

	DonationDTO hospitalDecision(Long donationId, boolean accept);

	List<DonationDTO> getMyDonations();

	DonationStatusDTO getDonationStatistics();

	long getTotalDonationsByDonor(Long donorId);

	List<DonationDTO> getPendingDonationsForHospital();
	

   
}
