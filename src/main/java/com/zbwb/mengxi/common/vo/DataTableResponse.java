package com.zbwb.mengxi.common.vo;

import java.util.List;
import java.util.Map;

public class DataTableResponse {

    private int draw;
    private long recordsTotal;
    private long recordsFiltered;
    private List<Map<String, Object>> data;

    public DataTableResponse(int draw,
                             long recordsTotal,
                             long recordsFiltered,
                             List<Map<String, Object>> data) {
        this.draw = draw;
        this.recordsTotal = recordsTotal;
        this.recordsFiltered = recordsFiltered;
        this.data = data;
    }

    public int getDraw() {
        return draw;
    }

    public long getRecordsTotal() {
        return recordsTotal;
    }

    public long getRecordsFiltered() {
        return recordsFiltered;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }
}
