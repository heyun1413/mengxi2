package com.zbwb.mengxi.common.domain;

import com.zbwb.mengxi.common.anno.Show;

public class MethodAnnotation {

    final Show show;
    final String methodName;
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

    public String getMethodName() {
        return methodName;
    }

    public Class<?> getReturnValueType() {
        return returnValueType;
    }
}