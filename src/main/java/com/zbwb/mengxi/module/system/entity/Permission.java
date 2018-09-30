package com.zbwb.mengxi.module.system.entity;


import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * @author sharpron
 */
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

    @Override
    @Column(unique = true)
    @Show(title = "权限标识")
    @Transient
    public String getName() {
        return super.getName();
    }


    @Show(title = "权限描述")
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


}
