package com.zbwb.mengxi.module.emergency;

import com.zbwb.mengxi.common.DataDomain;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.anno.ShowOverride;
import com.zbwb.mengxi.common.type.StorageFile;
import com.zbwb.mengxi.common.type.StorageImage;
import com.zbwb.mengxi.module.Enterprise;
import com.zbwb.mengxi.module.emergency.em.Status;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;


@MappedSuperclass
public class RetractableResource extends DataDomain {

    private Enterprise enterprise;

    private Status status;

    private StorageFile attachment;

    private StorageImage image;

    private Integer version;

    


    @Show(title = "名称")
    @Override
    @Transient
    public String getName() {
        return super.getName();
    }

    @ShowOverride(path = "name", show = @Show(title = "所属企业"))
    public Enterprise getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(Enterprise enterprise) {
        this.enterprise = enterprise;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
