package com.zbwb.mengxi.common.system;


import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

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
