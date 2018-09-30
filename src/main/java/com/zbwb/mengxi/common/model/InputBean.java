package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.em.InputType;

public interface InputBean extends Bean {

    InputType getInputType();

    Class<?> getType();
}
