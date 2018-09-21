package com.zbwb.mengxi;

import com.zbwb.mengxi.common.util.PackageUtils;
import com.zbwb.mengxi.model.VideoMonitor;
import org.junit.Assert;
import org.junit.Test;

import java.util.Set;

public class PackageUtilsTest {

    @Test
    public void testGetClass() {
        Set<Class<?>> classes = PackageUtils.getClasses("com.zbwb.mengxi.model.");
        for (Class<?> aClass : classes) {
            Assert.assertEquals(aClass, VideoMonitor.class);
        }
    }
}
