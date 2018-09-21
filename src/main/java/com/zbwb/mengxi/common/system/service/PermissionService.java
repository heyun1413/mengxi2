package com.zbwb.mengxi.common.system.service;

import com.zbwb.mengxi.common.system.entity.Permission;

public interface PermissionService {


    Permission create(Permission permission);

    void deleteById(String permissionId);

}
