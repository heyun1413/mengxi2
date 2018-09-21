package com.zbwb.mengxi.common.parser;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.ModelManager;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.domain.MethodAnnotation;
import com.zbwb.mengxi.common.domain.ModelBean;
import com.zbwb.mengxi.common.exception.DuplicateModelNameException;
import com.zbwb.mengxi.common.system.dto.Menu;
import com.zbwb.mengxi.common.util.PackageUtils;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import java.lang.reflect.Method;
import java.util.*;

@Component
public class DefaultModelManager implements ModelManager {

    private static final Map<String, ModelBean> MODEL_BEAN_MAP = new HashMap<>();
    private static final List<Menu> MENUS = new ArrayList<>();

    static {
        loadPackage("com.zbwb.mengxi.model");
        loadPackage("com.zbwb.mengxi.common.system.entity");
    }

    private static void loadPackage(String packageName) {
        Set<Class<?>> classes = PackageUtils.getClasses(packageName);
        for (Class<?> aClass : classes) {
            Model model = aClass.getAnnotation(Model.class);
            if (model == null) continue;
            final String modelName = getModelName(aClass, model);
            if (MODEL_BEAN_MAP.containsKey(modelName)) {
                throw new DuplicateModelNameException("please use @Model attr name");
            }
            MENUS.add(new Menu(modelName, model.title()));
            final List<MethodAnnotation> result = Lists.newArrayList();
            for (Method method : aClass.getMethods()) {
                Show show = method.getAnnotation(Show.class);
                if (show != null) {
                    result.add(new MethodAnnotation(show, method.getName(), method.getReturnType()));
                }
            }
            MODEL_BEAN_MAP.put(modelName, new ModelBean(aClass, model, result));
        }
    }

    private static String getModelName(Class<?> clazz, Model model) {
        if (!StringUtils.isEmptyOrWhitespace(model.name())) {
            return model.name();
        }
        return StringUtils.unCapitalize(clazz.getSimpleName());
    }

    @Override
    public ModelBean get(String modelName) {
        return MODEL_BEAN_MAP.get(modelName);
    }

    @Override
    public List<ModelBean> allModel() {
        return Lists.newArrayList(MODEL_BEAN_MAP.values());
    }

    @Override
    public List<Menu> allMenus() {
        return Lists.newArrayList(MENUS);
    }

}
