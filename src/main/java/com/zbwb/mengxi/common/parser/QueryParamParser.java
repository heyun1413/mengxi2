package com.zbwb.mengxi.common.parser;

import com.zbwb.mengxi.common.domain.QueryParam;

import java.util.List;

/**
 *
 * 查询参数解析器
 * @author sharpron
 * @date 2018/9/21
 * @since 1.0
 */
public interface QueryParamParser {

    /**
     * 解析参数
     * @param queryParamsStr 字符串格式
     * @return 一组QueryParamParser
     */
    List<QueryParam> parse(String queryParamsStr);
}
