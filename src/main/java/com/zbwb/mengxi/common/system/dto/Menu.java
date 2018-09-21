package com.zbwb.mengxi.common.system.dto;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.system.entity.Permission;
import com.zbwb.mengxi.common.system.entity.Role;
import com.zbwb.mengxi.common.system.entity.User;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Menu {

    private final String modelName;
    private final String name;
    private final List<Menu> children;

    public Menu(String modelName, String name, List<Menu> children) {
        this.modelName = modelName;
        this.name = name;
        this.children = children;
    }

    public Menu(String modelName, String name) {
        this.modelName = modelName;
        this.name = name;
        this.children = Lists.newArrayList();
    }

    public String getModelName() {
        return modelName;
    }

    public String getName() {
        return name;
    }

    public List<Menu> getChildren() {
        return children;
    }

    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    private static final Pattern INDEX_PATTERN = Pattern.compile(".*:index");

    public static List<Menu> menusOf(User user) {
        List<Menu> menus = Lists.newArrayList();
        for (Role role : user.getRoles()) {
            for (Permission permission : role.getPermissions()) {
                Matcher matcher = INDEX_PATTERN.matcher(permission.getName());
                if (matcher.find()) {
//                    menus.add(new Menu())
                }
            }
        }
        return menus;
    }
}
