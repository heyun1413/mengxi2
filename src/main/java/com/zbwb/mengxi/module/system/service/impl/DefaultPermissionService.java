package com.zbwb.mengxi.module.system.service.impl;


import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.module.system.entity.Permission;
import com.zbwb.mengxi.module.system.service.PermissionService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.transaction.Transactional;

@Service
public class DefaultPermissionService implements PermissionService {


    @Resource
    private CommonDao commonDao;

    @Override
    @Transactional
    public Permission create(Permission permission) {
        commonDao.save(permission);
        return permission;
    }

    @Override
    @Transactional
    public void deleteById(String permissionId) {
        commonDao.session().createSQLQuery("DELETE FROM sys_permission WHERE id=?")
                .setParameter(0, permissionId)
                .executeUpdate();
    }
}
