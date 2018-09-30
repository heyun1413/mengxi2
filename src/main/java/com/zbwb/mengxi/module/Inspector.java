package com.zbwb.mengxi.module;

import com.zbwb.mengxi.common.DataDomain;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.anno.ShowOverride;
import com.zbwb.mengxi.common.anno.ShowOverrides;
import com.zbwb.mengxi.common.type.StorageFile;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

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


    @Show(title = "姓名")
    @Transient
    @Override
    public String getName() {
        return super.getName();
    }

    @Show(title = "登录名称")
    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    @Show(title = "密码", atList = false)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Show(title = "身份证号", atList = false)
    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    @Show(title = "电话")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @ShowOverride(path = "name", show = @Show(title = "所属企业"))
    @ManyToOne
    public Enterprise getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(Enterprise enterprise) {
        this.enterprise = enterprise;
    }

    @Show(title = "资质证书", atList = false)
    public StorageFile getStorageFile() {
        return storageFile;
    }

    public void setStorageFile(StorageFile storageFile) {
        this.storageFile = storageFile;
    }

    @Show(title = "培训经历", atList = false)
    public String getTrainExperience() {
        return trainExperience;
    }

    public void setTrainExperience(String trainExperience) {
        this.trainExperience = trainExperience;
    }
}
