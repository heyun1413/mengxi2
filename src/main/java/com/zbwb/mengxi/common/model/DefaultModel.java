package com.zbwb.mengxi.common.model;

import com.google.common.collect.Maps;
import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.domain.FormField;
import com.zbwb.mengxi.common.domain.IndexPage;
import com.zbwb.mengxi.common.domain.Page;
import com.zbwb.mengxi.common.em.InputType;
import com.zbwb.mengxi.common.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DefaultModel extends AbstractModel {

    private final List<String> titles;
    private final List<Bean> beans;

    DefaultModel(Model model, Class<?> type, List<Bean> beans) {
        super(getModelName(model, type), model.title(), type);

        this.titles = beans.stream()
                .filter(e -> e instanceof ShowBean)
                .map(Bean::getTitle)
                .collect(Collectors.toList());
        this.beans = beans;
    }

    @Override
    public IndexPage getIndexPage(Page<Object> page, Object queryObject) {
        page.setData(page.getData().stream()
                .map(this::convert)
                .collect(Collectors.toList()));
        return new IndexPage(titles, page, getFormPage(queryObject));
    }

    private Item convert(Object o) {
        assert o instanceof BaseEntity;
        List<String> streamValues = beans.stream()
                .filter(e -> e instanceof ShowBean)
                .map(e -> ObjectUtils.getValue(o, e.getPath()))
                .collect(Collectors.toList());
        return new Item(((BaseEntity) o).getId(), streamValues);
    }

    public static class Item {

        final String id;
        final List<String> values;

        Item(String id, List<String> values) {
            this.id = id;
            this.values = values;
        }

        public List<String> getValues() {
            return values;
        }

        public String getId() {
            return id;
        }
    }

    @Override
    public List<FormField> getFormPage(Object o) {
        return beans.stream()
                .filter(e -> e instanceof InputBean)
                .map(e ->
                        new FormField(e.getTitle(), ObjectUtils.getValue(o, e.getPath())
                                , e.getPath(), ((InputBean) e).getInputType(), false)
                )
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<? extends BaseEntity>> getOptions(CommonDao commonDao) {
        final Map<String, List<? extends BaseEntity>> map = Maps.newHashMap();
        beans.stream()
                .filter(e -> (e instanceof InputBean) && InputType.OPTION == ((InputBean) e).getInputType())
                .forEach(e -> {
                    List<? extends BaseEntity> all = commonDao.getAll(((InputBean) e).getType());
                    map.put(e.getPath(), all);
                });
        return map;
    }

    private static String getModelName(Model model, Class<?> type) {
        return StringUtils.isEmpty(model.name()) ?
                StringUtils.uncapitalize(type.getSimpleName()) :
                model.name();
    }
}
