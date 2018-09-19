package com.zbwb.mengxi.common;

import com.esotericsoftware.reflectasm.MethodAccess;
import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.anno.InputType;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.core.FormField;
import com.zbwb.mengxi.common.core.IndexPage;
import com.zbwb.mengxi.common.core.Item;
import com.zbwb.mengxi.common.system.DataDomain;
import com.zbwb.mengxi.common.util.DateUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLDecoder;
import java.util.*;
import java.util.stream.Collectors;

public class ModelParser {

    private static final String BASE_MODEL_PACKAGE = "com.zbwb.mengxi.model.";

    private Model model;
    private Class<?> clazz;

    private MethodAccess methodAccess;

    ModelParser(String modelName) {
        clazz = model2Class(modelName);
        model = clazz.getAnnotation(Model.class);
        if (model == null) {
            throw new RuntimeException("not is a model");
        }
        methodAccess = MethodAccess.get(clazz);
    }

    static Class<?> model2Class(String model) {
        String modelClassName = BASE_MODEL_PACKAGE + StringUtils.capitalize(model);
        try {
            return Class.forName(modelClassName);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("error model");
        }
    }

    IndexPage getIndexPage(Page<Object> page, Object queryObject) {
        List<MethodAnnotation> methodAnnotations = getMethodAnnotations();
        List<String> headers = methodAnnotations.stream()
                .filter((e) -> e.show.inList())
                .map((e) -> e.show.name())
                .collect(Collectors.toList());
        page.setData(page.getData().stream()
                .map((e) -> convert(methodAnnotations, e))
                .collect(Collectors.toList()));

        return new IndexPage(headers, page, getFormPage(queryObject));
    }



    List<FormField> getFormPage(Object o) {
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


    private List<MethodAnnotation> getMethodAnnotations() {
        List<MethodAnnotation> result = Lists.newArrayList();
        for (Method method : clazz.getMethods()) {
            Show show = method.getAnnotation(Show.class);
            if (show != null) {
                result.add(new MethodAnnotation(show, method.getName(), method.getReturnType()));
            }
        }
        return result;
    }

    static class MethodAnnotation {
        final Show show;
        final String methodName;
        final Class<?> returnValueType;

        MethodAnnotation(Show show,
                         String methodName,
                         Class<?> returnValueType) {
            this.show = show;
            this.methodName = methodName;
            this.returnValueType = returnValueType;
        }
    }

    private Item convert(List<MethodAnnotation> methodAnnotations, Object o) {
        List<String> streamValues = methodAnnotations.stream()
                .map(methodAnnotation -> getValue(o, methodAnnotation.methodName))
                .collect(Collectors.toList());
        if (o instanceof DataDomain) {
            return new Item(((DataDomain) o).getId(), streamValues);
        }
        throw new AssertionError();
    }

    Class<?> getClazz() {
        return clazz;
    }

    boolean isDate(String fieldName) {
        try {
            Method method = getClazz().getMethod("get" + StringUtils.capitalize(fieldName));
            return method.getReturnType() == Date.class;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }

    public static List<String> getAllPermissionNames() {
        return Collections.emptyList();
    }

    public Model getModel() {
        return model;
    }


    public static boolean isModel(Class<?> clazz) {
        return clazz.getName().contains(BASE_MODEL_PACKAGE);
    }
}
