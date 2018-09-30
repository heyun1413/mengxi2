package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.BaseEntity;
import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.domain.FormField;
import com.zbwb.mengxi.common.domain.IndexPage;
import com.zbwb.mengxi.common.domain.Menu;
import com.zbwb.mengxi.common.domain.Page;

import java.util.List;
import java.util.Map;

public interface ModelBean {

    String getName();

    String getTitle();

    Class<?> getType();

    IndexPage getIndexPage(Page<Object> page, Object queryObject);

    List<FormField> getFormPage(Object o);

    Menu toMenu();

    Map<String, List<? extends BaseEntity>> getOptions(CommonDao commonDao);
}
