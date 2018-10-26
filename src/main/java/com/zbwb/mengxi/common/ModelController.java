package com.zbwb.mengxi.common;

import com.google.common.collect.Maps;
import com.zbwb.mengxi.common.domain.FormBean;
import com.zbwb.mengxi.common.domain.FormField;
import com.zbwb.mengxi.common.domain.Page;
import com.zbwb.mengxi.common.domain.TableBean;
import com.zbwb.mengxi.common.model.ModelBean;
import com.zbwb.mengxi.common.model.ModelManager;
import com.zbwb.mengxi.common.parser.QueryParamParser;
import com.zbwb.mengxi.common.resolver.ClassResolver;
import com.zbwb.mengxi.common.util.ObjectUtils;
import com.zbwb.mengxi.common.vo.Response;
import com.zbwb.mengxi.common.vo.DataTableResponse;
import com.zbwb.mengxi.common.vo.TableData;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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


    @GetMapping
    public String index() {
        return "frame";
    }

    @GetMapping("table")
    @ResponseBody
    public TableBean table(@PathVariable String modelName) {
        return modelManager.get(modelName).getTable();
    }


    @GetMapping("form")
    @ResponseBody
    public FormBean form(@PathVariable String modelName) {
        return modelManager.get(modelName).getForm();
    }

    /**
     * 首页
     * @param modelName 模型名称
     * @param queryParams 查询参数
     * @return 首页
     */
    @GetMapping("data")
    @ResponseBody
    public DataTableResponse data(
            @PathVariable String modelName,
            @RequestParam int draw,
            @RequestParam int start,
            @RequestParam int length,
            @RequestParam(required = false) String queryParams) {


        final ModelBean modelBean = modelManager.get(modelName);
        final DetachedCriteria detachedCriteria = CommonDao.detachedCriteria(modelBean.getType(), queryParamParser.parse(queryParams));
        Page<Object> page = commonDao.find(start % length + 1, length, detachedCriteria);
        List<Map<String, Object>> datableRowData = page.getData().stream()
                .map(object -> {
                    final Map<String, Object> map = Maps.newHashMap();
                    if (object instanceof BaseEntity) {
                        map.put("DT_RowId", ((BaseEntity) object).getId());
                    }
                    modelBean.getTable().getItems()
                            .forEach(item -> map.put(item.getPath(), ObjectUtils.getValue(object, item.getPath())));
                    return map;
                }).collect(Collectors.toList());
        return new DataTableResponse(draw, page.getCount(), page.getCount(), datableRowData);
    }

    @GetMapping("data/lay-ui")
    @ResponseBody
    public Response<TableData> data(
            @PathVariable String modelName,
            @RequestParam(name = "page") int pageNo,
            @RequestParam(name = "limit") int pageSize,
            @RequestParam(required = false) String queryParams) {


        final ModelBean modelBean = modelManager.get(modelName);
        final DetachedCriteria detachedCriteria = CommonDao.detachedCriteria(modelBean.getType(), queryParamParser.parse(queryParams));
        Page<Object> page = commonDao.find(pageNo, pageSize, detachedCriteria);
        List<Map<String, Object>> datableRowData = page.getData().stream()
                .map(object -> {
                    final Map<String, Object> map = Maps.newHashMap();
                    if (object instanceof BaseEntity) {
                        map.put("id", ((BaseEntity) object).getId());
                    }
                    modelBean.getTable().getItems()
                            .forEach(item -> map.put(item.getPath(), ObjectUtils.getValue(object, item.getPath())));
                    return map;
                }).collect(Collectors.toList());
        return Response.success(new TableData(page.getCount(), datableRowData));
    }




    /**
     * 保存实体
     * @param modelName 模型名称
     * @param classResolver 自动注入类解析器，将传入的class解析成对象，同时将请求中的数据绑定到该对象上
     * @return 跳转到该模型对应的首页
     */
    @PostMapping
    @Transactional(rollbackFor = Exception.class)
    public Response add(@PathVariable String modelName,
                        ClassResolver classResolver) {
        Object object = classResolver.resolve(modelManager.get(modelName).getType());
        BaseEntity entity = (BaseEntity) object;
        if (isNone(entity.getId())) {
            entity.setId(null);
            commonDao.save(object);
            return Response.success();
        }
        return Response.fail("添加失败， id必须是none");
    }

    @PutMapping
    @Transactional(rollbackFor = Exception.class)
    public Response modify(@PathVariable String modelName,
                           ClassResolver classResolver) {
        Object object = classResolver.resolve(modelManager.get(modelName).getType());
        BaseEntity entity = (BaseEntity) object;
        if (!isNone(entity.getId())) {
            commonDao.save(object);
            return Response.success();
        }
        return Response.fail("添加失败， id不能是none");
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

        if (!isNone(id)) {
            Object o = commonDao.get(modelBean.getType(), id);
            model.addAttribute("title", modelBean.getTitle());
            model.addAttribute("data", o);
        }
        List<FormField> formFields = modelBean.getForm().getFormFields();
        model.addAttribute("formFields", formFields);
        model.addAllAttributes(modelBean.getForm().getOptions(commonDao::getAll));
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
        model.addAttribute("title", modelBean.getTitle());
        List<FormField> formFields = modelBean.getForm().getFormFields();
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
