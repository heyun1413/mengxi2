package com.zbwb.mengxi;

import com.zbwb.mengxi.common.resolver.ClassResolverArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;
import java.util.List;

@Configuration
public class MyWebAppConfigurer implements WebMvcConfigurer {

    @Resource
    private ClassResolverArgumentResolver classResolver;



    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(classResolver);
    }
}