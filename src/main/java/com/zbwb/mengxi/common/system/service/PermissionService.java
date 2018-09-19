package com.zbwb.mengxi.common.system.service;

import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.system.Permission;
import com.zbwb.mengxi.common.system.User;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PermissionService {

    private final CommonDao commonDao;


    @Autowired
    public PermissionService(CommonDao commonDao) {
        this.commonDao = commonDao;
    }

    @Transactional
    public void saveIfNotExist(String permissionName) {
        final Object dbPermission = commonDao.session()
                .createCriteria(Permission.class)
                .add(Restrictions.eq("name", permissionName))
                .uniqueResult();
        if (dbPermission != null) return;
        final Permission permission = new Permission();
        permission.setName(permissionName);
        commonDao.save(permission);
    }


}
