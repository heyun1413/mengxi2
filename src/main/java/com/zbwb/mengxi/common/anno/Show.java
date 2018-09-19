package com.zbwb.mengxi.common.anno;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Show {

    String name();

    boolean inForm() default true;

    boolean inList() default true;

    boolean inSearchForm() default false;

    String[] paths() default "";
}
