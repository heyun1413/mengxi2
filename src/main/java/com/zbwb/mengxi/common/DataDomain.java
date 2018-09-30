package com.zbwb.mengxi.common;

import com.zbwb.mengxi.module.system.entity.User;
import org.apache.shiro.SecurityUtils;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class DataDomain extends BaseEntity {

	private User createBy; // 创建者
	private User updateBy; // 更新者


	@Override
	public void prePersist() {
		super.prePersist();
		this.createBy = (User) SecurityUtils.getSubject().getPrincipal();
	}

	@Override
	public void preUpdate() {
		super.preUpdate();
		this.updateBy = (User) SecurityUtils.getSubject().getPrincipal();
	}

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