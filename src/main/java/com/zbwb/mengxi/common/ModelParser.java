package com.zbwb.mengxi.common;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.anno.Show;
import com.zbwb.mengxi.common.anno.Shows;
import com.zbwb.mengxi.common.domain.MethodAnnotation;
import com.zbwb.mengxi.common.domain.ModelBean;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.lang.reflect.Method;
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
        final List<MethodAnnotation> result = Lists.newArrayList();
        for (Method method : clazz.getMethods()) {
            Shows shows = method.getAnnotation(Shows.class);
            if (shows != null) {
                for (Show show : shows.value()) {
                    result.add(new MethodAnnotation(show, method.getName(), method.getReturnType()));
                }
            }
            Show show = method.getAnnotation(Show.class);
            if (show != null) {
                result.add(new MethodAnnotation(show, method.getName(), method.getReturnType()));
            }
        }
        return new ModelBean(clazz, model, result);
    }

}
