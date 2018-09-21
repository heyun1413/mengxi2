package com.zbwb.mengxi.common.util;

import java.lang.reflect.ParameterizedType;

public class ClassUtils {

    @SuppressWarnings("unchecked")
    public static <T> Class<T> getGenericType(Class<?> clazz) {
        return (Class<T>)((ParameterizedType) clazz.getGenericSuperclass()).getActualTypeArguments()[0];
    }
}
