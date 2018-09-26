package com.zbwb.mengxi.common.domain;


import com.esotericsoftware.reflectasm.MethodAccess;
import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.em.InputType;
import com.zbwb.mengxi.module.system.entity.Permission;
import com.zbwb.mengxi.common.util.DateUtils;
import org.springframework.util.StringUtils;


import java.util.*;
import java.util.stream.Collectors;

/**
 * @author sharpron
 *
 * 解析model
 */
public class ModelBean {


    /**
     * 模型名称
     */
    private final String name;
    /**
     * 模型信息
     */
    private final Model model;
    /**
     * 方法注解信息
     */
    private final List<MethodAnnotation> methodAnnotations;
    /**
     * 模型类型
     */
    private final Class<?> type;
    /**
     * 方法访问器，执行相关方法获取值
     */
    private final MethodAccess methodAccess;

    public ModelBean(Class<?> type, Model model, List<MethodAnnotation> methodAnnotations) {
        this.type = type;
        this.model = model;
        this.methodAnnotations = new ArrayList<>(methodAnnotations);
        this.methodAccess = MethodAccess.get(this.type);
        this.name = StringUtils.isEmpty(model.name()) ?
                StringUtils.uncapitalize(type.getSimpleName()) :
                model.name();
    }

    public String getName() {
        return name;
    }

    public Class<?> getType() {
        return type;
    }

    public Model getModel() {
        return model;
    }

    private List<MethodAnnotation> getMethodAnnotations() {
        return methodAnnotations;
    }

    /**
     * 获取首页
     * @param page 数据
     * @param queryObject 查询对象的值
     * @return 首页
     */
    public IndexPage getIndexPage(Page<Object> page, Object queryObject) {
        List<String> headers = methodAnnotations.stream()
                .filter((e) -> e.show.inList())
                .map((e) -> e.show.name())
                .collect(Collectors.toList());
        page.setData(page.getData().stream()
                .map(this::convert)
                .collect(Collectors.toList()));

        return new IndexPage(headers, page, getFormPage(queryObject));
    }

    /**
     * 获取表单页相关信息
     * @param o 对象
     * @return 表单字段
     */
    public List<FormField> getFormPage(Object o) {
        return getMethodAnnotations().stream()
                .filter((e) -> e.show.inForm())
                .map((e) -> new FormField(
                        e.show.name(),
                        getValue(o, e.methodName),
                        StringUtils.uncapitalize(e.methodName.substring(3)),
                        InputType.valueOf(e.returnValueType),
                        false))
                .collect(Collectors.toList());
    }

    /**
     * 获取值
     * @param o 对象
     * @param methodName 方法名
     * @return 值
     */
    private String getValue(Object o, String methodName) {
        final Object value = o == null ? null : methodAccess.invoke(o, methodName);
        if (value == null) {
            return null;
        }
        return value instanceof Date ?
                DateUtils.format((Date) value):
                value.toString();
    }

    private Item convert(Object o) {
        List<String> streamValues = methodAnnotations.stream()
                .filter(methodAnnotation -> methodAnnotation.show.inList())
                .map(methodAnnotation -> getValue(o, methodAnnotation.methodName))
                .collect(Collectors.toList());
        if (o instanceof BaseEntity) {
            return new Item(((BaseEntity) o).getId(), streamValues);
        }
        throw new AssertionError();
    }

    public List<Permission> getPermissions() {
        return Collections.singletonList(new Permission(String.format("%s:add", type.getSimpleName()), model.title() + "新增"));
    }

    private static class Item {

        private final String id;
        private final List<String> values;

        public Item(String id, List<String> values) {
            this.id = id;
            this.values = values;
        }

        public String getId() {
            return id;
        }

        public List<String> getValues() {
            return values;
        }
    }

    /**
     * @return 菜单
     */
    public Menu toMenu() {
        return new Menu(name, model.title());
    }
}
