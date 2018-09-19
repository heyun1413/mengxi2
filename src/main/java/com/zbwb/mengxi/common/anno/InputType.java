package com.zbwb.mengxi.common.anno;

import com.zbwb.mengxi.common.ModelParser;
import com.zbwb.mengxi.common.system.StorageFile;
import com.zbwb.mengxi.common.system.StorageImage;

import java.util.Date;

public enum InputType {

    TEXT, NUMBER, OPTION, DATE, IMAGE, FILE;

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
        if (ModelParser.isModel(clazz)) {
            return OPTION;
        }
        return TEXT;
    }
}
