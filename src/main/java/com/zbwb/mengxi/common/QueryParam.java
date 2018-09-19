package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.em.SearchType;

public class QueryParam {

    private final String path;
    private final SearchType searchType;
    private final String value;

    public QueryParam(String path, SearchType searchType, String value) {
        this.path = path;
        this.searchType = searchType;
        this.value = value;
    }

    public String getPath() {
        return path;
    }

    public SearchType getSearchType() {
        return searchType;
    }

    public String getValue() {
        return value;
    }
}
