package com.zbwb.mengxi.common.domain;


import com.google.common.collect.Maps;
import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.em.InputType;
import com.zbwb.mengxi.common.util.ObjectUtils;
import com.zbwb.mengxi.module.system.entity.Permission;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author sharpron
 * <p>
 * 解析model
 */
public class ModelBean {


    /**
     * 模型名称
     */
    private final String name;
    /**
     * 模型信息
     */
    private final Model model;
    /**
     * 模型类型
     */
    private final Class<?> type;

    private final List<ShowBean> showBeans;

    private final List<InputBean> inputBeans;


    public ModelBean(Class<?> type,
                     Model model,
                     List<ShowBean> showBeans,
                     List<InputBean> inputBeans) {
        this.type = type;
        this.model = model;
        this.name = StringUtils.isEmpty(model.name()) ?
                StringUtils.uncapitalize(type.getSimpleName()) :
                model.name();
        this.showBeans = showBeans;
        this.inputBeans = inputBeans;
    }


    public String getName() {
        return name;
    }

    public Class<?> getType() {
        return type;
    }

    public Model getModel() {
        return model;
    }

    /**
     * 获取首页
     *
     * @param page        数据
     * @param queryObject 查询对象的值
     * @return 首页
     */
    public IndexPage getIndexPage(Page<Object> page, Object queryObject) {

        List<String> headers = showBeans.stream()
                .map(ShowBean::getName)
                .collect(Collectors.toList());

        page.setData(page.getData().stream()
                .map(this::convert)
                .collect(Collectors.toList()));

        return new IndexPage(headers, page, getFormPage(queryObject));
    }

    /**
     * 获取表单页相关信息
     *
     * @param o 对象
     * @return 表单字段
     */
    public List<FormField> getFormPage(Object o) {
        return inputBeans.stream()
                .map(e ->
                        new FormField(e.getName(), ObjectUtils.getValue(o, e.getPath())
                                , e.getPath(), e.getType(), false)
                )
                .collect(Collectors.toList());
    }

    public Map<String, List<? extends BaseEntity>> options(CommonDao commonDao) {
        final Map<String, List<? extends BaseEntity>> map = Maps.newHashMap();
        for (InputBean inputBean : inputBeans) {
            if (inputBean.getType() == InputType.OPTION) {
                List<? extends BaseEntity> all = commonDao.getAll(inputBean.getReturnType());
                map.put(inputBean.getPath(), all);
            }
        }
        return map;
    }

    private Item convert(Object o) {
        List<String> streamValues = showBeans.stream()
                .map(e -> ObjectUtils.getValue(o, e.getPath()))
                .collect(Collectors.toList());
        if (o instanceof BaseEntity) {
            return new Item(((BaseEntity) o).getId(), streamValues);
        }
        throw new AssertionError();
    }

    public List<Permission> getPermissions() {
        return Collections.singletonList(new Permission(String.format("%s:add", type.getSimpleName()), model.title() + "新增"));
    }

    private static class Item {

        private final String id;
        private final List<String> values;

        Item(String id, List<String> values) {
            this.id = id;
            this.values = values;
        }

        public String getId() {
            return id;
        }

        public List<String> getValues() {
            return values;
        }
    }

    /**
     * @return 菜单
     */
    Menu toMenu() {
        return new Menu(name, model.title());
    }
}
