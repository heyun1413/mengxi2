package com.zbwb.mengxi.common.core;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public enum Operation {

    ADD, DELETE, EDIT, DETAIL, EXPORT;

    public static List<String> tabOperations() {
        return Collections.singletonList(ADD.name());
    }

    public static List<String> listItemOperations() {
        return Arrays.asList(DETAIL.name(), EDIT.name(), DELETE.name());
    }

}
