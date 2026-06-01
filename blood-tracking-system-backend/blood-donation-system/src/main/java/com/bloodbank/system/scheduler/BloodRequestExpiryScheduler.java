package com.bloodbank.system.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.bloodbank.system.service.BloodRequestService;

@Component
public class BloodRequestExpiryScheduler {

    private final BloodRequestService bloodRequestService;

    public BloodRequestExpiryScheduler(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    // Runs every hour
    @Scheduled(cron = "0 0 * * * *")
    public void autoExpireRequests() {
        bloodRequestService.expireOldRequests();
    }
}
