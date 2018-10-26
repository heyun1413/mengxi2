package com.zbwb.mengxi.common.domain;

import com.zbwb.mengxi.common.model.Bean;

import java.util.List;

public final class TableBean {

    private final List<Operation> tabOperations;
    private final List<Operation> itemOperations;
    private final String title;
    private final List<Bean> beans;

    public TableBean(String title, List<Bean> beans) {
        this.tabOperations = Operation.tabOperations();
        this.itemOperations = Operation.itemOperations();
        this.beans = beans;
        this.title = title;
    }

    public List<Bean> getItems() {
        return beans;
    }

    public String getTitle() {
        return title;
    }

    public List<Operation> getTabOperations() {
        return tabOperations;
    }


    public List<Operation> getItemOperations() {
        return itemOperations;
    }

}
