-- 初始化数据 --


INSERT INTO sys_user VALUES('1', '1358612584@qq.com', 0, '18281697060', '何荣',
                              'fb99fa190760c95f792919dfe14a73d9',
                              '3d7fdae7bbd4b0423e7b30220abd3e73',
                              null, 'ron');

INSERT INTO sys_role VALUES ('1', '系统管理员');

INSERT INTO sys_user_role VALUES ('1', '1');

INSERT INTO sys_permission VALUES('1', SYSDATE(), 'com.zbwb.mengxi.model.VideoMonitor:index',
                                null, SYSDATE(), '视频监控');

INSERT INTO sys_role_permission VALUES('1', '1');

