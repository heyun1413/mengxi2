package com.zbwb.mengxi.common.em;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author sharpron
 * 定义常用操作
 */
public enum Operation {

    /**
     * 新增
     */
    ADD,

    /**
     * 删除
     */
    DELETE,

    /**
     * 编辑
     */
    EDIT,

    /**
     * 查看详情
     */
    DETAIL,

    /**
     * 导出报表
     */
    EXPORT;


    /**
     *
     * @return tab 栏的操作
     */
    public static List<String> tabOperations() {
        return Collections.singletonList(ADD.name());
    }

    /**
     *
     * @return 列表项的操作
     */
    public static List<String> listItemOperations() {
        return Arrays.asList(DETAIL.name(), EDIT.name(), DELETE.name());
    }

}
