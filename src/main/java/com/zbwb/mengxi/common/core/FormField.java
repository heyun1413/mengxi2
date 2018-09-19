package com.zbwb.mengxi.common.core;

import com.zbwb.mengxi.common.anno.InputType;

public class FormField {

    private final String label;
    private final String value;
    private final String path;
    private final InputType inputType;
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