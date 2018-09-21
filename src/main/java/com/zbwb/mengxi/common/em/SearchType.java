package com.zbwb.mengxi.common.em;

public enum SearchType {
    NONE,
    EQ,
    GT,
    LT,
    GE,
    LE,
    LIKE;

    public static SearchType get(String condition) {
        for (SearchType searchType : SearchType.values()) {
            if (condition.contains(searchType.name())) {
                return searchType;
            }
        }
        return null;
    }
}
