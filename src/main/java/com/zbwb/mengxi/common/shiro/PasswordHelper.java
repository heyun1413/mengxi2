package com.zbwb.mengxi.common.shiro;

import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;

public class PasswordHelper {

    private static final int HASH_ITERATIONS = 2;
    private static final String ALGORITHM_NAME = "MD5";

    private String salt = randomSalt();


    public String encryptPassword(String password) {
        return new SimpleHash(ALGORITHM_NAME,
                password,
                ByteSource.Util.bytes(salt),
                HASH_ITERATIONS).toHex();
    }

    public String getSalt() {
        return salt;
    }

    private static String randomSalt() {
        return new SecureRandomNumberGenerator()
                .nextBytes().toHex();
    }

    public static CredentialsMatcher getCredentialsMatcher() {
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
