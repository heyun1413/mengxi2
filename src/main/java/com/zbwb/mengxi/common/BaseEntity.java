package com.zbwb.mengxi.common;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

/**
 * @author sharpron
 * 顶层
 */
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    /**
     * 主键
     */
    private String id;
    /**
     * 名称
     */
    private String name;
    /**
     * 备注信息
     */
    private String remark;
    /**
     * 创建日期
     */
    private Date createDate;
    /**
     * 修改日期
     */
    private Date updateDate;

    /**
     * 保存之前
     */
    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
        this.updateDate = new Date();
        this.createDate = this.updateDate;
    }

    /**
     * 更新之前
     */
    @PreUpdate
    public void preUpdate() {
        this.updateDate = new Date();
    }

    @Id
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BaseEntity that = (BaseEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "BaseEntity{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
