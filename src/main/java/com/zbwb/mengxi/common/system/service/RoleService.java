package com.zbwb.mengxi.common.system.service;

import com.zbwb.mengxi.common.system.entity.Role;

/**
 * @author ron
 */
public interface RoleService {

    /**
     * 创建角色
     * @param role
     */
    void createRole(Role role);

    /**
     * 删除校色
     * @param roleId 角色Id
     */
    void deleteRole(String roleId);

    /**
     * 为角色关联权限
     * @param roleId 角色id
     * @param permissionIds 多个权限id
     */
    void associatePermissions(String roleId, String ... permissionIds);

    /**
     * 解除角色关联权限
     * @param roleId 角色id
     * @param permissionIds 多个权限id
     */
    void disassociatePermissions(String roleId, String ... permissionIds);


}
