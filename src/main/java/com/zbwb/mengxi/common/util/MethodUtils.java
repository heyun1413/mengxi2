package com.zbwb.mengxi.common.util;

import org.springframework.util.StringUtils;

public class MethodUtils {

    private static final String GETTER_PREFIX = "get";

    static String field2Method(String field) {
        return GETTER_PREFIX + StringUtils.capitalize(field);
    }

    public static String methodName2FieldName(String methodName) {
        return StringUtils.uncapitalize(methodName.substring(GETTER_PREFIX.length()));
    }
}
