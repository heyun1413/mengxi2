package com.zbwb.mengxi.common.core;

import com.zbwb.mengxi.common.Page;

import java.util.List;

public class IndexPage {

    private List<String> headers;

    private Page<Object> page;

    public IndexPage(List<String> headers, Page<Object> page) {
        this.headers = headers;
        this.page = page;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public void setHeaders(List<String> headers) {
        this.headers = headers;
    }

    public Page<Object> getPage() {
        return page;
    }

    public void setPage(Page<Object> page) {
        this.page = page;
    }
}
