package com.bloodbank.system.service;

import com.bloodbank.system.dto.BloodRequestDTO;
import com.bloodbank.system.dto.DonorDTO;
import com.bloodbank.system.entity.BloodRequest;

import java.util.List;

public interface BloodRequestService {

	BloodRequest createRequest(BloodRequest request, String userIdStr);

    List<BloodRequestDTO> getAllRequests();

    List<DonorDTO> getEligibleDonors(Long requestId);

	void expireOldRequests();

	void deleteRequest(Long id);
}
