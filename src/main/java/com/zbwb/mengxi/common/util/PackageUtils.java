package com.zbwb.mengxi.common.util;

import com.zbwb.mengxi.common.anno.Module;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.function.Predicate;

/**
 * @author sharpron
 * package utils
 */
public class PackageUtils {

    private static final String FILE_PROTOCOL = "file";
    private static final char PACKAGE_SEPARATOR = '.';
    private static final String CLASS_SUFFIX = ".class";
    private static final String ENC = "UTF-8";


    public static Module getModuleFromPackage(String packageName) {
        Package aPackage = Package.getPackage(packageName);
        return aPackage.getAnnotation(Module.class);
    }

    /**
     * 获取包下面的所有class
     * @param packageName 包名
     * @param predicate class是否符合预期的条件
     * @return class的集合
     */
    public static Set<Class<?>> getClasses(String packageName, Predicate<Class<?>> predicate) {
        final Set<Class<?>> classes = new LinkedHashSet<>();
        final String packageDirName = packageName.replace(PACKAGE_SEPARATOR, '/');
        try {
            Enumeration<URL> dirs = Thread.currentThread().getContextClassLoader()
                    .getResources(packageDirName);
            // 循环迭代下去
            while (dirs.hasMoreElements()) {
                find(packageName, classes, dirs, predicate);
            }
        } catch (IOException e) {
            throw new RuntimeException("package is error");
        }
        return classes;
    }

    private static void find(String packageName, Set<Class<?>> classes, Enumeration<URL> dirs, Predicate<Class<?>> predicate) throws UnsupportedEncodingException {
        URL url = dirs.nextElement();
        if (FILE_PROTOCOL.equals(url.getProtocol())) {
            String filePath = URLDecoder.decode(url.getFile(), ENC);
            findAndAddClassesInPackageByFile(packageName, filePath, true, classes, predicate);
        }
    }


    private static void findAndAddClassesInPackageByFile(
            String packageName, String packagePath,
            final boolean recursive, Set<Class<?>> classes, Predicate<Class<?>> predicate) {

        final File[] files = files(packagePath, recursive);
        if (files == null || files.length == 0) {
            return;
        }

        for (File file : files) {
            if (file.isDirectory()) {
                findAndAddClassesInPackageByFile(
                        packageName + PACKAGE_SEPARATOR + file.getName(),
                        file.getAbsolutePath(), recursive, classes, predicate);
            } else {
                try {
                    Class<?> aClass = Class.forName(packageName + PACKAGE_SEPARATOR + classNameOf(file));
                    if (predicate != null && predicate.test(aClass)) {
                        classes.add(aClass);
                    }
                } catch (ClassNotFoundException e) {
                    throw new AssertionError();
                }
            }
        }
    }

    /**
     * 获取class文件的不包含后缀的名字
     * @param file class文件
     * @return className
     */
    private static String classNameOf(File file) {
        return file.getName().substring(0,
                file.getName().length() - CLASS_SUFFIX.length());
    }

    private static File[] files(String packagePath, final boolean recursive) {
        File dir = new File(packagePath);
        if (!dir.exists() || !dir.isDirectory()) {
            return null;
        }
        return dir.listFiles(file -> (recursive && file.isDirectory())
                || (file.getName().endsWith(CLASS_SUFFIX)));
    }

}