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
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Show {

    /**
     * @return 该getter方法对应的字段label
     */
    String title();

    /**
     * @return 如果要在表单显示返回true
     */
    boolean atForm() default true;

    /**
     * @return 如果要在列表中显示返回true
     */
    boolean atList() default true;

    /**
     * @return 如果要在搜索中显示返回true
     */
    boolean atSearch() default false;

}
