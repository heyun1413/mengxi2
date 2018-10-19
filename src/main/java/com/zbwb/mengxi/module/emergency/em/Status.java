package com.zbwb.mengxi.module.emergency.em;

import com.zbwb.mengxi.common.Representable;

/**
 * @author ron
 * 状态
 */
public enum Status implements Representable {

    /**
     * 初稿状态
     */
    SNAPSHOT {
        @Override
        public String val() {
            return "初稿";
        }
    },
    /**
     * 最终版
     */
    FINAL {
        @Override
        public String val() {
            return "最终版";
        }
    }
}
