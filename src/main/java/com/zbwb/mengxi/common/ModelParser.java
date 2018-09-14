package com.zbwb.mengxi.common;

import com.esotericsoftware.reflectasm.MethodAccess;
import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.core.FormField;
import com.zbwb.mengxi.common.core.IndexPage;
import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.util.List;
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

    IndexPage getIndexPage(Page<Object> page) {
        List<MethodAnnotation> methodAnnotations = getMethodAnnotations();
        List<String> headers = methodAnnotations.stream()
                .filter((e) -> e.name != null)
                .map((e) -> e.name.value())
                .collect(Collectors.toList());
        page.setData(page.getData().stream()
                .map((e) -> convert(methodAnnotations, e))
                .collect(Collectors.toList()));

        return new IndexPage(headers, page);
    }

    List<FormField> getFormPage(Object o) {
        return getMethodAnnotations().stream()
                .filter((e) -> e.formInput != null)
                .map((e) -> new FormField(
                        e.name.value(),
                        o == null ? null : methodAccess.invoke(o, e.methodName).toString(),
                        StringUtils.uncapitalize(e.methodName.substring(3)),
                        e.formInput))
                .collect(Collectors.toList());
    }

    private List<MethodAnnotation> getMethodAnnotations() {
        List<MethodAnnotation> result = Lists.newArrayList();
        for (Method method : clazz.getMethods()) {
            Model.FormInput formInput = method.getAnnotation(Model.FormInput.class);
            Model.Name name = method.getAnnotation(Model.Name.class);
            Model.Show show = method.getAnnotation(Model.Show.class);
            if (name != null && formInput != null || show != null) {
                result.add(new MethodAnnotation(formInput, name, show, method.getName()));
            }
        }
        return result;
    }

    static class MethodAnnotation {
        final Model.FormInput formInput;
        final Model.Name name;
        final Model.Show show;
        final String methodName;

        MethodAnnotation(Model.FormInput formInput,
                         Model.Name name,
                         Model.Show show,
                         String methodName) {
            this.formInput = formInput;
            this.name = name;
            this.show = show;
            this.methodName = methodName;
        }
    }

    private List<String> convert(List<MethodAnnotation> methodAnnotations, Object o) {
        return methodAnnotations.stream().map(
                (methodAnnotation) ->
                methodAccess.invoke(o, methodAnnotation.methodName).toString())
                .collect(Collectors.toList());
    }

    Class<?> getClazz() {
        return clazz;
    }

    public Model getModel() {
        return model;
    }
}
