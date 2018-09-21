package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.anno.AuthorizeCheck;
import com.zbwb.mengxi.common.anno.ModelParameter;
import com.zbwb.mengxi.common.domain.*;
import com.zbwb.mengxi.common.em.Operation;
import com.zbwb.mengxi.common.exception.UnknownEntityException;
import com.zbwb.mengxi.common.parser.ModelParser;
import com.zbwb.mengxi.common.system.service.PermissionService;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("/private/{modelName}")
public abstract class BaseController<T extends DataDomain> {

    private static final String PATH_SEPARATOR = ".";



    private CommonDao commonDao;

    @Resource
    private ModelManager modelManager;

    @Resource
    private RequestMappingHandlerMapping handlerMapping;

    @Resource
    private PermissionService permissionService;

    @Resource
    private RequestMappingHandlerAdapter requestMappingHandlerAdapter;

    @Resource
    private ModelParser modelParser;




    @Autowired
    public BaseController(CommonDao commonDao) {
        this.commonDao = commonDao;
    }

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

//    @AuthorizeCheck("{modelName}:index")
    @GetMapping
    public String index(
            Model model,
            @PathVariable String modelName,
            @RequestParam(required = false, defaultValue = "1") int pageNo,
            @RequestParam(required = false) String queryParams) {


        final ModelBean modelBean = modelManager.get(modelName);
        if (modelBean == null) {
            throw new RuntimeException("404");
        }
        Page<Object> objectPage = commonDao.find(pageNo, parseParam(modelBean.getType(), queryParams));
        IndexPage indexPage = modelBean.getIndexPage(objectPage, null);
        model.addAttribute("title", modelBean.getModel().title());
        model.addAttribute("searchFields", indexPage.getSearchField());
        model.addAttribute("pageData", indexPage.getPage());
        model.addAttribute("headers", indexPage.getHeaders());
        model.addAttribute("tabOperations", Operation.tabOperations());
        model.addAttribute("listItemOperations", Operation.listItemOperations());
        return "list";
    }

    private static DetachedCriteria parseParam(Class<?> clazz, String queryParams) {
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(clazz)
                .addOrder(Order.desc("createDate"));
        for (QueryParam queryParam : QueryParam.parseParam(queryParams)) {
            handleQueryParam(clazz, queryParam, detachedCriteria);
        }
        return detachedCriteria;
    }

    private static void handleQueryParam(Class<?> clazz, QueryParam queryParam,
                                         DetachedCriteria detachedCriteria) {
        String path = queryParam.getPath();
        int splitIndex = path.indexOf(PATH_SEPARATOR);
        if (splitIndex != -1) {
            String name = path.substring(0, splitIndex);
            detachedCriteria.createAlias(name, name);
            handleQueryParam(clazz, queryParam, detachedCriteria);
        }
        else {
            Criterion byQueryParam = queryParam.getCriterion(clazz);
            if (byQueryParam != null) {
                detachedCriteria.add(byQueryParam);
            }
        }
    }


    @PostMapping
    @Transactional
    public String add(@PathVariable String modelName,
                      @ModelParameter("modelName") Object object) {
        if (!(object instanceof BaseEntity)) {
            throw new UnknownEntityException();
        }
        BaseEntity entity = (BaseEntity) object;
        if (isNone(entity.getId())) {
            entity.setId(null);
        }
        commonDao.save(object);
        return "redirect:/private/" + modelName;
    }

    private boolean isNone(String id) {
        return id.equals("none");
    }

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


    @DeleteMapping("/{id}")
    @ResponseBody
    @Transactional
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
