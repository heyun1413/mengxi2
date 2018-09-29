package com.zbwb.mengxi.common.util;

import com.esotericsoftware.reflectasm.MethodAccess;

import java.util.Date;

public class ObjectUtils {


    /**
     * 获取值
     * @param o 对象
     * @param path 路径
     * @return 值
     */
    public static String getValue(final Object o, String path) {
        Object result = o;
        for (String tempPath : path.split("\\.")) {
            result = getValueByMethodName(result, MethodUtils.field2Method(tempPath));
        }
        if (result == null) {
            return null;
        }
        return result instanceof Date ?
                DateUtils.format((Date) result):
                result.toString();
    }

    private static Object getValueByMethodName(Object o, String methodName) {
        return o == null ? null : MethodAccess.get(o.getClass()).invoke(o, methodName);
    }
}
