package com.zbwb.mengxi.common;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

@Repository
public class CommonDao {

    @PersistenceContext
    private EntityManager entityManager;

    protected Logger logger = LoggerFactory.getLogger(getClass());



    public <T> T get(Class<T> clazz, Serializable id) {
        return entityManager.find(clazz, id);
    }

    @SuppressWarnings("unchecked")
    public <T> Page<T> find(int pageNo, DetachedCriteria criteria) {
        Page<T> page = new Page<>();
        final Criteria executableCriteria = criteria.getExecutableCriteria(session());
        final List<T> data = executableCriteria
                .setFirstResult((pageNo - 1) * page.getPageSize())
                .setMaxResults(pageNo * page.getPageSize())
                .list();
        page.setCount(count(executableCriteria));
        page.setData(data);
        return page;
    }

    public Session session() {
        return (Session) entityManager.getDelegate();
    }

    public long count(Criteria criteria) {
        return (Long) criteria.setProjection(Projections.rowCount()).uniqueResult();
    }

    public <T> void save(T t) {
        entityManager.persist(t);
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
}
