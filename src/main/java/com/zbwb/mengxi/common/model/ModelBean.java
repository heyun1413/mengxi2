package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.domain.FormBean;
import com.zbwb.mengxi.common.domain.Menu;
import com.zbwb.mengxi.common.domain.TableBean;

public interface ModelBean {

    String getName();

    String getTitle();

    Class<?> getType();

    TableBean getTable();

    FormBean getForm();

    Menu toMenu();
}
