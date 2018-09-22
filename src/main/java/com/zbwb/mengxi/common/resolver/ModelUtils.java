package com.zbwb.mengxi.common.resolver;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.TypeMismatchException;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.MethodParameter;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;

import java.beans.ConstructorProperties;
import java.lang.reflect.Constructor;
import java.util.Optional;

/**
 * @author sharpron
 */
class ModelUtils {

    private ModelUtils() {}

    private static final ParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();


    @Nullable
    static Object parse(Class<?> clazz,
                      String functionName,
                      WebDataBinderFactory binderFactory,
                      NativeWebRequest webRequest) throws Exception {
        Constructor<?> ctor = BeanUtils.findPrimaryConstructor(clazz);
        if (ctor == null) {
            Constructor<?>[] ctors = clazz.getConstructors();
            if (ctors.length == 1) {
                ctor = ctors[0];
            }
            else {
                try {
                    ctor = clazz.getDeclaredConstructor();
                }
                catch (NoSuchMethodException ex) {
                    throw new IllegalStateException("No primary or default constructor found for " + clazz, ex);
                }
            }
        }
        return constructAttribute(ctor, functionName, binderFactory, webRequest);
    }


    private static Object constructAttribute(Constructor<?> ctor, String attributeName,
                                        WebDataBinderFactory binderFactory, NativeWebRequest webRequest) throws Exception {

        if (ctor.getParameterCount() == 0) {
            // A single default constructor -> clearly a standard JavaBeans arrangement.
            return BeanUtils.instantiateClass(ctor);
        }

        // A single data class constructor -> resolve constructor arguments from request parameters.
        ConstructorProperties cp = ctor.getAnnotation(ConstructorProperties.class);
        String[] paramNames = (cp != null ? cp.value() : parameterNameDiscoverer.getParameterNames(ctor));
        Assert.state(paramNames != null, () -> "Cannot resolve parameter names for constructor " + ctor);
        Class<?>[] paramTypes = ctor.getParameterTypes();
        Assert.state(paramNames.length == paramTypes.length,
                () -> "Invalid number of parameter names: " + paramNames.length + " for constructor " + ctor);

        Object[] args = new Object[paramTypes.length];
        WebDataBinder binder = binderFactory.createBinder(webRequest, null, attributeName);
        String fieldDefaultPrefix = binder.getFieldDefaultPrefix();
        String fieldMarkerPrefix = binder.getFieldMarkerPrefix();
        boolean bindingFailure = false;

        for (int i = 0; i < paramNames.length; i++) {
            String paramName = paramNames[i];
            Class<?> paramType = paramTypes[i];
            Object value = webRequest.getParameterValues(paramName);
            if (value == null) {
                if (fieldDefaultPrefix != null) {
                    value = webRequest.getParameter(fieldDefaultPrefix + paramName);
                }
                if (value == null && fieldMarkerPrefix != null) {
                    if (webRequest.getParameter(fieldMarkerPrefix + paramName) != null) {
                        value = binder.getEmptyValue(paramType);
                    }
                }
            }
            try {
                MethodParameter methodParam = new MethodParameter(ctor, i);
                if (value == null && methodParam.isOptional()) {
                    args[i] = (methodParam.getParameterType() == Optional.class ? Optional.empty() : null);
                }
                else {
                    args[i] = binder.convertIfNecessary(value, paramType, methodParam);
                }
            }
            catch (TypeMismatchException ex) {
                ex.initPropertyName(paramName);
                binder.getBindingErrorProcessor().processPropertyAccessException(ex, binder.getBindingResult());
                bindingFailure = true;
                args[i] = value;
            }
        }

        if (bindingFailure) {
            BindingResult result = binder.getBindingResult();
            for (int i = 0; i < paramNames.length; i++) {
                result.recordFieldValue(paramNames[i], paramTypes[i], args[i]);
            }
            throw new BindException(result);
        }

        return BeanUtils.instantiateClass(ctor, args);
    }

}
