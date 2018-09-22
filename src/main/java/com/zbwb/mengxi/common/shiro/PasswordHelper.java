package com.zbwb.mengxi.common.shiro;

import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;

/**
 * @author sharpron
 * 密码加密处理
 */
public class PasswordHelper {

    private static final int HASH_ITERATIONS = 2;
    private static final String ALGORITHM_NAME = "MD5";

    private String salt = randomSalt();


    /**
     * 加密密码
     * @param password 原始密码
     * @return 加密后的密码
     */
    public String encryptPassword(String password) {
        return new SimpleHash(ALGORITHM_NAME,
                password,
                ByteSource.Util.bytes(salt),
                HASH_ITERATIONS).toHex();
    }

    /**
     * 获取加密密码使用的salt
     * @return salt
     */
    public String getSalt() {
        return salt;
    }

    /**
     * 生成随机salt
     * @return 随机salt
     */
    private static String randomSalt() {
        return new SecureRandomNumberGenerator()
                .nextBytes().toHex();
    }

    /**
     * 通过指定的加密方式获取CredentialsMatcher
     * @return CredentialsMatcher
     */
    static CredentialsMatcher getCredentialsMatcher() {
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        hashedCredentialsMatcher.setHashIterations(PasswordHelper.HASH_ITERATIONS);
        hashedCredentialsMatcher.setHashAlgorithmName(ALGORITHM_NAME);
        return hashedCredentialsMatcher;
    }


    public static void main(String[] args) {
        PasswordHelper passwordHelper = new PasswordHelper();
        String password = passwordHelper.encryptPassword("123");
        String salt = passwordHelper.getSalt();
        System.out.println(password);
        System.out.println(salt);
    }
}
