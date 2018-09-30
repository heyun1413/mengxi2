package com.zbwb.mengxi.common.anno;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author sharpron
 * 声明模型
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Model {

    /**
     * @return 标题
     */
    String title();

    /**
     *
     * @return 名字，默认是类的首字母小写，避免同名冲突
     */
    String name() default "";

}
