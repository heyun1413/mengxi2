package com.zbwb.mengxi.common.anno;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author sharpron
 * 定义显示方案
 * 只能使用在字段的getter方法里面
 */
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Show {

    /**
     * @return 该getter方法对应的字段label
     */
    String name();

    /**
     * @return 如果要在表单显示返回true
     */
    boolean inForm() default true;

    /**
     * @return 如果要在列表中显示返回true
     */
    boolean inList() default true;

    /**
     * @return 如果要在搜索中显示返回true
     */
    boolean inSearchForm() default false;

    /**
     * 路径，如果该注解用在getter方法上对应的字段类型是其他entity，那么使用path指定路径
     * @return 多个path
     */
    String path() default "";

}
