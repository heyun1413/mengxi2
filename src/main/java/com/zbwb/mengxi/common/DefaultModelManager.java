package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.domain.Menu;
import com.zbwb.mengxi.common.domain.ModuleBean;
import com.zbwb.mengxi.common.exception.DuplicateModelNameException;
import com.zbwb.mengxi.common.exception.ModelNotFoundException;
import com.zbwb.mengxi.common.model.ModelBean;
import com.zbwb.mengxi.common.model.ModelParser;
import com.zbwb.mengxi.common.util.PackageUtils;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author sharpron
 *
 */
@Component
public class DefaultModelManager implements ModelManager {


    private static final String PACKAGE = "com.zbwb.mengxi.module";

    private static final Map<String, ModelBean> MODEL_BEAN_MAP = new LinkedHashMap<>();

    private List<Menu> allMenus;

    @Resource
    private ModelParser modelParser;

    @Resource
    private ModuleParser moduleParser;


    @PostConstruct
    public void init() {
        loadPackage(PACKAGE);
    }

    private void loadPackage(String packageName) {
        Set<Class<?>> classes = PackageUtils.getClasses(packageName);
        for (Class<?> aClass : classes) {
            final ModelBean modelBean = modelParser.parse(aClass);
            if (modelBean == null) {
                continue;
            }
            if (MODEL_BEAN_MAP.containsKey(modelBean.getName())) {
                throw new DuplicateModelNameException("please use @ModelBean attr name");
            }
            MODEL_BEAN_MAP.put(modelBean.getName(), modelBean);
        }


        ModuleBean topModule = moduleParser.parse(packageName, MODEL_BEAN_MAP.values());

        allMenus = topModule.toMenus();

    }

    @Override
    public ModelBean get(String modelName) {
        if (MODEL_BEAN_MAP.containsKey(modelName)) {
            return MODEL_BEAN_MAP.get(modelName);
        }
        throw new ModelNotFoundException(String.format("%s module not found", modelName));
    }


    @Override
    public List<Menu> allMenu() {
        return this.allMenus;
    }

}
