/**
 * Copyright &copy; 2012-2013 <a href="https://github.com/thinkgem/jeesite">JeeSite</a> All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
package com.zbwb.mengxi.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.List;

/**
 * Service基类
 * 
 * @author chengdu dev
 * @version 2017-05-15
 */
public abstract class BaseService<T> {

	@Autowired
	protected CommonDao commonDao;

	private Class<T> type = getTClass();

	/**
	 * 日志对象
	 */
	protected Logger logger = LoggerFactory.getLogger(getClass());


	/**
	 * 获取实体
	 * 
	 * @param id
	 * @return
	 */
	public T get(Serializable id) {
		return commonDao.get(type, id);
	}

	/**
	 * 保存或更新实体
	 * @param t
	 * @return
	 */
	public void save(T t) {
		commonDao.clear();
		commonDao.save(t);
	}

	public void save(List<T> entities) {
		commonDao.clear();
		commonDao.save(entities);
	}

	public void saveOther(Object o) {
	    commonDao.session().save(o);
    }

	@SuppressWarnings("unchecked")
	private Class<T> getTClass() {
		return CommonDao.getTClass(getClass());
	}

}
