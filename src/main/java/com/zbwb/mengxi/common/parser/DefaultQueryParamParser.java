package com.zbwb.mengxi.common.parser;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.domain.QueryParam;
import com.zbwb.mengxi.common.em.SearchType;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import java.util.Collections;
import java.util.List;

/**
 * @author sharpron
 * @date 2018/9/21
 * @since 1.0
 */
@Component
public class DefaultQueryParamParser implements QueryParamParser {

    private static final String FILTER_PARAM_SEPARATOR = ";";


    @Override
    public List<QueryParam> parse(String queryParamsStr) {
        return parseParam(queryParamsStr);
    }


    private static List<QueryParam> parseParam(String queryParams) {
        if (StringUtils.isEmptyOrWhitespace(queryParams)) {
            return Collections.emptyList();
        }
        List<QueryParam> queryParamGroup = Lists.newArrayList();
        for (String condition : queryParams.split(FILTER_PARAM_SEPARATOR)) {
            QueryParam queryParam = queryParamOf(condition);
            if (queryParam != null) {
                queryParamGroup.add(queryParam);
            }
        }
        return queryParamGroup;
    }

    private static QueryParam queryParamOf(String condition) {
        SearchType searchType = SearchType.get(condition);
        if (searchType == null) {
            return null;
        }
        int index = condition.indexOf(searchType.name());
        String value = condition.substring(index + searchType.name().length());
        if(StringUtils.isEmptyOrWhitespace(value)) {
            return null;
        }
        final String path = condition.substring(0, index);
        return new QueryParam(path, searchType, value);
    }

}
