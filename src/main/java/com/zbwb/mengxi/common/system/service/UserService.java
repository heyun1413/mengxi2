package com.zbwb.mengxi.common.system.service;

import com.zbwb.mengxi.common.CommonDao;
import com.zbwb.mengxi.common.system.User;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final CommonDao commonDao;


    @Autowired
    public UserService(CommonDao commonDao) {
        this.commonDao = commonDao;
    }

    public User findByUsername(String username) {
        return (User) commonDao.session()
                .createCriteria(User.class)
                .add(Restrictions.eq("username", username))
                .uniqueResult();
    }


}
