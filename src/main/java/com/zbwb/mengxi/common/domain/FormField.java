package com.zbwb.mengxi.common.domain;

import com.zbwb.mengxi.common.em.InputType;

/**
 * @author sharpron
 * 定义表单字段
 */
public class FormField {

    /**
     * 标签
     */
    private final String label;
    /**
     * 值
     */
    private final String value;
    /**
     * 路径，类似entity.name
     */
    private final String path;
    /**
     * 输入类型
     */
    private final InputType inputType;
    /**
     * 是否可为空
     */
    private final boolean nullable;


    public FormField(String label, String value, String path, InputType inputType, boolean nullable) {
        this.label = label;
        this.value = value;
        this.path = path;
        this.inputType = inputType;
        this.nullable = nullable;
    }

    public String getLabel() {
        return label;
    }

    public String getValue() {
        return value;
    }

    public String getPath() {
        return path;
    }

    public InputType getInputType() {
        return inputType;
    }

    public boolean isNullable() {
        return nullable;
    }


}