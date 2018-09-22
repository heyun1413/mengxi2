package com.zbwb.mengxi.common.util;

import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.util.Date;

/**
 *
 * @author sharpron
 * 类型工具
 */
public class TypeUtils {

    private TypeUtils() {}

    /**
     * 是日期
     * @param clazz
     * @param fieldName
     * @return
     */
    public static boolean isDate(Class<?> clazz, String fieldName) {
        try {
            Method method = clazz.getMethod("get" + StringUtils.capitalize(fieldName));
            return method.getReturnType() == Date.class;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }

    /**
     * 是数字
     * @param value 字符串值
     * @return 如果是数字返回 true， 否则返回false
     */
    public static boolean isNumber(String value) {
        return value.matches("\\d+");
    }
}
