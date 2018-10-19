package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.anno.Permission;
import org.apache.shiro.SecurityUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PermissionChecker implements HandlerInterceptor {

    private static final String PERMISSION_CHAR = ":";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            if (handlerMethod.getMethodAnnotation(Permission.class) != null) {
//                SecurityUtils.getSubject().checkPermission(getPermissionTag(request, handlerMethod));
                return true;
            }
        }
        return true;
    }

    private static String getPermissionTag(HttpServletRequest request, HandlerMethod handlerMethod) {
        String permissionTag = request.getRequestURI().replace("/", PERMISSION_CHAR);
        if (!permissionTag.endsWith(PERMISSION_CHAR)) {
            permissionTag += PERMISSION_CHAR;
        }
        return permissionTag + handlerMethod.getMethod().getName();
    }
}
