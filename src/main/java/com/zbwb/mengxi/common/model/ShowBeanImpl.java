package com.zbwb.mengxi.common.model;

public class ShowBeanImpl implements ShowBean {

    private final String path;

    private final String value;

    ShowBeanImpl(String path, String value) {
        this.path = path;
        this.value = value;
    }

    @Override
    public String getPath() {
        return path;
    }

    @Override
    public String getTitle() {
        return value;
    }

}
