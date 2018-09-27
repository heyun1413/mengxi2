package com.zbwb.mengxi.common.domain;

import com.zbwb.mengxi.common.anno.Show;

/**
 * @author sharpron
 * 方法注解的包装器
 */
public class MethodAnnotation {

    /**
     * 显示
     */
    final Show show;
    /**
     * 方法名称
     */
    final String methodName;
    /**
     * 返回值类型
     */
    final Class<?> returnValueType;

    public MethodAnnotation(Show show,
                     String methodName,
                     Class<?> returnValueType) {
        this.show = show;
        this.methodName = methodName;
        this.returnValueType = returnValueType;
    }

    public Show getShow() {
        return show;
    }


}