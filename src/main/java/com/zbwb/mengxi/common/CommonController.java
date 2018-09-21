package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.system.entity.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.thymeleaf.util.StringUtils;

import javax.annotation.Resource;

@Controller
@RequestMapping("/common")
public class CommonController {

    @Resource
    private ModelManager modelManager;

    @GetMapping("/login")
    public String toLogin() {
        return "login";
    }

    @GetMapping("/logout")
    public String logout() {
        SecurityUtils.getSubject().logout();
        return "redirect:/common/login";
    }

    @PostMapping(value = "/authenticate")
    public String login(User user, Model model) {
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

    @GetMapping("/index")
    public String toIndex(Model model) {
        model.addAttribute("menus", modelManager.allMenus());
        return "index";
    }
}
