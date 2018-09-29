package com.zbwb.mengxi.common.util;

import javax.persistence.Id;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
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

    public static String getIdFieldName(Class<?> clazz) {
        for (Method method : clazz.getMethods()) {
            if (method.getAnnotation(Id.class) != null) {
                return MethodUtils.methodName2FieldName(method.getName());
            }
        }
        for (Field field : clazz.getDeclaredFields()) {
            if (field.getAnnotation(Id.class) != null) {
                return field.getName();
            }
        }
        return null;
    }
}
