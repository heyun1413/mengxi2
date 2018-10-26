package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.anno.Model;
import com.zbwb.mengxi.common.domain.FormBean;
import com.zbwb.mengxi.common.domain.TableBean;
import org.springframework.util.StringUtils;

import java.util.List;

public class DefaultModel extends AbstractModel {

    private final TableBean table;
    private final FormBean form;

    DefaultModel(Model model, Class<?> type, List<Bean> beans) {
        super(getModelName(model, type), model.title(), type);
        table = new TableBean(getTitle(), beans);
        form = new FormBean(beans);
    }

    private static String getModelName(Model model, Class<?> type) {
        return StringUtils.isEmpty(model.name()) ?
                StringUtils.uncapitalize(type.getSimpleName()) :
                model.name();
    }

    @Override
    public TableBean getTable() {
        return table;
    }

    @Override
    public FormBean getForm() {
        return form;
    }
}
