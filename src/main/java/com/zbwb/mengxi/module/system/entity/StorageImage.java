package com.zbwb.mengxi.module.system.entity;

import com.zbwb.mengxi.common.DataDomain;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "sys_image")
public class StorageImage extends DataDomain {

    private String uri;


    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

}
