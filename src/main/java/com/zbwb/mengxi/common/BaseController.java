package com.zbwb.mengxi.common;

import com.google.common.collect.Lists;
import com.zbwb.mengxi.common.core.FormField;
import com.zbwb.mengxi.common.core.IndexPage;
import com.zbwb.mengxi.common.core.Operation;
import com.zbwb.mengxi.common.em.SearchType;
import com.zbwb.mengxi.common.system.DataDomain;
import com.zbwb.mengxi.common.system.service.PermissionService;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Collections;
import java.util.Date;
import java.util.List;


@Controller
@RequestMapping("/private/{modelName}")
public abstract class BaseController<T extends DataDomain> {


    private static final String FILTER_PARAM_SEPARATOR = ";";

    private CommonDao commonDao;

    @Resource
    private PermissionService permissionService;

    private static final ThreadLocal<ModelParser> modelParserThreadLocal = new ThreadLocal<>();


    @Autowired
    public BaseController(CommonDao commonDao) {
        this.commonDao = commonDao;

    }

    @PostConstruct
    public void init() {

    }

    @GetMapping
    public String requestList(
            Model model,
            @PathVariable String modelName,
            @RequestParam(required = false, defaultValue = "1") int pageNo,
            @RequestParam(required = false) String queryParams) {


        final ModelParser modelParser = new ModelParser(modelName);
        modelParserThreadLocal.set(modelParser);
        Page<Object> objectPage = commonDao.find(pageNo, byParam(modelParser.getClazz(), queryParams));
        IndexPage indexPage = modelParser.getIndexPage(objectPage, null);
        model.addAttribute("title", modelParser.getModel().title());
        model.addAttribute("searchFields", indexPage.getSearchField());
        model.addAttribute("pageData", indexPage.getPage());
        model.addAttribute("headers", indexPage.getHeaders());
        model.addAttribute("tabOperations", Operation.tabOperations());
        model.addAttribute("listItemOperations", Operation.listItemOperations());
        modelParserThreadLocal.remove();
        return "list";
    }

    private DetachedCriteria byParam(Class<?> clazz, String queryParams) {
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(clazz)
                .addOrder(Order.desc("createDate"));
        for (QueryParam queryParam : queryParamsOf(queryParams)) {
            handleQueryParam(queryParam, detachedCriteria);
        }
        return detachedCriteria;
    }

    private static final String PATH_SEPARATOR = ".";

    private static void handleQueryParam(QueryParam queryParam,
                                         DetachedCriteria detachedCriteria) {
        String path = queryParam.getPath();
        int splitIndex = path.indexOf(PATH_SEPARATOR);
        if (splitIndex != -1) {
            String name = path.substring(0, splitIndex);
            detachedCriteria.createAlias(name, name);
            handleQueryParam(queryParam, detachedCriteria);
        }
        else {
            Criterion byQueryParam = createByQueryParam(queryParam);
            if (byQueryParam != null) {
                detachedCriteria.add(byQueryParam);
            }
        }
    }

    private static Criterion createByQueryParam(QueryParam queryParam) {
        switch (queryParam.getSearchType()) {
            case EQ: return Restrictions.eq(queryParam.getPath(), queryParam.getValue());
            case GT: {
                if (isNumber(queryParam.getValue())) {
                    Integer value = Integer.valueOf(queryParam.getValue());
                    return Restrictions.gt(queryParam.getPath(), value);
                }
            }
            case LT: {
                if (isNumber(queryParam.getValue())) {
                    Long value = Long.valueOf(queryParam.getValue());
                    return Restrictions.lt(queryParam.getPath(), value);
                }
            }
            case GE: {
                if (modelParserThreadLocal.get().isDate(queryParam.getPath())) {
                    return Restrictions.ge(queryParam.getPath(), new Date(Long.parseLong(queryParam.getValue())));
                }
                if (isNumber(queryParam.getValue())) {
                    Long value = Long.valueOf(queryParam.getValue());
                    return Restrictions.ge(queryParam.getPath(), value);
                }
                return null;
            }
            case LE: {
                if (modelParserThreadLocal.get().isDate(queryParam.getPath())) {
                    return Restrictions.le(queryParam.getPath(), new Date(Long.parseLong(queryParam.getValue())));
                }
                if (isNumber(queryParam.getValue())) {
                    Integer value = Integer.valueOf(queryParam.getValue());
                    return Restrictions.le(queryParam.getPath(), value);
                }

                return null;
            }
            case LIKE: return Restrictions.like(queryParam.getPath(), '%' + queryParam.getValue() + '%');

            default: return null;
        }
    }

    private static boolean isNumber(String value) {
        return value.matches("\\d+");
    }

    private static List<QueryParam> queryParamsOf(String queryParams) {
        if (StringUtils.isEmptyOrWhitespace(queryParams)) {
            return Collections.emptyList();
        }
        List<QueryParam> queryParamGroup = Lists.newArrayList();
        for (String condition : queryParams.split(FILTER_PARAM_SEPARATOR)) {
            QueryParam queryParam = queryParamOf(condition);
            if (queryParam != null) {
                queryParamGroup.add(queryParam);
            }
        }
        return queryParamGroup;
    }

    private static QueryParam queryParamOf(String condition) {
        SearchType searchType = findSearchType(condition);
        if (searchType == null) {
            return null;
        }
        int index = condition.indexOf(searchType.name());
        String value = condition.substring(index + searchType.name().length());
        if(StringUtils.isEmptyOrWhitespace(value)) {
            return null;
        }
        final String path = condition.substring(0, index);
        return new QueryParam(path, searchType, value);
    }

    private static SearchType findSearchType(String condition) {
        for (SearchType searchType : SearchType.values()) {
            if (condition.contains(searchType.name())) {
                return searchType;
            }
        }
        return null;
    }

    @PostMapping
    @Transactional
    public String add(@PathVariable String modelName,
                      T t) {
        if (isNone(t.getId())) {
            t.setId(null);
        }
        commonDao.save(t);
        return "redirect:/" + modelName;
    }

    private boolean isNone(String id) {
        return id.equals("none");
    }

    @GetMapping("/form/{id}")
    public String toEdit(
            @PathVariable String modelName,
            @PathVariable String id,
            Model model) {

        ModelParser parser = new ModelParser(modelName);
        Object o = null;
        if (!isNone(id)) {
            o = commonDao.get(parser.getClazz(), id);
            model.addAttribute("title", parser.getModel().title());
            model.addAttribute("data", o);
        }
        List<FormField> formFields = parser.getFormPage(o);
        model.addAttribute("formFields", formFields);
        return "form";
    }

    @GetMapping("/{id}")
    public String detail(
            @PathVariable String modelName,
            @PathVariable String id,
            Model model) {

        ModelParser parser = new ModelParser(modelName);
        Object o = commonDao.get(parser.getClazz(), id);
        model.addAttribute("title", parser.getModel().title());
        List<FormField> formFields = parser.getFormPage(o);
        model.addAttribute("formFields", formFields);
        return "detail";
    }


    @DeleteMapping("/{id}")
    @ResponseBody
    @Transactional
    public boolean delete(
            @PathVariable String modelName,
            @PathVariable String id) {
        Object o = commonDao.get(ModelParser.model2Class(modelName), id);
        if (o != null) {
            commonDao.delete(o);
            return true;
        }
        return false;
    }

}
