package com.zbwb.mengxi.common.vo;

public final class Response<T> {
    static final int CODE_SUCCESS = 0;
    static final int CODE_FAILURE = -1;

    private final int code;
    private final String msg;
    private final T data;

    private Response(int code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }


    public T getData() {
        return data;
    }

    public static Response success() {
        return new Response<>(CODE_SUCCESS, null, null);
    }

    public static <T> Response<T> success(T data) {
        return new Response<>(CODE_SUCCESS, null, data);
    }

    public static Response fail(String msg) {
        if (msg == null) {
            throw new IllegalArgumentException("msg 是必须的");
        }
        return new Response<>(CODE_FAILURE, msg, null);
    }
}
