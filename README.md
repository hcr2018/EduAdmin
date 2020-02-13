# 教育培训管理系统

#### 介绍
教育培训机构的客户管理crm + 在线视频学习管理+ 题库和考试作业+ 购买课程管网　


#### 软件架构

本系统采用前后端分离的开发和运行模式。前端使用vue框架并基于vue-admin-element 模板进行开发。后端使用golang + redis + mysql 进行搭建　可单机运行也可集群运行。 对中小型培训机构的使用没有压力。　


#### 后端安装教程. 
如果你只需要开发前端程序。那么不需要下载后端程序即可直接使用公用的社区版api接口调试。待将要部署的时候再下载下面的后端程序。
后端程序采用的是go语言编写的。提供windows和linux版本供下载
1.  首先请确保安装最新版的稳定mysql 和redis 版本。
2.  在[后台程序下载（Linux版本）](http://edu.todear.net:8990/download/linux_edu.zip)
3.  在[后台程序下载（Windows版本）](http://edu.todear.net:8990/download/windows_edu.zip)
4.  在mysql数据库中先建立一个 edu的数据库。
5.  解压上面下载的后台程序压缩包。将sql导入
6.  修改conf目录下app.conf配置文件。其中的数据库账号和密码，以及redis账号和db编号。默认为0 第一个
7.  运行后端程序即可启动后端。　如果部署到正式服务器可以配合ｎｇｉｎｘ　等进行。
#### 前端ｖｕｅ使用方法
1.  使用git拉取前端代码 https://gitee.com/luonannet/EduAdmin.git 到EduAdmin 目录下
2.  进入Edumin目录，执行npm install
3.  然后运行npm run dev 打开进入测试页面
4.  使用 npm run build:prod 编译出生产文件。部署在web服务器后即可。 



#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 码云特技
 