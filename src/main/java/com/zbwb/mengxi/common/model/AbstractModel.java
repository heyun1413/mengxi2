package com.zbwb.mengxi.common.model;

import com.zbwb.mengxi.common.domain.Menu;

import java.io.Serializable;

public abstract class AbstractModel implements ModelBean, Serializable {

    private final String name;

    private final String title;

    private final Class<?> type;

    AbstractModel(String name, String title, Class<?> type) {
        this.name = name;
        this.title = title;
        this.type = type;
    }

    @Override
    public final String getName() {
        return this.name;
    }

    @Override
    public final String getTitle() {
        return this.title;
    }

    @Override
    public final Class<?> getType() {
        return this.type;
    }

    @Override
    public final Menu toMenu() {
        return new Menu(name, title);
    }
}
