package com.zbwb.mengxi.common;

import com.zbwb.mengxi.module.system.entity.User;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class DataDomain extends BaseEntity {

	private User createBy; // 创建者
	private User updateBy; // 更新者


    @ManyToOne
	public User getCreateBy() {
		return createBy;
	}

	public void setCreateBy(User createBy) {
		this.createBy = createBy;
	}

    @ManyToOne
	public User getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(User updateBy) {
		this.updateBy = updateBy;
	}
}