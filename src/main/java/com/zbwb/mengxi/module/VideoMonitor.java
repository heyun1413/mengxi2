package com.zbwb.mengxi.module;


import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.DataDomain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

/**
 * @author sharpron
 * 视频监控
 */
@Entity
@Table(name = "video_monitor")
@Model(title = "视频监控")
public class VideoMonitor extends DataDomain {


    private String monitorUrl;

    @Show(name = "名称")
    @Override
    @Transient
    public String getName() {
        return super.getName();
    }


    @Show(name = "摄像头地址")
    public String getMonitorUrl() {
        return monitorUrl;
    }

    public void setMonitorUrl(String monitorUrl) {
        this.monitorUrl = monitorUrl;
    }

    @Show(name = "创建时间")
    @Transient
    @Override
    public Date getCreateDate() {
        return super.getCreateDate();
    }
}
