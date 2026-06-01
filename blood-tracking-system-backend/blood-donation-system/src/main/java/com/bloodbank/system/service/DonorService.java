package com.bloodbank.system.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.bloodbank.system.dto.DonorDTO;
import com.bloodbank.system.entity.Donor;

public interface DonorService {

    DonorDTO createDonor(DonorDTO dto);

    List<DonorDTO> getAllDonors();

    DonorDTO getDonorById(Long id);

    boolean isEligible(Donor donor);

	LocalDate nextEligibleDate(Donor donor);

	DonorDTO mapToDTO(Donor donor);
	
    Donor getLoggedInDonor();
    
    void updateDonorProfile(Map<String, Object> updates);
    


}
