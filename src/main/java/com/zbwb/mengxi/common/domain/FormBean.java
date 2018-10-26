package com.zbwb.mengxi.common.domain;

import com.google.common.collect.Maps;
import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.em.InputType;
import com.zbwb.mengxi.common.model.Bean;
import com.zbwb.mengxi.common.model.InputBean;
import com.zbwb.mengxi.common.util.ObjectUtils;
import com.zbwb.mengxi.common.vo.Item;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class FormBean {

    @FunctionalInterface
    public interface Finder {
        List<? extends BaseEntity> find(Class<?> clazz);
    }

    private final List<Bean> beans;

    public FormBean(List<Bean> beans) {
        this.beans = beans;
    }


    public Map<String, List<Item>> getOptions(Finder finder) {
        final Map<String, List<Item>> map = Maps.newHashMap();
        beans.stream()
                .filter(e -> (e instanceof InputBean) && InputType.OPTION == ((InputBean) e).getInputType())
                .forEach(e -> {
                    List<? extends BaseEntity> all = finder.find(((InputBean) e).getType());
                    List<Item> items = all.stream()
                            .map(entity -> new Item(entity.getId(), entity.getName()))
                            .collect(Collectors.toList());
                    map.put(e.getPath(), items);
                });
        return map;
    }

    public List<FormField> getFormFields() {
        return beans.stream()
                .filter(e -> e instanceof InputBean)
                .map(e ->
                        new FormField(e.getTitle(), ObjectUtils.getValue(null, e.getPath())
                                , e.getPath(), ((InputBean) e).getInputType(), false)
                )
                .collect(Collectors.toList());
    }
}
