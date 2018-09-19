package com.zbwb.mengxi;

import com.zbwb.mengxi.common.realm.DefaultRealm;
import org.apache.shiro.cache.MemoryConstrainedCacheManager;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.mgt.DefaultSessionManager;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.LinkedHashMap;
import java.util.Map;

@SpringBootApplication
@EnableTransactionManagement
public class Mengxi2Application {

	public static void main(String[] args) {
	    SpringApplication.run(Mengxi2Application.class, args);
	}



	@Bean
	public SecurityManager securityManager(DefaultRealm defaultRealm) {
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setRealm(defaultRealm);
		// 自定义session管理 使用redis
		securityManager.setSessionManager(new DefaultSessionManager());
		// 自定义缓存实现 使用redis
		securityManager.setCacheManager(new MemoryConstrainedCacheManager());
		return securityManager;
	}




	@Bean
	public ShiroFilterFactoryBean shirFilter(SecurityManager securityManager) {
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);

		Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
		//注意过滤器配置顺序 不能颠倒
		//配置退出 过滤器,其中的具体的退出代码Shiro已经替我们实现了，登出后跳转配置的loginUrl
		filterChainDefinitionMap.put("/common/authenticate", "anon");
		filterChainDefinitionMap.put("/logout", "logout");
		// 配置不会被拦截的链接 顺序判断
		filterChainDefinitionMap.put("/static/**", "anon");
		filterChainDefinitionMap.put("/private/*", "authc");
		//配置shiro默认登录界面地址，前后端分离中登录界面跳转应由前端路由控制，后台仅返回json数据
		shiroFilterFactoryBean.setLoginUrl("/common/login");
		// 登录成功后要跳转的链接
//        shiroFilterFactoryBean.setSuccessUrl("/index");
		//未授权界面;
//        shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		return shiroFilterFactoryBean;
	}



}
