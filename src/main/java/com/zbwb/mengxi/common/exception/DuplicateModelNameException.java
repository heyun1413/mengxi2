package com.zbwb.mengxi.common.exception;

/**
 * @author sharpron
 * 模型名字重复
 */
public class DuplicateModelNameException extends RuntimeException {

    public DuplicateModelNameException(String message) {
        super(message);
    }
}
