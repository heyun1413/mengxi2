package com.zbwb.mengxi.common;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.anno.Shows;
import com.zbwb.mengxi.common.domain.*;
import com.zbwb.mengxi.common.em.InputType;
import com.zbwb.mengxi.common.util.ClassUtils;
import com.zbwb.mengxi.common.util.MethodUtils;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

/**
 * @author sharpron
 * @date 2018/9/22
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
        Model model = clazz.getAnnotation(Model.class);
        if (model == null) {
            throw new RuntimeException("clazz is not a model");
        }
        final List<ShowBean> showBeans = Lists.newArrayList();
        final List<InputBean> inputBeans = Lists.newArrayList();
        for (Method method : clazz.getMethods()) {
            Show show = method.getAnnotation(Show.class);
            Shows shows = method.getAnnotation(Shows.class);

            final List<Show> merge = merge(show, shows);
            if (!merge.isEmpty()) {
                Show firstShow = merge.get(0);
                inputBeans.add(getInputBean(firstShow, method.getReturnType(), method.getName()));
            }
            for (Show temp : merge) {
                if (temp.inList()) {
                    showBeans.add(getShowBean(temp, method.getName()));
                }
            }
        }
        return new ModelBean(clazz, model, showBeans, inputBeans);
    }

    private List<Show> merge(Show show, Shows shows) {
        List<Show> result = Lists.newArrayList();
        if (show != null) {
            result.add(show);
        }
        if (shows != null) {
            result.addAll(Arrays.asList(shows.value()));
        }
        return result;
    }

    private ShowBean getShowBean(Show show, String methodName) {
        return new ShowBean() {
            @Override
            public String getName() {
                return show.name();
            }

            @Override
            public String getPath() {
                return fullPath(MethodUtils.methodName2FieldName(methodName), show.path());
            }
        };
    }

    private InputBean getInputBean(Show show, Class<?> returnType, String methodName) {
        final String fieldName = MethodUtils.methodName2FieldName(methodName);
        InputType inputType = InputType.valueOf(returnType);
        return new InputBean() {

            @Override
            public InputType getType() {
                return inputType;
            }

            @Override
            public Class<?> getReturnType() {
                return returnType;
            }

            @Override
            public String getName() {
                return show.name();
            }

            @Override
            public String getPath() {
                return (getType() == InputType.OPTION) ?
                        fullPath(fieldName, ClassUtils.getIdFieldName(returnType)) :
                        fieldName;
            }
        };
    }

    private static String fullPath(String basePath, String path) {
        return String.format("%s.%s", basePath, path);
    }

}
