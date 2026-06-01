package com.bloodbank.system.service.impl;


import com.bloodbank.system.dto.DonorDTO;
import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.entity.User;
import com.bloodbank.system.enums.HealthStatus;
import com.bloodbank.system.repository.DonorRepository;
import com.bloodbank.system.repository.DonationRepository;
import com.bloodbank.system.repository.UserRepository;
import com.bloodbank.system.service.DonorService;

import jakarta.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class DonorServiceImpl implements DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    
    private static final int MIN_DONATION_GAP_DAYS = 90;


    public DonorServiceImpl(DonorRepository donorRepository,UserRepository userRepository, DonationRepository donationRepository) {
        this.donorRepository = donorRepository;
        this.userRepository=userRepository;
        this.donationRepository = donationRepository;
       
    }

    @Override
    public List<DonorDTO> getAllDonors() {

    	List<DonorDTO> result = new ArrayList<>();

        for (Donor donor : donorRepository.findAll()) {
            result.add(mapToDTO(donor));
        }
        return result;
    }

    @Override
    public DonorDTO getDonorById(Long id) {

        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        return mapToDTO(donor);
    }

    // PRIVATE MAPPER METHOD
    public DonorDTO mapToDTO(Donor donor) {

        DonorDTO dto = new DonorDTO();
        dto.setUserId(donor.getId());
        dto.setFullName(donor.getFullName());
        dto.setBloodGroup(donor.getBloodGroup());
        dto.setCity(donor.getCity());
        dto.setAddress(donor.getAddress());
        dto.setPhone(donor.getPhone());
        dto.setLastDonationDate(donor.getLastDonationDate());
        dto.setHealthStatus(donor.getHealthStatus());
        dto.setEligible(isEligible(donor));
        dto.setNextEligibleDate(nextEligibleDate(donor));
        dto.setTotalDonations(donationRepository.countByDonorId(donor.getId()));

        return dto;
    }

    //  BUSINESS LOGIC
    @Override
    public boolean isEligible(Donor donor) {

        if(donor.getLastDonationDate()==null) {
        	return true;
        }
        Long daysSinceLastDonation = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
        return daysSinceLastDonation >= MIN_DONATION_GAP_DAYS;
    }
    
    @Override
    public LocalDate nextEligibleDate(Donor donor) {
    	if(donor.getLastDonationDate() == null) {
    		return LocalDate.now();
    	}
    	return donor.getLastDonationDate()
    			.plusDays(MIN_DONATION_GAP_DAYS);
    }
    
    //create a donor
    @Override
    public DonorDTO createDonor(DonorDTO dto) {

        // Validate userId
        if (dto.getUserId() == null) {
            throw new RuntimeException("userId is mandatory");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = new Donor();
        donor.setFullName(dto.getFullName());
        donor.setBloodGroup(dto.getBloodGroup());
        donor.setCity(dto.getCity());
        donor.setAddress(dto.getAddress());
        donor.setPhone(dto.getPhone());
        donor.setHealthStatus(dto.getHealthStatus());
        donor.setActive(true);
        donor.setUser(user);

        Donor saved = donorRepository.save(donor);

        // response DTO
        return mapToDTO(saved);
    }
    
    
    @Override
    public Donor getLoggedInDonor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = Long.parseLong(authentication.getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return donorRepository.findByUser(user)
                .orElseThrow(() -> new com.bloodbank.system.exception.UserNotDonorException("Donor profile not found for current user"));
    }
    
    @Override
    public void updateDonorProfile(Map<String, Object> updates) {
        // 1. Get the current logged-in donor
        Donor donor = getLoggedInDonor(); 

        // 2. Update simple String fields if they exist in the request
        if (updates.containsKey("fullName")) {
            donor.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("phone")) {
            donor.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("city")) {
            donor.setCity((String) updates.get("city"));
        }
        if (updates.containsKey("address")) {
            donor.setAddress((String) updates.get("address"));
        }
        if (updates.containsKey("bloodGroup")) {
            donor.setBloodGroup((String) updates.get("bloodGroup"));
        }

        // 3. Update HealthStatus (Convert String -> Enum)
        if (updates.containsKey("healthStatus")) {
            String statusStr = (String) updates.get("healthStatus");
            if (statusStr != null && !statusStr.trim().isEmpty()) {
                try {
                    // Converts "Good" -> HealthStatus.GOOD (Case insensitive)
                    donor.setHealthStatus(HealthStatus.valueOf(statusStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Fallback: If invalid status, maybe set to GOOD or ignore
                    System.out.println("Invalid health status provided: " + statusStr);
                }
            }
        }

        // 4. Update Date (Convert String -> LocalDate)
        if (updates.containsKey("lastDonationDate")) {
            String dateStr = (String) updates.get("lastDonationDate");
            if (dateStr != null && !dateStr.trim().isEmpty()) {
                donor.setLastDonationDate(LocalDate.parse(dateStr));
            } else {
                // If user sends empty string, they might want to clear the date
                donor.setLastDonationDate(null);
            }
        }

        // 5. Save changes to Database
        donorRepository.save(donor);
    }
}