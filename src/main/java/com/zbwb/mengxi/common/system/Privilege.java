package com.zbwb.mengxi.common.system;


import javax.persistence.*;

@Entity
@Table(name = "sys_privilege")
public class Privilege {


    private Integer id;

    private Role role;

    @Id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @ManyToOne
    @JoinColumn(name = "role_id")
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
