package com.zbwb.mengxi.common.domain;

import com.zbwb.mengxi.common.em.SearchType;
import com.zbwb.mengxi.common.util.TypeUtils;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import java.util.Date;

/**
 * @author sharpron
 * 查询参数，搜索用
 */
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

}
