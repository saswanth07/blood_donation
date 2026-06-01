package com.bloodbank.system.service;

import com.bloodbank.system.entity.Hospital;

import java.util.List;

public interface HospitalService {

    Hospital create(Hospital hospital);

    Hospital getById(Long id);

    List<Hospital> getAll();

    Hospital update(Long id, Hospital hospital);

    void delete(Long id);
}
