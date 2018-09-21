package com.zbwb.mengxi.common.system.service.impl;

import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.system.entity.User;
import com.zbwb.mengxi.common.system.service.UserService;
import com.zbwb.mengxi.common.shiro.PasswordHelper;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class DefaultUserService implements UserService {

    @Resource
    private CommonDao commonDao;

    @Override
    public User create(User user) {
        commonDao.save(handlePassword(user, user.getPassword()));
        return user;
    }

    private static User handlePassword(User user, String password) {
        PasswordHelper helper = new PasswordHelper();
        user.setPassword(helper.encryptPassword(password));
        user.setSalt(helper.getSalt());
        return user;
    }

    @Override
    public void modifyPassword(Long userId, String newPassword) {
        User user = commonDao.get(User.class, userId);
        commonDao.update(handlePassword(user, newPassword));
    }

    @Override
    public void associateRoles(String userId, String... roleIds) {
        SQLQuery sqlQuery = commonDao.session().createSQLQuery("INSERT INTO sys_user_role VALUES(?, ?) ");
        executeBatchUpdate(sqlQuery, userId, roleIds);
    }

    private void executeBatchUpdate(SQLQuery query, String userId, String... roleIds) {
        for (String roleId : roleIds) {
            query.setParameter(0, userId)
                    .setParameter(1, roleId)
                    .executeUpdate();
        }
    }

    @Override
    public void disassociateRoles(String userId, String... roleIds) {
        SQLQuery sqlQuery = commonDao.session().createSQLQuery("delete FROM sys_user_role WHERE user_id=? and role_id=?");
        executeBatchUpdate(sqlQuery, userId, roleIds);
    }

    @Override
    public User findByUsername(String username) {
        return (User) commonDao.session().createCriteria(User.class)
                .add(Restrictions.eq("username", username))
                .uniqueResult();
    }
}
