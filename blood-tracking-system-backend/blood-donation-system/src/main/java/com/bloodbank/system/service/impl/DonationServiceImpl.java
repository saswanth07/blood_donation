package com.bloodbank.system.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.bloodbank.system.dto.DonationDTO;
import com.bloodbank.system.dto.DonationStatusDTO;
import com.bloodbank.system.entity.BloodRequest;
import com.bloodbank.system.entity.Donation;
import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.enums.DonationStatus;
import com.bloodbank.system.enums.RequestStatus;
import com.bloodbank.system.repository.BloodRequestRepository;
import com.bloodbank.system.repository.DonationRepository;
import com.bloodbank.system.repository.DonorRepository;
import com.bloodbank.system.service.DonationService;
import com.bloodbank.system.service.DonorService;

import jakarta.transaction.Transactional;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final DonorService donorService;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public DonationServiceImpl(
            DonationRepository donationRepository,
            DonorService donorService,
            DonorRepository donorRepository,
            BloodRequestRepository bloodRequestRepository) {

        this.donationRepository = donationRepository;
        this.donorService = donorService;
        this.donorRepository = donorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    // ==================================================
    // DONOR RESPONDS TO BLOOD REQUEST
    // ==================================================
    @Override
    @Transactional
    public DonationDTO donorRespondToRequest(Long requestId, boolean accept) {

        Donor donor = donorService.getLoggedInDonor();

        // 1️⃣ Eligibility check
        if (!donorService.isEligible(donor)) {
            throw new RuntimeException(
                    "Donor not eligible until " +
                    donorService.nextEligibleDate(donor)
            );
        }

        // 2️⃣ Fetch request
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found"));

        // 3️⃣ Request must be OPEN
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Blood request is not open");
        }

        // 4️⃣ Prevent duplicate response
        if (donationRepository.existsByDonorAndBloodRequest(donor, request)) {
            throw new RuntimeException("You have already responded to this request");
        }

        // 5️⃣ Create donation
        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setBloodRequest(request);
        donation.setStatus(
                accept ? DonationStatus.DONOR_ACCEPTED
                       : DonationStatus.DONOR_DECLINED
        );

        Donation saved = donationRepository.save(donation);
        return mapToDTO(saved);
    }

    // ==================================================
    // HOSPITAL DECISION
    // ==================================================
    @Override
    @Transactional
    public DonationDTO hospitalDecision(Long donationId, boolean accept) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        // 1️⃣ Only donor-accepted donations allowed
        if (donation.getStatus() != DonationStatus.DONOR_ACCEPTED) {
            throw new RuntimeException("Donation is not awaiting hospital approval");
        }

        // 2️⃣ Request must still be OPEN
        if (donation.getBloodRequest().getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Blood request is no longer active");
        }

        donation.setStatus(
                accept ? DonationStatus.APPROVED
                       : DonationStatus.REJECTED
        );

        Donation saved = donationRepository.save(donation);

        // 3️⃣ Update donor eligibility on approval
        if (accept) {
            Donor donor = saved.getDonor();
            donor.setLastDonationDate(LocalDate.now());
            donorRepository.save(donor);
            
            // ✅ Close the request as it is now fulfilled
            BloodRequest request = saved.getBloodRequest();
            request.setStatus(RequestStatus.COMPLETED);
            bloodRequestRepository.save(request);
        }

        return mapToDTO(saved);
    }

    // ==================================================
    // DONOR DONATION HISTORY
    // ==================================================
    @Override
    public List<DonationDTO> getMyDonations() {

        Donor donor = donorService.getLoggedInDonor();
        List<Donation> donations = donationRepository.findByDonor(donor);

        List<DonationDTO> result = new ArrayList<>();
        for (Donation d : donations) {
            result.add(mapToDTO(d));
        }
        return result;
    }

    // ==================================================
    // DONATION STATISTICS (HOSPITAL)
    // ==================================================
    @Override
    public DonationStatusDTO getDonationStatistics() {

        DonationStatusDTO stats = new DonationStatusDTO();
        stats.setTotalDonations(donationRepository.count());

        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : donationRepository.countByStatus()) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.setDonationsByStatus(statusMap);

        Map<String, Long> bloodGroupMap = new HashMap<>();
        for (Object[] row : donationRepository.countByBloodGroup()) {
            bloodGroupMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.setDonationsByBloodGroup(bloodGroupMap);

        return stats;
    }

    @Override
    public long getTotalDonationsByDonor(Long donorId) {
        return donationRepository.countByDonorId(donorId);
    }

    // ==================================================
    // HOSPITAL PENDING DONATIONS
    // ==================================================
    @Override
    public List<DonationDTO> getPendingDonationsForHospital() {
        // Fetch all donations with DONOR_ACCEPTED status (awaiting hospital approval)
        List<Donation> pendingDonations = donationRepository.findByStatus(DonationStatus.DONOR_ACCEPTED);
        
        List<DonationDTO> result = new ArrayList<>();
        for (Donation d : pendingDonations) {
            result.add(mapToDTO(d));
        }
        return result;
    }

    // ==================================================
    // HELPER
    // ==================================================
    private DonationDTO mapToDTO(Donation donation) {
        DonationDTO dto = new DonationDTO();
        dto.setId(donation.getId());
        dto.setDonorId(donation.getDonor().getId());
        dto.setRequestId(donation.getBloodRequest().getId());
        dto.setStatus(donation.getStatus());
        return dto;
    }

}
