package com.zbwb.mengxi.module;

import com.zbwb.mengxi.common.DataDomain;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.type.StorageFile;

import javax.persistence.*;

@Entity
@Table
@Model(title = "巡检员管理")
public class Inspector extends DataDomain {

    private String loginName;

    private String password;

    private String idCard;

    private String phone;

    private Enterprise enterprise;

    private StorageFile storageFile;

    private String trainExperience;


    @Show(name = "姓名")
    @Transient
    @Override
    public String getName() {
        return super.getName();
    }

    @Show(name = "登录名称")
    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    @Show(name = "密码", inList = false)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Show(name = "身份证号", inList = false)
    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    @Show(name = "电话")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Show(name = "所属企业", path = "name")
    @ManyToOne
    public Enterprise getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(Enterprise enterprise) {
        this.enterprise = enterprise;
    }

    @Show(name = "资质证书", inList = false)
    public StorageFile getStorageFile() {
        return storageFile;
    }

    public void setStorageFile(StorageFile storageFile) {
        this.storageFile = storageFile;
    }

    @Show(name = "培训经历", inList = false)
    public String getTrainExperience() {
        return trainExperience;
    }

    public void setTrainExperience(String trainExperience) {
        this.trainExperience = trainExperience;
    }
}
