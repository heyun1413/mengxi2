package com.zbwb.mengxi.common.em;

import com.zbwb.mengxi.common.type.Inputable;
import com.zbwb.mengxi.common.type.Location;
import com.zbwb.mengxi.common.type.StorageFile;
import com.zbwb.mengxi.common.type.StorageImage;

import java.util.Date;

/**
 * @author sharpron
 * 输入类型
 */
public enum InputType implements Inputable {

    AUTO {
        @Override
        public String getComponentName() {
            return null;
        }
    },

    /**
     * 文本输入
     */
    TEXT {
        @Override
        public String getComponentName() {
            return "text";
        }
    },

    /**
     * 数字输入
     */
    NUMBER {
        @Override
        public String getComponentName() {
            return "number";
        }
    },

    /**
     * 选项输入
     */
    OPTION {
        @Override
        public String getComponentName() {
            return "option";
        }
    },

    /**
     * 日期输入
     */
    DATE {
        @Override
        public String getComponentName() {
            return null;
        }
    },

    /**
     * 图片输入
     */
    IMAGE {
        @Override
        public String getComponentName() {
            return "image";
        }
    },

    /**
     * 文件输入
     */
    FILE {
        @Override
        public String getComponentName() {
            return "file";
        }
    },

    LOCATION {
        @Override
        public String getComponentName() {
            return "location";
        }
    };

    public static InputType valueOf(Class<?> clazz) {
        if (clazz == int.class || clazz == long.class ||
                clazz == float.class || clazz == double.class
                || clazz == Integer.class || clazz == Long.class
                || clazz == Float.class || clazz == Double.class) {
            return NUMBER;
        }
        if (clazz == String.class) {
            return TEXT;
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
        if (clazz == Location.class) {
            return LOCATION;
        }
        return OPTION;
    }
}
