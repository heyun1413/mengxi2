package com.zbwb.mengxi.common.domain;

import java.util.List;

/**
 * @author sharpron
 * 首页显示对象包装
 */
public class IndexPage {

    /**
     * 表头
     */
    private final List<String> headers;

    /**
     * 分页数据
     */
    private final Page<Object> page;

    /**
     * 搜索表单中的字段
     */
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
