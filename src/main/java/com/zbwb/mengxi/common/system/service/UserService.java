package com.zbwb.mengxi.common.system.service;

import com.zbwb.mengxi.common.system.User;


public interface UserService {

    User create(User user);

    void modifyPassword(Long userId, String newPassword);

    void associateRoles(String userId, String... roleIds);

    void disassociateRoles(String userId, String... roleIds);

    User findByUsername(String username);

}
