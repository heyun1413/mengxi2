package com.zbwb.mengxi.common;

import com.zbwb.mengxi.module.system.entity.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.thymeleaf.util.StringUtils;

import javax.annotation.Resource;

/**
 * @author sharpron
 */
@Controller
@RequestMapping("/common")
public class CommonController {

    @Resource
    private ModelManager modelManager;

    /**
     * @return 登录页面
     */
    @GetMapping("/login")
    public String toLogin() {
        return "login";
    }

    /**
     * 注销登录
     * @return 登录页面
     */
    @GetMapping("/logout")
    public String logout() {
        SecurityUtils.getSubject().logout();
        return "redirect:/common/login";
    }

    /**
     * 认证用户信息
     * @param user 用户信息
     * @param model module
     * @return 认证成功到首页，否则继续登录
     */
    @PostMapping(value = "/authenticate")
    public String authenticate(User user, Model model) {
        if (StringUtils.isEmptyOrWhitespace(user.getUsername())) {
            model.addAttribute("info", "用户名为空");
            return toLogin();
        }
        if (StringUtils.isEmptyOrWhitespace(user.getPassword())) {
            model.addAttribute("info", "用户密码为空");
            return toLogin();
        }
        UsernamePasswordToken token = new UsernamePasswordToken(user.getUsername(), user.getPassword());
        try {
            SecurityUtils.getSubject().login(token);
            return "redirect:/common/index";
        } catch (AuthenticationException e) {
            model.addAttribute("info", "用户名或密码错误");
            return toLogin();
        }
    }

    /**
     * 首页
     * @param model module
     * @return 首页
     */
    @GetMapping("/index")
    public String toIndex(Model model) {
        model.addAttribute("menus", modelManager.allMenu());
        return "index";
    }

    @GetMapping("/{a:[a-z]+}")
    public String test(@PathVariable(required = false) String a) {
        return "index";
    }
}
