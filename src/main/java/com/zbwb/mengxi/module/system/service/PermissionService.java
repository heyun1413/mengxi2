package com.zbwb.mengxi.module.system.service;

import com.zbwb.mengxi.module.system.entity.Permission;

public interface PermissionService {


    Permission create(Permission permission);

    void deleteById(String permissionId);

}
