package com.bloodbank.system.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.system.dto.DonationDTO;
import com.bloodbank.system.dto.DonationStatusDTO;
import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.service.DonationService;
import com.bloodbank.system.service.DonorService;



@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;
    private final DonorService donorService;

    public DonationController(DonationService donationService, DonorService donorService) {
        this.donationService = donationService;
        this.donorService = donorService;
    }

    @PreAuthorize("hasRole('DONOR')")
    @PostMapping("/requests/{requestId}/respond")
    public DonationDTO donorRespond(
            @PathVariable Long requestId,
            @RequestParam boolean accept) {

        return donationService.donorRespondToRequest(requestId, accept);
    }

    
    @PreAuthorize("hasRole('HOSPITAL')")
    @PostMapping("/{donationId}/decision")
    public DonationDTO hospitalDecision(
            @PathVariable Long donationId,
            @RequestParam boolean accept) {

        return donationService.hospitalDecision(donationId, accept);
    }


    @PreAuthorize("hasRole('DONOR')")
    @GetMapping("/my")
    public List<DonationDTO> myDonations() {
        return donationService.getMyDonations();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public DonationStatusDTO getStats() {
        return donationService.getDonationStatistics();
    }
    
    @GetMapping("/my/count")
    @PreAuthorize("hasRole('DONOR')")
    public long myDonationCount() {
        Donor donor = donorService.getLoggedInDonor();
        return donationService.getTotalDonationsByDonor(donor.getId());
    }

        @PreAuthorize("hasRole('HOSPITAL')")
    @GetMapping("/hospital/pending")
    public List<DonationDTO> getHospitalPendingDonations() {
        // It return all donations with status 'DONOR_ACCEPTED' or 'PENDING'
        return donationService.getPendingDonationsForHospital(); 
    }


}
