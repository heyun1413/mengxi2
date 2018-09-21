package com.zbwb.mengxi.common.util;

import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.util.Date;

public class TypeUtils {

    private TypeUtils() {}

    public static boolean isDate(Class<?> clazz, String fieldName) {
        try {
            Method method = clazz.getMethod("get" + StringUtils.capitalize(fieldName));
            return method.getReturnType() == Date.class;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }

    public static boolean isNumber(String value) {
        return value.matches("\\d+");
    }
}
