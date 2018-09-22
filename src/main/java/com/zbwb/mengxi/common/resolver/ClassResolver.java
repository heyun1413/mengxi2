package com.zbwb.mengxi.common.resolver;

/**
 * @author sharpron
 * @date 2018/9/21
 * @since 1.0
 */
public interface ClassResolver {

    /**
     * 解析类对象
     * @param clazz
     * @return
     */
    Object resolve(Class<?> clazz);

}
