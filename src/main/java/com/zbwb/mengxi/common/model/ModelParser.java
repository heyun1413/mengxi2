package com.zbwb.mengxi.common.model;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.anno.ShowOverride;
import com.zbwb.mengxi.common.anno.ShowOverrides;
import com.zbwb.mengxi.common.util.MethodUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.validation.constraints.NotNull;
import java.lang.reflect.Method;
import java.util.List;

/**
 * @author sharpron
 * @since 1.0
 */
@Component
public class ModelParser {

    /**
     * 解析class
     * @param clazz class
     * @return 解析后的东西
     */
    public @NotNull ModelBean parse(Class<?> clazz) {
        Model model =
                clazz.getAnnotation(Model.class);
        if (model == null) {
            return null;
        }

        final List<Bean> beans = Lists.newArrayList();
        for (Method method : clazz.getMethods()) {
            final Class<?> returnType = method.getReturnType();
            final Show show = method.getAnnotation(Show.class);
            if (show != null) {
                final String path = fullPath(method, null);
                if (show.atList() && show.atForm()) {
                    beans.add(new AnnotationShowBean(show, returnType, path));
                }
                else if (show.atList()) {
                    beans.add(new ShowBeanImpl(path, show.title()));
                }
                else if (show.atForm()) {
                    beans.add(new InputBeanImpl(returnType, path, show.title()));
                }
                continue;
            }
            ShowOverride showOverride = method.getAnnotation(ShowOverride.class);
            if (showOverride != null) {
                beans.add(new AnnotationShowBean(showOverride.show(),
                        returnType,  fullPath(method, showOverride.path())));
                continue;
            }
            ShowOverrides showOverrides = method.getAnnotation(ShowOverrides.class);
            if (showOverrides != null) {
                for (ShowOverride override : showOverrides.value()) {
                    beans.add(new ShowBeanImpl(fullPath(method, override.path()), override.show().title()));
                }
            }
        }
        return new DefaultModel(model, clazz, beans);
    }

    private static String fullPath(Method method, String path) {
        String fieldName = MethodUtils.methodName2FieldName(method.getName());
        if (StringUtils.isEmpty(path)) {
            return fieldName;
        }
        return String.format("%s.%s", fieldName, path);
    }
}
