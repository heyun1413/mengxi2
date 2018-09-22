/**
 * Copyright &copy; 2012-2013 <a href="https://github.com/thinkgem/jeesite">JeeSite</a> All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
package com.zbwb.mengxi.common.domain;

import java.util.List;

/**
 * 分页类
 * @author sharpron
 * @param <T>
 */
public class Page<T> {

	private static final int DEFAULT_PAGE_SIZE = 10;
	
	private int pageNo = 1;

	private int pageSize = DEFAULT_PAGE_SIZE;
	
	private long count;

	private List<T> data;

    public int getPageNo() {
        return pageNo;
    }

    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public boolean isFirst() {
        return pageNo == 1;
    }

    public boolean isLast() {
        return pageSize * pageNo >= count;
    }

    public long countPage() {
        long countPage = count / pageSize;
        if (count % pageSize != 0) {
            return countPage + 1;
        }
        return countPage;
    }

}
