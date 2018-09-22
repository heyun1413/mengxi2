package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.domain.FormField;
import com.zbwb.mengxi.common.domain.IndexPage;
import com.zbwb.mengxi.common.domain.ModelBean;
import com.zbwb.mengxi.common.domain.Page;
import com.zbwb.mengxi.common.em.Operation;
import com.zbwb.mengxi.common.parser.QueryParamParser;
import com.zbwb.mengxi.common.resolver.ClassResolver;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.lang.reflect.Method;
import java.util.List;

/**
 * @author sharpron
 * model控制器
 */
@Controller
@RequestMapping("/private/{modelName}")
public class ModelController {





    @Resource
    private CommonDao commonDao;

    @Resource
    private ModelManager modelManager;

    @Resource
    private QueryParamParser queryParamParser;


    @PostConstruct
    public final void init() {
//        for (ModelBean modelBean : modelManager.allModel()) {
//            Set<Permission> permissions = Permission.commonPermissionsOf(modelBean);
//            for (Permission permission : permissions) {
//                permissionService.create(permission);
//            }
//        }

        for (Method method : getClass().getMethods()) {
            RequestMapping annotation = method.getAnnotation(RequestMapping.class);
            if (annotation != null) {

            }
        }
    }

    /**
     * 首页
     * @param model 数据容器
     * @param modelName 模型名称
     * @param pageNo 页号
     * @param queryParams 查询参数
     * @return 首页
     */
    @GetMapping
    public String index(
            Model model,
            @PathVariable String modelName,
            @RequestParam(required = false, defaultValue = "1") int pageNo,
            @RequestParam(required = false) String queryParams) {


        final ModelBean modelBean = modelManager.get(modelName);
        final DetachedCriteria detachedCriteria = CommonDao.detachedCriteria(modelBean.getType(), queryParamParser.parse(queryParams));
        Page<Object> objectPage = commonDao.find(pageNo, detachedCriteria);
        IndexPage indexPage = modelBean.getIndexPage(objectPage, null);
        model.addAttribute("title", modelBean.getModel().title());
        model.addAttribute("searchFields", indexPage.getSearchField());
        model.addAttribute("pageData", indexPage.getPage());
        model.addAttribute("headers", indexPage.getHeaders());
        model.addAttribute("tabOperations", Operation.tabOperations());
        model.addAttribute("listItemOperations", Operation.listItemOperations());
        return "list";
    }




    /**
     * 保存实体
     * @param modelName 模型名称
     * @param classResolver 自动注入类解析器，将传入的class解析成对象，同时将请求中的数据绑定到该对象上
     * @return 跳转到该模型对应的首页
     */
    @PostMapping
    @Transactional(rollbackFor = Exception.class)
    public String save(@PathVariable String modelName,
                      ClassResolver classResolver) {

        Object object = classResolver.resolve(modelManager.get(modelName).getType());
        BaseEntity entity = (BaseEntity) object;
        if (isNone(entity.getId())) {
            entity.setId(null);
        }
        commonDao.save(object);
        return "redirect:/private/" + modelName;
    }

    /**
     * 判断id是否为none值
     * @param id id
     * @return 如果是none返回true，否则返回false
     */
    private boolean isNone(String id) {
        return id.equals("none");
    }


    /**
     * 编辑模型对应的实体
     * @param modelName 模型名称
     * @param id 模型对应的实体id
     * @param model 模型
     * @return 编辑页面
     */
    @GetMapping("/form/{id}")
    public String edit(
            @PathVariable String modelName,
            @PathVariable String id,
            Model model) {

        ModelBean modelBean = modelManager.get(modelName);

        Object o = null;
        if (!isNone(id)) {
            o = commonDao.get(modelBean.getType(), id);
            model.addAttribute("title", modelBean.getModel().title());
            model.addAttribute("data", o);
        }
        List<FormField> formFields = modelBean.getFormPage(o);
        model.addAttribute("formFields", formFields);
        return "form";
    }

    /**
     * 查看详情
     * @param modelName 模型名称
     * @param id 模型对应的实体id
     * @param model 模型
     * @return 详情页面
     */
    @GetMapping("/{id}")
    public String detail(
            @PathVariable String modelName,
            @PathVariable String id,
            Model model) {

        ModelBean modelBean = modelManager.get(modelName);
        Object o = commonDao.get(modelBean.getType(), id);
        model.addAttribute("title", modelBean.getModel().title());
        List<FormField> formFields = modelBean.getFormPage(o);
        model.addAttribute("formFields", formFields);
        return "detail";
    }

    /**
     * 通过id删除模型对应的实体
     * @param modelName 模型名称
     * @param id 模型对应的实体id
     * @return 删除成功返回true， 删除失败返回false
     */
    @DeleteMapping("/{id}")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(
            @PathVariable String modelName,
            @PathVariable String id) {
        Object o = commonDao.get(modelManager.get(modelName).getType(), id);
        if (o != null) {
            commonDao.delete(o);
            return true;
        }
        return false;
    }

}
