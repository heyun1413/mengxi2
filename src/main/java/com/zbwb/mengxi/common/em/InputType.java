package com.zbwb.mengxi.common.em;

import com.zbwb.mengxi.module.system.entity.StorageFile;
import com.zbwb.mengxi.module.system.entity.StorageImage;

import java.util.Date;

/**
 * @author sharpron
 * 输入类型
 */
public enum InputType {

    /**
     * 文本输入
     */
    TEXT,

    /**
     * 数字输入
     */
    NUMBER,

    /**
     * 选项输入
     */
    OPTION,

    /**
     * 日期输入
     */
    DATE,

    /**
     * 图片输入
     */
    IMAGE,

    /**
     * 文件输入
     */
    FILE;

    public static InputType valueOf(Class<?> clazz) {
        if (clazz == int.class || clazz == long.class ||
                clazz == float.class || clazz == double.class
                || clazz == Integer.class || clazz == Long.class
                || clazz == Float.class || clazz == Double.class) {
            return NUMBER;
        }
        if (clazz == Date.class) {
            return DATE;
        }
        if (clazz == StorageFile.class) {
            return FILE;
        }
        if (clazz == StorageImage.class) {
            return IMAGE;
        }
//        if (ModelUtils.isModel(clazz)) {
//            return OPTION;
//        }
        return TEXT;
    }
}
