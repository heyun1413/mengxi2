package com.zbwb.mengxi.common.domain;

import com.zbwb.mengxi.common.em.InputType;

public interface InputBean extends ShowBean {

    InputType getType();

    Class<?> getReturnType();
}
