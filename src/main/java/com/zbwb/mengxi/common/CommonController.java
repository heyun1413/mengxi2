package com.zbwb.mengxi.common;

import com.zbwb.mengxi.module.system.entity.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.util.StringUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.UUID;

/**
 * @author sharpron
 */
@Controller
@RequestMapping("/common")
public class CommonController {

    private static final String SERVER_IMAGE_ADDRESS = "/upload/image/";

    private static final String SERVER_FILE_ADDRESS = "/upload/file/";

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

    @PostMapping("/uploadImage")
    @ResponseBody
    public String uploadImage(MultipartFile file, HttpServletRequest request) {
        return upload(SERVER_IMAGE_ADDRESS, file, request);
    }

    @PostMapping("/uploadFile")
    @ResponseBody
    public String uploadFile(MultipartFile file, HttpServletRequest request) {
        return upload(SERVER_FILE_ADDRESS, file, request);
    }

    public String upload(String prefixPath, MultipartFile file, HttpServletRequest request) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String realPath = request.getServletContext().getRealPath("/");
        String pathByDate = createPathByDate();

        File path = new File(realPath + prefixPath + pathByDate);
        if (!path.exists()) {
            path.mkdirs();
        }
        final String fileName = getFileName(file);
        File newFile = new File(path.getPath() + File.separator + fileName);
        try {
            file.transferTo(newFile);
        } catch (IOException e) {
            throw new RuntimeException("upload file failed");
        }
        return prefixPath + pathByDate +  fileName;
    }

    private static String getFileName(MultipartFile multipartFile) {
        String originalFilename = multipartFile.getOriginalFilename();
        assert originalFilename != null;
        int i = originalFilename.lastIndexOf(".");
        String suffix = originalFilename.substring(i);
        return UUID.randomUUID().toString() + suffix;
    }

    private static String createPathByDate() {
        Calendar instance = Calendar.getInstance();
        int year = instance.get(Calendar.YEAR);
        int month = instance.get(Calendar.MONTH) + 1;
        int day = instance.get(Calendar.DAY_OF_MONTH);
        return String.format("%d/%02d/%d/", year, month, day);
    }

}
