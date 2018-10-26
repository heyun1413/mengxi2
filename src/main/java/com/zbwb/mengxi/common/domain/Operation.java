package com.zbwb.mengxi.common.domain;

import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Operation {

    private final String name;

    private final String uri;

    private final HttpMethod method;

    private final List<String> requireParams;

    private final boolean confirm;


    Operation(String name, String uri, HttpMethod method, List<String> requireParams) {
        this(name, uri, method, requireParams, false);
    }

    Operation(String name, String uri, HttpMethod method, List<String> requireParams, boolean confirm) {
        this.name = name;
        this.uri = uri;
        this.method = method;
        this.requireParams = requireParams;
        this.confirm = confirm;
    }

    public String getName() {
        return name;
    }

    public String getUri() {
        return uri;
    }

    public HttpMethod getMethod() {
        return method;
    }

    public boolean isConfirm() {
        return confirm;
    }

    public List<String> getRequireParams() {


        return requireParams;
    }

    static List<Operation> tabOperations() {
        return Collections.singletonList(new Operation("新增", "/form/none", HttpMethod.GET, null));
    }

    static List<Operation> itemOperations() {
        return Arrays.asList(
                new Operation("修改", "/form/{id}", HttpMethod.GET, Collections.singletonList("id")),
                new Operation("查看", "/{id}", HttpMethod.GET, Collections.singletonList("id")),
                new Operation("删除", "/{id}", HttpMethod.DELETE, Collections.singletonList("id"), true)
                );
    }
}
