package com.zbwb.mengxi.common.domain;


import com.esotericsoftware.reflectasm.MethodAccess;
import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.DataDomain;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.em.InputType;
import com.zbwb.mengxi.common.system.entity.Permission;
import com.zbwb.mengxi.common.util.DateUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class ModelBean {

    private final Model model;
    private final List<MethodAnnotation> methodAnnotations;
    private final Class<?> type;
    private final MethodAccess methodAccess;

    public ModelBean(Class<?> type, Model model, List<MethodAnnotation> methodAnnotations) {
        this.type = type;
        this.model = model;
        this.methodAnnotations = new ArrayList<>(methodAnnotations);
        this.methodAccess = MethodAccess.get(this.type);
    }

    public Class<?> getType() {
        return type;
    }

    public Model getModel() {
        return model;
    }


    private List<MethodAnnotation> getMethodAnnotations() {
        return methodAnnotations;
    }

    public IndexPage getIndexPage(Page<Object> page, Object queryObject) {
        List<String> headers = methodAnnotations.stream()
                .filter((e) -> e.show.inList())
                .map((e) -> e.show.name())
                .collect(Collectors.toList());
        page.setData(page.getData().stream()
                .map(this::convert)
                .collect(Collectors.toList()));

        return new IndexPage(headers, page, getFormPage(queryObject));
    }

    public List<FormField> getFormPage(Object o) {
        return getMethodAnnotations().stream()
                .filter((e) -> e.show.inForm())
                .map((e) -> new FormField(
                        e.show.name(),
                        getValue(o, e.methodName),
                        StringUtils.uncapitalize(e.methodName.substring(3)),
                        InputType.valueOf(e.returnValueType),
                        false))
                .collect(Collectors.toList());
    }

    private String getValue(Object o, String methodName) {
        final Object value = o == null ? null : methodAccess.invoke(o, methodName);
        if (value == null) {
            return null;
        }
        return value instanceof Date ?
                DateUtils.format((Date) value):
                value.toString();
    }

    private Item convert(Object o) {
        List<String> streamValues = methodAnnotations.stream()
                .map(methodAnnotation -> getValue(o, methodAnnotation.methodName))
                .collect(Collectors.toList());
        if (o instanceof BaseEntity) {
            return new Item(((BaseEntity) o).getId(), streamValues);
        }
        throw new AssertionError();
    }

    public List<Permission> getPermissions() {
        return Arrays.asList(new Permission(String.format("%s:add", type.getSimpleName()), model.title() + "新增"));
    }
}
