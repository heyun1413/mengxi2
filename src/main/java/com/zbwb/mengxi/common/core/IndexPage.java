package com.zbwb.mengxi.common.core;

import com.zbwb.mengxi.common.Page;

import java.util.List;

public class IndexPage {

    private final List<String> headers;

    private final Page<Object> page;

    private final List<FormField> searchField;

    public IndexPage(List<String> headers, Page<Object> page, List<FormField> searchField) {
        this.headers = headers;
        this.page = page;
        this.searchField = searchField;
    }

    public List<String> getHeaders() {
        return headers;
    }


    public Page<Object> getPage() {
        return page;
    }


    public List<FormField> getSearchField() {
        return searchField;
    }
}
