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

/**
 * @author sharpron
 *
 * 通用dao
 */
@Repository
public class CommonDao {

    private static final String PATH_SEPARATOR = ".";

    @PersistenceContext
    private EntityManager entityManager;


    /**
     * @param clazz clazz
     * @param id 主键
     * @param <T> 实体类型
     * @return 实体
     */
    public <T> T get(Class<T> clazz, Serializable id) {
        return entityManager.find(clazz, id);
    }

    /**
     * 分页查询
     * @param pageNo 页码
     * @param criteria 查询
     * @param <T> 实体类型
     * @return 分页数据
     */
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

    @SuppressWarnings("unchecked")
    public <T> List<T> getAll(Class<?> clazz) {
        return (List<T>) session().createCriteria(clazz).list();
    }

    /**
     * @return session
     */
    public Session session() {
        return (Session) entityManager.getDelegate();
    }

    /**
     * 保存实体
     * @param t 实体
     * @param <T> 实体类型
     */
    public <T> void save(T t) {
        entityManager.persist(t);
    }

    /**
     * 更新实体
     * @param t 实体
     * @param <T> 实体类型
     */
    public <T> void update(T t) {
        entityManager.merge(t);
    }

    /**
     * 保存多个实体
     * @param group 多个实体
     * @param <T> 实体类型
     */
    public <T> void save(List<T> group) {
        for (T t : group) {
            save(t);
        }
    }

    /**
     * 删除实体
     * @param object 实体对象
     */
    public void delete(Object object) {
        entityManager.remove(object);
    }

    /**
     * 清除
     */
    public void clear() {
        entityManager.clear();
    }

    /**
     * 动态查询条件
     * @param clazz 对应的实体class
     * @param queryParams 查询参数组
     * @return 组合的动态条件
     */
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
