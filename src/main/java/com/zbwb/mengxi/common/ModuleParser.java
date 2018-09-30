package com.zbwb.mengxi.common;

import com.google.common.collect.Maps;
import com.zbwb.mengxi.common.anno.Module;
import com.zbwb.mengxi.common.domain.ModuleBean;
import com.zbwb.mengxi.common.model.ModelBean;
import com.zbwb.mengxi.common.util.PackageUtils;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;

/**
 * @author sharpron
 * @date 2018/9/22
 * @since 1.0
 */
@Component
public final class ModuleParser {

    private static final Map<String, ModuleBean> MODULE_CACHE = Maps.newHashMap();
    private static final String PACKAGE_SEPARATOR = ".";
    private static final int PACKAGE_SEPARATOR_LENGTH = PACKAGE_SEPARATOR.length();


    ModuleBean parse(String packageName, Collection<ModelBean> modelBeans) {
        ModuleBean topModule = new ModuleBean(packageName, "top");
        for (ModelBean modelBean : modelBeans) {
            String name = modelBean.getType().getPackage().getName();
            if (name.equals(packageName)) {
                topModule.addModel(modelBean);
            }
            else {
                String path = name.substring(name.indexOf(packageName) + packageName.length() + PACKAGE_SEPARATOR_LENGTH);
                loadModules(packageName, path, topModule, modelBean);
            }
        }
        return topModule;
    }

    private void loadModules(String basePackageName, String path, ModuleBean parentModule, ModelBean modelBean) {

        int dotIndex = path.indexOf(PACKAGE_SEPARATOR);

        String currentPackageName = path.contains(PACKAGE_SEPARATOR) ? path.substring(0, dotIndex) : path;

        String fullPackageName = basePackageName + PACKAGE_SEPARATOR + currentPackageName;

        ModuleBean module = getModuleBean(fullPackageName);
        if (module != null) {
            if (!parentModule.contain(module)) {
                parentModule.addSubModule(module);
            }
            if (path.contains(PACKAGE_SEPARATOR)) {
                loadModules(fullPackageName, path.substring(dotIndex + PACKAGE_SEPARATOR_LENGTH), module, modelBean);
            }
        }
        else {
            parentModule.addModel(modelBean);
        }
    }



    private static ModuleBean getModuleBean(String packageName) {
        Module moduleFromPackage = PackageUtils.getModuleFromPackage(packageName);
        if (moduleFromPackage == null) {
            return null;
        }
        if (MODULE_CACHE.containsKey(packageName)) {
            return MODULE_CACHE.get(packageName);
        }
        ModuleBean moduleBean = new ModuleBean(packageName, moduleFromPackage.name());
        MODULE_CACHE.put(packageName, moduleBean);
        return moduleBean;
    }

}
