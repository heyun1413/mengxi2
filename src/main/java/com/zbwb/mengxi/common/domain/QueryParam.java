package com.zbwb.mengxi.common.domain;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.em.SearchType;
import com.zbwb.mengxi.common.util.TypeUtils;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.thymeleaf.util.StringUtils;

import java.util.Collections;
import java.util.Date;
import java.util.List;

public class QueryParam {


    private static final String FILTER_PARAM_SEPARATOR = ";";

    private final String path;
    private final SearchType searchType;
    private final String value;

    QueryParam(String path, SearchType searchType, String value) {
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
    
    public Criterion getCriterion(Class<?> clazz) {
        switch (getSearchType()) {
            case EQ:
                return Restrictions.eq(getPath(), getValue());
            case GT: {
                if (TypeUtils.isNumber(getValue())) {
                    Integer value = Integer.valueOf(getValue());
                    return Restrictions.gt(getPath(), value);
                }
            }
            case LT: {
                if (TypeUtils.isNumber(getValue())) {
                    Long value = Long.valueOf(getValue());
                    return Restrictions.lt(getPath(), value);
                }
            }
            case GE: {
                if (TypeUtils.isDate(clazz, getPath())) {
                    return Restrictions.ge(getPath(), new Date(Long.parseLong(getValue())));
                }
                if (TypeUtils.isNumber(getValue())) {
                    Long value = Long.valueOf(getValue());
                    return Restrictions.ge(getPath(), value);
                }
                return null;
            }
            case LE: {
                if (TypeUtils.isDate(clazz, getPath())) {
                    return Restrictions.le(getPath(), new Date(Long.parseLong(getValue())));
                }
                if (TypeUtils.isNumber(getValue())) {
                    Integer value = Integer.valueOf(getValue());
                    return Restrictions.le(getPath(), value);
                }
                return null;
            }
            case LIKE:
                return Restrictions.like(getPath(), '%' + getValue() + '%');
            default:
                return null;
        }
    }

    public static List<QueryParam> parseParam(String queryParams) {
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
