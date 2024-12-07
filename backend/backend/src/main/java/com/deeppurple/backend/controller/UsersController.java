package com.deeppurple.backend.controller;

import com.deeppurple.backend.entity.Users;
import com.deeppurple.backend.service.UsersService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    public Users registerUser(@RequestBody Users user) {
        return usersService.registerUser(user);
    }

    @PostMapping("/login")
    public Users loginUser(@RequestBody LoginRequest loginRequest) {
        return usersService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
    }

}
@Getter
@Setter
class LoginRequest {
    private String username;
    private String password;

}
