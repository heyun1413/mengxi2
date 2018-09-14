package com.zbwb.mengxi.common.system;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "sys_role")
public class Role implements Serializable {

    private static final Integer MANAGER = 1;

    private Integer id;
    private User user;

    private List<Privilege> privileges;

    @OneToMany(mappedBy = "role")
    public List<Privilege> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(List<Privilege> privileges) {
        this.privileges = privileges;
    }

    @Id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Transient
    public final boolean isManager() {
        return id.equals(MANAGER);
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
