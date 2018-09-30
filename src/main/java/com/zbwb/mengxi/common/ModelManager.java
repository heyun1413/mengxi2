package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.domain.Menu;
import com.zbwb.mengxi.common.model.ModelBean;

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
     * @return 菜单
     */
    List<Menu> allMenu();

}
