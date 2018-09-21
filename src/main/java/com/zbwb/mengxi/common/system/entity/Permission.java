package com.zbwb.mengxi.common.system.entity;


import com.google.common.collect.Sets;
import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.domain.ModelBean;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sys_permission")
@Model(title = "权限管理")
public class Permission extends BaseEntity {


    private String description;

    public Permission() {
    }

    public Permission(String name, String description) {
        setName(name);
        this.description = description;
    }

    private Set<Role> roles = new HashSet<>();

    @Column(unique = true)
    @Show(name = "权限标识")
    @Transient
    public String getName() {
        return super.getName();
    }


    @Show(name = "权限描述")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    @ManyToMany(mappedBy = "permissions")
    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }


    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;

        Permission that = (Permission) object;

        return getId() != null ? getId().equals(that.getId()) : that.getId() == null;
    }

    @Override
    public int hashCode() {
        return getId() != null ? getId().hashCode() : 0;
    }

    public static Set<Permission> commonPermissionsOf(ModelBean modelBean) {
        String name = modelBean.getType().getName();
        return Sets.newHashSet(
                new Permission(String.format("%s:%s", name, "list"),
                        modelBean.getModel().title()+"列表"),
                new Permission(String.format("%s:%s", name, "add"),
                        modelBean.getModel().title()+"新增"),
                new Permission(String.format("%s:%s", name, "delete"),
                        modelBean.getModel().title()+"删除"),
                new Permission(String.format("%s:%s", name, "edit"),
                        modelBean.getModel().title()+"修改")
        );
    }

    public static String getPermissionName(ModelBean modelBean, String operation) {
        return String.format("%s:%s", modelBean.getType().getName(), operation);
    }
}
