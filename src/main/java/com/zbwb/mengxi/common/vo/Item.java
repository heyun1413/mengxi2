package com.zbwb.mengxi.common.vo;

public class Item {

    private final String id;

    private final String value;

    public Item(String id, String value) {
        this.id = id;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public String getValue() {
        return value;
    }
}
