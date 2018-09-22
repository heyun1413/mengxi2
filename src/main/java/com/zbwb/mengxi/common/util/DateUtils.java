package com.zbwb.mengxi.common.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author sharpron
 * 日期工具
 */
public class DateUtils {

    private static final String PATTERN = "yyyy-MM-dd HH:mm";

    private DateUtils() {
        throw new AssertionError();
    }

    private static DateFormat newInstance() {
        return new SimpleDateFormat(PATTERN);
    }

    public static String format(Date date) {
        return newInstance().format(date);
    }

    /**
     * 按照固定格式将日期字符串转换为date
     * @param value 日期字符串
     * @return 日期
     */
    public static Date parse(String value) {
        try {
            return newInstance().parse(value);
        } catch (ParseException e) {
            throw new RuntimeException("time format is error");
        }
    }
}
