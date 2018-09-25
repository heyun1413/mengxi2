package com.zbwb.mengxi.module.system.entity;


import com.zbwb.mengxi.common.DataDomain;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

/**
 * @author sharpron
 * 字典类型
 */
@Entity
@Table(name = "sys_type")
@DynamicInsert
@DynamicUpdate
public class Type extends DataDomain {

    private List<Dict> dictGroup;

    @OneToMany(mappedBy = "type")
    public List<Dict> getDictGroup() {
        return dictGroup;
    }

    public void setDictGroup(List<Dict> dictGroup) {
        this.dictGroup = dictGroup;
    }
}
