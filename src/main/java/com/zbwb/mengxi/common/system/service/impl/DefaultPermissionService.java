package com.zbwb.mengxi.common.system.service.impl;


import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.system.Permission;
import com.zbwb.mengxi.common.system.service.PermissionService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class DefaultPermissionService implements PermissionService {


    @Resource
    private CommonDao commonDao;

    @Override
    public Permission create(Permission permission) {
        commonDao.save(permission);
        return permission;
    }

    @Override
    public void deleteById(String permissionId) {
        commonDao.session().createSQLQuery("DELETE FROM sys_permission WHERE id=?")
                .setParameter(0, permissionId)
                .executeUpdate();
    }
}
