package com.zbwb.mengxi.module;


import com.zbwb.mengxi.common.DataDomain;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.type.Location;
import com.zbwb.mengxi.common.type.StorageImage;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "enterprise")
@Model(title = "企业信息管理")
public class Enterprise extends DataDomain {


    private String code;

    private String managerLoginName;

    private String responsiblePerson;

    private String responsiblePersonPhone;

    private StorageImage logo;

    private String locationDesc;

    private Location location;

    @Show(name = "企业名称")
    @Override
    @Transient
    public String getName() {
        return super.getName();
    }

    @Show(name = "企业编码")
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Show(name = "管理员登录账号")
    public String getManagerLoginName() {
        return managerLoginName;
    }

    public void setManagerLoginName(String managerLoginName) {
        this.managerLoginName = managerLoginName;
    }

    @Show(name = "负责人")
    public String getResponsiblePerson() {
        return responsiblePerson;
    }

    public void setResponsiblePerson(String responsiblePerson) {
        this.responsiblePerson = responsiblePerson;
    }

    @Show(name = "负责人电话")
    public String getResponsiblePersonPhone() {
        return responsiblePersonPhone;
    }

    public void setResponsiblePersonPhone(String responsiblePersonPhone) {
        this.responsiblePersonPhone = responsiblePersonPhone;
    }

    @Show(name = "企业图标", inList = false)
    public StorageImage getLogo() {
        return logo;
    }

    public void setLogo(StorageImage logo) {
        this.logo = logo;
    }

    @Show(name = "企业位置", inList = false)
    public String getLocationDesc() {
        return locationDesc;
    }

    public void setLocationDesc(String locationDesc) {
        this.locationDesc = locationDesc;
    }

    @Show(name = "经纬度", inList = false)
    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
