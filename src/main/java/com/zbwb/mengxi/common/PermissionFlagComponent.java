package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.anno.AuthorizeCheck;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.annotation.Resource;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PermissionFlagComponent {

    static final Pattern p = Pattern.compile("(?<=\\{)(\\S+)(?=\\})");

    @Resource
    private RequestMappingHandlerMapping handlerMapping;



    public String permissionOf(Method method, String requestURI, AuthorizeCheck auth) {
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = handlerMapping.getHandlerMethods();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            if (method.equals(entry.getValue().getMethod())) {
                String s = entry.getKey().getPatternsCondition().toString();

                String pattern = s.substring(1, s.length() - 1);
                Matcher matcher = p.matcher(pattern);

                String permissionFlag = null;
                while (matcher.find()) {
                    String key = "{" + matcher.group() + "}";
                    int index = pattern.indexOf(key);
                    String value = requestURI.substring(index, index + key.length() + 1);
                    permissionFlag = auth.value().replace(key, value);
                }
                return permissionFlag;
            }
        }
        return null;
    }


}
