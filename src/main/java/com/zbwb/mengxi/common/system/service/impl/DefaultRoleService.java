package com.zbwb.mengxi.common.system.service.impl;

import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.system.Role;
import com.zbwb.mengxi.common.system.service.RoleService;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class DefaultRoleService implements RoleService {

    @Resource
    private CommonDao commonDao;

    @Override
    public void createRole(Role role) {
        commonDao.save(role);
    }

    @Override
    public void deleteRole(String roleId) {
        commonDao.session().createSQLQuery("DELETE FROM sys_role WHERE id=?")
            .setParameter(0, roleId)
                .executeUpdate();
    }

    @Override
    public void associatePermissions(String roleId, String... permissionIds) {
        SQLQuery sqlQuery = commonDao.session().createSQLQuery("INSERT INTO sys_role_permission VALUES(?, ?) ");
        executeBatchUpdate(sqlQuery, roleId, permissionIds);
    }

    private void executeBatchUpdate(SQLQuery query, String roleId, String... permissionIds) {
        for (String permissionId : permissionIds) {
            query.setParameter(0, roleId)
                    .setParameter(1, permissionId)
                    .executeUpdate();
        }
    }

    @Override
    public void disassociatePermissions(String roleId, String... permissionIds) {
        SQLQuery sqlQuery = commonDao.session().createSQLQuery("delete FROM sys_user_role WHERE user_id=? and role_id=?");
        executeBatchUpdate(sqlQuery, roleId, permissionIds);
    }


}
