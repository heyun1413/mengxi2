package com.zbwb.mengxi.common.em;


/**
 * @author sharpron
 */
public enum SearchType {

    /**
     * 无
     */
    NONE,

    /**
     * 相等
     */
    EQ,

    /**
     * 大于
     */
    GT,

    /**
     * 小于
     */
    LT,

    /**
     * 大于或等于
     */
    GE,

    /**
     * 小于或等于
     */
    LE,

    /**
     * 模糊匹配
     */
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
