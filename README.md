# 教育培训管理系统 

#### 介绍
1. 教育培训机构的客户管理crm + 在线视频学习管理+ 题库和考试作业+ 购买课程管网　.理论上可以建立无数个分校区。并且每个分校区可以独立管理自己的官网。　各个分校区共享总部提供的教学教育资源。

2. 本系统采用了多语言国际化界面。用户可以随时切换中，英，繁体中文，日语。便于外语培训学校的老师使用。

3. 自己的每个校区都可以有独立的网站，并且集成了网站的后台管理。但需要手动绑定域名。
4. 总部负责教研和资源统筹管理。分校负责学员培训和管理以及售前售后。

#### 软件架构

本系统采用前后端分离的开发和运行模式。前端使用vue框架并基于vue-admin-element 模板进行开发。后端使用golang + redis + mysql 进行搭建　可单机运行也可集群运行。 对中小型培训机构的使用没有压力。　


#### 后端安装教程. 
如果你只需要开发前端程序。那么不需要下载后端程序即可直接使用公用的社区版api接口调试。待将要部署的时候再下载下面的后端程序。
后端程序采用的是go语言编写的。提供windows和linux版本供下载
1.  首先请确保安装最新版的稳定mysql 和redis 版本。
2.  在[后台后端程序下载（Linux版本）64位](http://edu.todear.net:8990/download/community.zip)
3.  在[后台后端程序下载（Windows版本）64位](http://edu.todear.net:8990/download/community.zip)
4.  在mysql数据库中先建立一个 edu的数据库。
5.  解压上面下载的后台程序压缩包。将sql导入
6.  修改conf目录下app.conf配置文件。其中的数据库账号和密码，以及redis账号和db编号。默认为0 第一个
7.  运行后端程序即可启动后端。　如果部署到正式服务器可以配合ｎｇｉｎｘ　等进行。
#### 前端ｖｕｅ使用方法
1.  使用git拉取前端代码 https://gitee.com/luonannet/EduAdmin.git 到EduAdmin 目录下
2.  进入Edumin目录，执行npm install
3.  然后运行npm run dev 打开进入测试页面
4.  使用 npm run build:prod 编译出生产文件。部署在web服务器后即可。 

#### 使用方法
1.  演示版本的地址 [后台地址 http://eduadmin.todear.net:8990](http://eduadmin.todear.net:8990)。 用户名和密码都是17760478454 。没有任何权限，只能点点看看。以免演示数据搞混乱了。
2.  如果需要使用在线拨打电话功能需要另外购买一台电话机通过usb连接电脑，大概400元。否则无法直接在网上拨打电话。

 #### 预览图
![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_af0efc0b_870483.png "登录页") 

## 登录页面。支持多语言选择

![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_ca4b56a7_870483.png "登录页") 

数据仪表页面。可以直观的看到员工的工作内容和占比



![登录页](https://images.gitee.com/uploads/images/2020/0304/201934_361e0b64_870483.png "登录页") 

每个校区可以单独设置她拥有的资料权限级别。


![登录页](https://images.gitee.com/uploads/images/2020/0304/201852_352ff131_870483.png "登录页") 

每个校区可以单独设置自己官网的轮播图，新闻，优秀教师等宣传资料。便于突出各自校区特色
 

![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_4426c44b_870483.png "登录页") 

老师和管理员的权限分配页面。打了蓝色勾勾的代表用户拥有此权限。

![登录页](https://images.gitee.com/uploads/images/2020/0304/202557_455cf1ad_870483.png "登录页") 

题库里每一道题都可以在题干和选项中插入图片，便于某些特殊图形字符的录入

![登录页](https://images.gitee.com/uploads/images/2020/0304/202540_e397edab_870483.png "登录页") 

直接对在线售卖的课程设置各种组合售卖价格。便于学员自主选择购买


![登录页](https://images.gitee.com/uploads/images/2020/0304/202549_b5f04a77_870483.png "登录页") 

对每个教材的教学视频都可以划分章节，任意添加多少章节和视频。  

![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_bc41e322_870483.png "登录页") 
学员列表页面。可以给每个学员在线拨打电话。发送短信。办理各种业务

![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_4358287c_870483.png "登录页") 
点击学员姓名后可以进入 学员的详情页面。可以给学员开通在线课程让学员拥有权限在线做题，视频学习，成绩录入等等。类似crm系统
![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_7020f8f3_870483.png "登录页") 
添加跟进记录。记录下每个学员的 重要交谈历史。以便日后查证
![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_cf4ca241_870483.png "登录页") 

![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_41f18c86_870483.png "登录页") 

![登录页](https://images.gitee.com/uploads/images/2020/0223/214411_3c2ca438_870483.png "登录页") 
 给每个学员签订合同订单，一个学员可以拥有多个合同。合同的金额会自动汇总到财务部门

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4. 新建 Pull Request


#### 使用方法
![微信技术讨论群](https://images.gitee.com/uploads/images/2020/0304/102922_b92ef0a0_870483.png "微信") 


#### 码云特技
 +