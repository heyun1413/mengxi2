package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.em.InputType;

public class AnnotationShowBean implements ShowBean, InputBean {


    private final String path;

    private final String title;

    private final InputType inputType;

    private final Class<?> type;


    private AnnotationShowBean(String path, String title, Class<?> type) {
        this.path = path;
        this.title = title;
        this.inputType = InputType.valueOf(type);
        this.type = type;
    }


    AnnotationShowBean(Show show, Class<?> type, String path) {
        this(path, show.title(), type);
    }

    @Override
    public InputType getInputType() {
        return this.inputType;
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
