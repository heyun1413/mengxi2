package com.zbwb.mengxi.common.resolver;

import com.zbwb.mengxi.Mengxi2Application;
import com.zbwb.mengxi.common.ModelManager;
import com.zbwb.mengxi.common.anno.ModelParameter;
import com.zbwb.mengxi.common.parser.ModelParser;
import org.springframework.core.MethodParameter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.annotation.ModelFactory;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.mvc.method.annotation.ExtendedServletRequestDataBinder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Component
public class MapArgumentResolver implements HandlerMethodArgumentResolver {

    @Resource
    private ModelParser modelParser;

    @Resource
    private ModelManager modelManager;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(ModelParameter.class);
    }

    @Nullable
    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  @Nullable ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  @Nullable WebDataBinderFactory binderFactory) throws Exception {

        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();

        final String requestURI = request.getRequestURI();
        final String privatePath = Mengxi2Application.PRIVATE_PATH;
        int index = requestURI.indexOf(privatePath);
        if (index == -1) {
            throw new RuntimeException("@ModelParameter must be used model.* package");
        }
        index += privatePath.length();
        int endIndex = requestURI.endsWith("/") ? requestURI.length() - 1 : requestURI.length();
        String modelName = requestURI.substring(index + 1, endIndex);
        String name = ModelFactory.getNameForParameter(parameter);
        Object attribute = modelParser.parse(modelManager.get(modelName).getType(), name, binderFactory, webRequest);

        WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);
        if (binder.getTarget() != null) {
            if (!mavContainer.isBindingDisabled(name)) {
                ((ExtendedServletRequestDataBinder) binder).bind(request);
            }
        }
        return attribute;
    }
}
