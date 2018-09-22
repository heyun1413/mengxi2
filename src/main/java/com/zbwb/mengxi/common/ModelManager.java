package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.domain.ModelBean;
import com.zbwb.mengxi.common.system.dto.Menu;

import java.util.List;

/**
 * @author sharpron
 * 模型管理器
 */
public interface ModelManager {

    /**
     * 获取模型
     * @param modelName 名字
     * @return 模型
     */
    ModelBean get(String modelName);

    /**
     * 获取所有模型
     * @return 所有模型
     */
    List<ModelBean> allModel();

    /**
     * 获取所有菜单
     * @return 所有菜单
     */
    List<Menu> allMenus();
}
