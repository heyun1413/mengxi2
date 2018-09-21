package com.zbwb.mengxi.common.exception;

/**
 * 模型名字重复
 */
public class DuplicateModelNameException extends RuntimeException {

    public DuplicateModelNameException(String message) {
        super(message);
    }
}
