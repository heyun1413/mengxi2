

create user 'mengxi_dev2'@'localhost' identified by '123456';

--创建库--
create database mengxi_dev2 DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

grant all privileges on `mengxi_dev2`.* to 'mengxi_dev2'@'%' identified by '123456';



