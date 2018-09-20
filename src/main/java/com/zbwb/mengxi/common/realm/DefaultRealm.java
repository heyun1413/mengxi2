package com.zbwb.mengxi.common.realm;

import com.zbwb.mengxi.common.system.Permission;
import com.zbwb.mengxi.common.system.Role;
import com.zbwb.mengxi.common.system.User;
import com.zbwb.mengxi.common.system.service.UserService;
import com.zbwb.mengxi.common.util.PasswordHelper;
import org.apache.shiro.authc.*;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.authc.credential.Md5CredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DefaultRealm extends AuthorizingRealm {

    private final UserService userService;

    @Autowired
    public DefaultRealm(UserService userService) {
        this.userService = userService;
        setCredentialsMatcher(PasswordHelper.getCredentialsMatcher());
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        User user = (User) principals.getPrimaryPrincipal();
        for (Role role : user.getRoles()) {
            authorizationInfo.addRole(role.getId());
            for (Permission p : role.getPermissions()) {
                authorizationInfo.addStringPermission(p.getName());
            }
        }
        return authorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        String username = (String) token.getPrincipal();
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UnknownAccountException();
        }
        if (user.isLocked()) { //账户冻结
            throw new LockedAccountException();
        }
        return new SimpleAuthenticationInfo(
                user, //用户名
                user.getPassword(), //密码
                ByteSource.Util.bytes(user.getSalt()),
                getName()
        );
    }
}
