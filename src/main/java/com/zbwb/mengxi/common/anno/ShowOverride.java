package com.zbwb.mengxi.common.anno;


import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ANNOTATION_TYPE, METHOD})
@Retention(RUNTIME)
public @interface ShowOverride {

    String path();

    Show show();

}
