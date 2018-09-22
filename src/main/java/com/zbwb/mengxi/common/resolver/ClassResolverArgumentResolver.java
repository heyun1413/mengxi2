package com.zbwb.mengxi.common.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * @author sharpron
 */
@Component
public class ClassResolverArgumentResolver implements HandlerMethodArgumentResolver {


    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().isAssignableFrom(ClassResolver.class);
    }

    @Nullable
    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  @Nullable ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  @Nullable WebDataBinderFactory binderFactory) {

        return new DefaultClassResolver(parameter, mavContainer, webRequest, binderFactory);
    }
}
