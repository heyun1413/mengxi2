package com.zbwb.mengxi.common;

import com.zbwb.mengxi.common.core.FormField;
import com.zbwb.mengxi.common.core.IndexPage;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
@RequestMapping("/{modelName}")
public abstract class BaseController<T> {



    private CommonDao commonDao;

    @Autowired
    public BaseController(CommonDao commonDao) {
        this.commonDao = commonDao;
    }

    @GetMapping
    public String requestList(
            Model model,
            @PathVariable String modelName,
            @RequestParam(required = false, defaultValue = "1") int pageNo) {


        final ModelParser modelParser = new ModelParser(modelName);
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(modelParser.getClazz());
        Page<Object> objectPage = commonDao.find(pageNo, detachedCriteria);

        model.addAttribute("modelName", modelName);
        IndexPage indexPage = modelParser.getIndexPage(objectPage);
        model.addAttribute("title", modelParser.getModel().title());
        model.addAttribute("pageData", indexPage.getPage());
        model.addAttribute("headers", indexPage.getHeaders());
        return "list";
    }

    @PostMapping
    @Transactional
    public String add(T t) {
        commonDao.save(t);
        return "list";
    }

    @GetMapping("/{id}")
    public String toEdit(
            @PathVariable String modelName,
            @PathVariable String id,
            Model model) {

        ModelParser parser = new ModelParser(modelName);
        Object o = null;
        if (!id.equals("none")) {
            o = commonDao.get(parser.getClazz(), id);
            model.addAttribute("title", parser.getModel().title());
            model.addAttribute("id", id);
            model.addAttribute("data", o);
        }
        List<FormField> formFields = parser.getFormPage(o);
        model.addAttribute("formFields", formFields);
        return "form";
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public boolean delete(
            @PathVariable String modelName,
            @PathVariable String id) {
        Object o = commonDao.get(ModelParser.model2Class(modelName), id);
        if (o != null) {
            commonDao.delete(o);
            return false;
        }
        return true;
    }

}
