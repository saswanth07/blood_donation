package com.bloodbank.system.service;

import com.bloodbank.system.entity.User;

import java.util.List;

public interface UserService {

    User create(User user);

    User getById(Long id);

    List<User> getAll();

    void delete(Long id);
}
