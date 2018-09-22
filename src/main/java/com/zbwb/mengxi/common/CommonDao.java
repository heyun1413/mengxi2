package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.domain.Page;
import com.zbwb.mengxi.common.domain.QueryParam;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

@Repository
public class CommonDao {

    private static final String PATH_SEPARATOR = ".";

    @PersistenceContext
    private EntityManager entityManager;




    public <T> T get(Class<T> clazz, Serializable id) {
        return entityManager.find(clazz, id);
    }

    @SuppressWarnings("unchecked")
    public <T> Page<T> find(int pageNo, DetachedCriteria criteria) {
        Page<T> page = new Page<>();
        page.setPageNo(pageNo);
        final Criteria executableCriteria = criteria.getExecutableCriteria(session());
        page.setCount((Long) executableCriteria
                .setProjection(Projections.rowCount())
                .uniqueResult());
        final List<T> data = executableCriteria
                .setProjection(null)
                .setFirstResult((pageNo - 1) * page.getPageSize())
                .setMaxResults(pageNo * page.getPageSize())
                .list();

        page.setData(data);
        return page;
    }

    public Session session() {
        return (Session) entityManager.getDelegate();
    }

    public <T> void save(T t) {
        entityManager.persist(t);
    }

    public <T> void update(T t) {
        entityManager.refresh(t);
    }

    public <T> void save(List<T> group) {
        for (T t : group) {
            save(t);
        }
    }

    public void delete(Object object) {
        entityManager.remove(object);
    }

    public void clear() {
        entityManager.clear();
    }


    @SuppressWarnings("unchecked")
    static <T> Class<T> getTClass(Class<?> clazz) {
        return (Class<T>)((ParameterizedType) clazz.getGenericSuperclass()).getActualTypeArguments()[0];
    }

    public static DetachedCriteria detachedCriteria(Class<?> clazz, List<QueryParam> queryParams) {
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(clazz)
                .addOrder(Order.desc("createDate"));
        for (QueryParam queryParam : queryParams) {
            handleQueryParam(clazz, queryParam, detachedCriteria);
        }
        return detachedCriteria;
    }

    private static void handleQueryParam(Class<?> clazz, QueryParam queryParam,
                                         DetachedCriteria detachedCriteria) {
        String path = queryParam.getPath();
        int splitIndex = path.indexOf(PATH_SEPARATOR);
        if (splitIndex != -1) {
            String name = path.substring(0, splitIndex);
            detachedCriteria.createAlias(name, name);
            handleQueryParam(clazz, queryParam, detachedCriteria);
        }
        else {
            Criterion byQueryParam = queryParam.getCriterion(clazz);
            if (byQueryParam != null) {
                detachedCriteria.add(byQueryParam);
            }
        }
    }
}
