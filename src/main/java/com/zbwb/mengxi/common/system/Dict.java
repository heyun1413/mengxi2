package com.zbwb.mengxi.common.system;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "sys_dict")
@DynamicInsert
@DynamicUpdate
public class Dict extends DataDomain {


	private Type type;


	@ManyToOne
	@JoinColumn(name = "type_id")
	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}
}