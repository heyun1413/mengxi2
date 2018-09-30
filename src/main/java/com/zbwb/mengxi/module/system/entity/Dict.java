package com.zbwb.mengxi.module.system.entity;

import com.zbwb.mengxi.common.DataDomain;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * @author sharpron
 * 字典类型
 */
@Entity
@Table(name = "sys_dict")
@DynamicInsert
@DynamicUpdate
@Model(title = "字典管理")
public class Dict extends DataDomain {


	private Type type;


	@Show(title = "类型")
	@ManyToOne
	@JoinColumn(name = "type_id")
	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	@Show(title = "名称")
    @Transient
    @Override
    public String getName() {
        return super.getName();
    }
}