package com.zbwb.mengxi.common.util;

import java.lang.reflect.ParameterizedType;

/**
 * @author sharpron
 * class 工具
 */
public class ClassUtils {

    /**
     * 获取泛型的class
     * @param clazz 指定类
     * @param <T> 泛型
     * @return 该类的泛型class
     */
    @SuppressWarnings("unchecked")
    public static <T> Class<T> getGenericType(Class<?> clazz) {
        return (Class<T>)((ParameterizedType) clazz.getGenericSuperclass()).getActualTypeArguments()[0];
    }

}
