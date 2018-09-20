package com.zbwb.mengxi.common.system.service;

import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.system.Permission;
import com.zbwb.mengxi.common.system.User;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

public interface PermissionService {


    Permission create(Permission permission);

    void deleteById(String permissionId);

}
