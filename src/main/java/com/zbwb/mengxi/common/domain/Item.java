package com.zbwb.mengxi.common.domain;

import java.util.List;

public class Item {

    private final String id;
    private final List<String> values;

    public Item(String id, List<String> values) {
        this.id = id;
        this.values = values;
    }

    public String getId() {
        return id;
    }

    public List<String> getValues() {
        return values;
    }
}
