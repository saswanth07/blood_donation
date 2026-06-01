package com.bloodbank.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
public class BloodDonationSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(BloodDonationSystemApplication.class, args);
	}

}
