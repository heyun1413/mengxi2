package com.zbwb.mengxi.common.vo;

import java.util.List;
import java.util.Map;

public class TableData {

    private final long count;

    private final List<Map<String, Object>> data;

    public TableData(long count, List<Map<String, Object>> data) {
        this.count = count;
        this.data = data;
    }

    public long getCount() {
        return count;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }
}
