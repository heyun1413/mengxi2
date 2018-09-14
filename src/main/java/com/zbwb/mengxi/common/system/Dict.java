package com.zbwb.mengxi.common.system;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "sys_dict")
@DynamicInsert
@DynamicUpdate
public class Dict extends DataDomain {

	private static final long serialVersionUID = 1L;
    private String value;	// 键名
	private String label;	// 键值(标签)
	private String type;	// 业务类型
	private String description;// 描述
	private Integer sort;	// 排序
	private String parentId;//父Id
	private Integer dictType;//0.系统字典 1.用户字典  默认为系统字典；列表只显示用户字典//TODO

	public Dict() {
		super();
	}
	
	public Dict(String value, String label,String type){
		this.value = value;
		this.label = label;
		this.type=type;
	}
	
	public Dict(String value, String label){
		this.value = value;
		this.label = label;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	//@NotNull
	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	
	public Integer getDictType() {
		return dictType;
	}

	public void setDictType(Integer dictType) {
		this.dictType = dictType;
	}

	@Override
	public String toString() {
		return label;
	}
}