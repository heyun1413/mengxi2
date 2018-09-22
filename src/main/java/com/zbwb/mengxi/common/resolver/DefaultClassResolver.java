package com.zbwb.mengxi.common.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.annotation.ModelFactory;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.mvc.method.annotation.ExtendedServletRequestDataBinder;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * @author sharpron
 * @date 2018/9/21
 * @since 1.0
 */
class DefaultClassResolver implements ClassResolver {

    private final MethodParameter parameter;

    private final ModelAndViewContainer mavContainer;

    private final NativeWebRequest webRequest;

    private final WebDataBinderFactory binderFactory;

    DefaultClassResolver(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
                  NativeWebRequest webRequest,
                  WebDataBinderFactory binderFactory) {
        this.parameter = parameter;
        this.mavContainer = mavContainer;
        this.webRequest = webRequest;
        this.binderFactory = binderFactory;
    }


    @Override
    public Object resolve(Class<?> clazz) {
        String name = ModelFactory.getNameForParameter(parameter);
        try {
            final Object object = ModelUtils.parse(Objects.requireNonNull(clazz), name, binderFactory, webRequest);
            WebDataBinder binder = binderFactory.createBinder(webRequest, object, name);
            if (binder.getTarget() != null) {
                if (!mavContainer.isBindingDisabled(name)) {
                    ((ExtendedServletRequestDataBinder) binder).bind((HttpServletRequest) webRequest.getNativeRequest());
                }
            }
            return object;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
