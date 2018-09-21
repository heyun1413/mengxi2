package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.domain.ModelBean;
import com.zbwb.mengxi.common.system.dto.Menu;

import java.util.List;

public interface ModelManager {

    ModelBean get(String modelName);

    List<ModelBean> allModel();

    List<Menu> allMenus();
}
