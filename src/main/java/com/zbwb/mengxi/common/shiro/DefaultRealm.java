package com.zbwb.mengxi.common.shiro;

import com.zbwb.mengxi.common.system.entity.Permission;
import com.zbwb.mengxi.common.system.entity.Role;
import com.zbwb.mengxi.common.system.entity.User;
import com.zbwb.mengxi.common.system.service.UserService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author sharpron
 * 默认的realm
 */
@Component
public class DefaultRealm extends AuthorizingRealm {

    private final UserService userService;

    @Autowired
    public DefaultRealm(UserService userService) {
        this.userService = userService;
        //绑定指定的CredentialsMatcher
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
        if (user.isLocked()) {
            throw new LockedAccountException();
        }
        return new SimpleAuthenticationInfo(
                user,
                user.getPassword(),
                ByteSource.Util.bytes(user.getSalt()),
                getName()
        );
    }
}
