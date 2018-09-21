package com.zbwb.mengxi.common.interceptor;

import com.zbwb.mengxi.common.anno.AuthorizeCheck;
import com.zbwb.mengxi.common.util.ClassUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AuthCheckInterceptor extends HandlerInterceptorAdapter {


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        HandlerMethod methodHandler = (HandlerMethod) handler;

        AuthorizeCheck auth = methodHandler.getMethodAnnotation(AuthorizeCheck.class);
        if (auth != null) {
            String modelClassName = ClassUtils.getGenericType(methodHandler.getBeanType()).getName();
            String name =  modelClassName + ":" + methodHandler.getMethod().getName();
            SecurityUtils.getSubject().checkPermission(name);
        }
        return true;
    }

}