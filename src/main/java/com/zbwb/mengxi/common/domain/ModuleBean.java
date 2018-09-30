package com.zbwb.mengxi.common.domain;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.model.ModelBean;

import java.util.List;

/**
 * @author sharpron
 * @date 2018/9/22
 * @since 1.0
 */
public class ModuleBean {

    private final String packageName;

    private final String name;

    private final List<ModelBean> models;

    private final List<ModuleBean> subModules;

    public ModuleBean(String packageName, String name) {
        this.packageName = packageName;
        this.name = name;
        this.models = Lists.newArrayList();
        subModules = Lists.newArrayList();
    }

    public String getName() {
        return name;
    }

    public boolean contain(ModuleBean moduleBean) {
        return subModules.contains(moduleBean);
    }

    public void addSubModule(ModuleBean moduleBean) {
        subModules.add(moduleBean);
    }

    public void addModel(ModelBean modelBean) {
        models.add(modelBean);
    }

    public String getPackageName() {
        return packageName;
    }


    public List<Menu> toMenus() {
        Menu topMenu = new Menu(null, name);
        addChildMenu(topMenu);
        return topMenu.getChildren();
    }

    private void addChildMenu(Menu parentMenu) {
        for (ModelBean model : models) {
            parentMenu.addChild(model.toMenu());
        }
        for (ModuleBean subModule : subModules) {
            Menu menu = new Menu(null, subModule.name);
            parentMenu.addChild(menu);
            subModule.addChildMenu(menu);
        }
    }

}
