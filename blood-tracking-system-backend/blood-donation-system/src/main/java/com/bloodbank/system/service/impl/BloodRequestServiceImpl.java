package com.bloodbank.system.service.impl;

import com.bloodbank.system.dto.BloodRequestDTO;
import com.bloodbank.system.dto.DonorDTO;
import com.bloodbank.system.entity.BloodRequest;
import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.enums.RequestStatus;
import com.bloodbank.system.repository.BloodRequestRepository;
import com.bloodbank.system.repository.DonorRepository;
import com.bloodbank.system.service.BloodRequestService;
import com.bloodbank.system.service.DonorService;
import com.bloodbank.system.repository.UserRepository;
import com.bloodbank.system.repository.HospitalRepository;
import com.bloodbank.system.entity.User;
import com.bloodbank.system.entity.Hospital;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository requestRepository;
    private final DonorRepository donorRepository;
    private final DonorService donorService;
    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;

    public BloodRequestServiceImpl(
            BloodRequestRepository requestRepository,
            DonorRepository donorRepository,
            DonorService donorService,
            UserRepository userRepository,
            HospitalRepository hospitalRepository) {

        this.requestRepository = requestRepository;
        this.donorRepository = donorRepository;
        this.donorService = donorService;
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
    }

    // ==================================================
    // GET ELIGIBLE DONORS (HOSPITAL)
    // ==================================================
    @Override
    public List<DonorDTO> getEligibleDonors(Long requestId) {

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found"));

        // 🔒 Request must be OPEN
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Blood request is not active");
        }

        List<Donor> donors =
                donorRepository.findByBloodGroupAndCityAndActiveTrue(
                        request.getBloodGroup(),
                        request.getCity()
                );

        List<DonorDTO> result = new ArrayList<>();
        for (Donor donor : donors) {
            if (donorService.isEligible(donor)) {
                result.add(donorService.mapToDTO(donor));
            }
        }

        return result;
    }

    // ==================================================
    // CREATE REQUEST (HOSPITAL)
    // ==================================================
    @Override
    public BloodRequest createRequest(BloodRequest request, String userIdStr) {

        Long userId = Long.parseLong(userIdStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hospital profile not found for user: " + userIdStr));

        request.setHospital(hospital);
        request.setStatus(RequestStatus.OPEN);
        request.setExpiryDate(LocalDate.now().plusDays(2));

        return requestRepository.save(request);
    }

    // ==================================================
    // GET ALL REQUESTS
    // ==================================================
    @Override
    public List<BloodRequestDTO> getAllRequests() {

        List<BloodRequestDTO> result = new ArrayList<>();

        for (BloodRequest br : requestRepository.findAll()) {
            BloodRequestDTO dto = new BloodRequestDTO();
            dto.setId(br.getId());
            dto.setBloodGroup(br.getBloodGroup());
            dto.setCity(br.getCity());
            dto.setUnitsRequired(br.getUnitsRequired());
            dto.setUrgencyLevel(br.getUrgencyLevel());
            dto.setStatus(br.getStatus());
            dto.setExpiryDate(br.getExpiryDate()); // ✅ IMPORTANT
            result.add(dto);
        }

        return result;
    }

    // ==================================================
    // AUTO-EXPIRE BLOOD REQUESTS
    // ==================================================
    @Override
    @Transactional

    public void expireOldRequests() {

        List<BloodRequest> requests =
                requestRepository.findByStatus(RequestStatus.OPEN);

        for (BloodRequest request : requests) {
            if (request.getExpiryDate().isBefore(LocalDate.now())) {
                request.setStatus(RequestStatus.EXPIRED);
            }
        }
    }

	@Override
	public void deleteRequest(Long id) {
		// TODO Auto-generated method stub
		requestRepository.deleteById(id);
	}
}
