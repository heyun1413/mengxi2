package com.zbwb.mengxi.model;


import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.system.DataDomain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.text.SimpleDateFormat;

@Entity
@Table(name = "video_monitor")
@Model(title = "视频监控")
public class VideoMonitor extends DataDomain {


    private String monitorUrl;

    @Model.Show
    @Model.Name("名称")
    @Model.FormInput
    @Override
    @Transient
    public String getName() {
        return super.getName();
    }

    @Model.Show
    @Model.Name("摄像头地址")
    @Model.FormInput
    public String getMonitorUrl() {
        return monitorUrl;
    }

    public void setMonitorUrl(String monitorUrl) {
        this.monitorUrl = monitorUrl;
    }

    @Model.Show
    @Model.Name("创建时间")
    @Transient
    public String createTime() {
        return new SimpleDateFormat("yyyy-MM-dd").format(getCreateDate());
    }
}
