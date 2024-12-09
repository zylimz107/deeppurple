package com.deeppurple.backend.service;

import com.deeppurple.backend.entity.Users;
import com.deeppurple.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    public Users createUser(Users user) {
        return usersRepository.save(user);
    }

    public Users loginUser(String username, String password) {
        Users user = usersRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect username or password");
        }
        return user;
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

}
