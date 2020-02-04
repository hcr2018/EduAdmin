# 教育培训管理系统

#### 介绍
教育培训机构的客户管理crm + 在线视频学习管理+ 题库和考试作业+ 购买课程管网

#### 软件架构

本系统采用前后端分离的开发和运行模式。前端使用vue框架并基于vue-admin-element 模板进行开发。后端使用golang + redis + mysql 进行搭建。 对中小型培训机构的使用没有压力。经实测4vCPU+8G内存的服务器


#### 安装教程
后端程序采用的是go语言编写的。提供windows和linux版本供下载
1.  首先请确保安装最新版的稳定mysql 和redis 版本。
2.  在[后台程序下载（Linux版本）](http://www.todear.net:8990/download/linux_edu.zip)
3.  在[后台程序下载（Windows版本）](http://www.todear.net:8990/download/windows_edu.zip)
4.  在mysql数据库中先建立一个 edu的数据库。
5.  解压上面下载的后台程序压缩包。将sql导入
6.  修改conf目录下app.conf配置文件。其中的数据库账号和密码，以及redis账号和db编号。默认为0 第一个
7.  运行程序即可完成。


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 码云特技
 