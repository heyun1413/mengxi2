package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.em.InputType;

public class InputBeanImpl implements InputBean {

    private final InputType inputType;

    private final Class<?> type;

    private final String path;

    private final String title;

    public InputBeanImpl(Class<?> type, String path, String title) {
        this.inputType = InputType.valueOf(type);
        this.type = type;
        this.path = path;
        this.title = title;
    }

    @Override
    public InputType getInputType() {
        return inputType;
    }

    @Override
    public Class<?> getType() {
        return type;
    }

    @Override
    public String getPath() {
        return path;
    }

    @Override
    public String getTitle() {
        return title;
    }
}
