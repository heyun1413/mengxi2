package com.zbwb.mengxi.controller;

import com.zbwb.mengxi.common.BaseController;
import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.model.VideoMonitor;
import org.springframework.stereotype.Controller;

@Controller
public class VideoMonitorController extends BaseController<VideoMonitor> {

    public VideoMonitorController(CommonDao commonDao) {
        super(commonDao);
    }
}
