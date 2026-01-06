---
title: Vue + Node.js + MySQL 项目部署到 ECS 服务器
pubDate: 2022-02-27T18:11:00+08:00
description: 别再用阿里云了
lang: zh
duration: 10min
---

## 参考资料：

- [【超详细小白教学】Vue+nodejs 电商项目部署指南](https://blog.csdn.net/weixin_43786756/article/details/112982951?utm_medium=distribute.pc_feed_404.none-task-blog-2~default~BlogCommendFromBaidu~Rate-1.control404&depth_1-utm_source=distribute.pc_feed_404.none-task-blog-2~default~BlogCommendFromBaidu~Rate-1.control40)
- [Vue + node + mongoDB 项目部署至阿里云服务器](https://segmentfault.com/a/1190000022921908)
- [pm2 代替 forever 部署 nodejs 项目](https://www.jianshu.com/p/57742768e947)

## 步骤：

### 一、服务器配置与宝塔面板

1. 配置并购买 ECS 服务器（注意记忆自定义 **SSH 连接密码**，用户名固定为 'root'），生成实例
2. 使用上面设置的密码通过“**远程连接 —— Workbench”**，进入 shell 命令行
3. 根据 ECS 操作系统用对应的**命令**安装“宝塔 Linux 面板”，复制“**外网面板地址**”，进入面板（**注意**：需先配置 ECS 实例**安全组**，放行 **8888 端口**）
   1. **配置安全组方法**：进入 ECS 安全组规则配置页面，选择“**入方向**”手动添加各种规则
   2. 为了后续部署方便，通过**快速添加**为常用端口添加规则
   3. 此外，将**前端与后端应用**使用的端口号分别手动添加到规则中
4. 在宝塔面板的**软件商店**中，选择**极速安装** Nginx@、MySQL@5.5、TomCat@7
5. 远程连接中使用`/etc/init.d/bt default`查看宝塔面板用户名、密码

### 二、前端代码处理

1. 调用**接口**中的地址与端口号替换成 ECS 实例的**公网地址 + 后端应用端口号**（后面还需要在 **Nginx 中配置后端代理**）。
2. 删除解决开发时调用接口的跨域问题的 **vue.config.js** 文件。
3. 调用 **npm run build** 打包前端文件，注意生成的 dist/index.html 中资源的路径要改为**相对路径**。
4. 提取出 **dist** 目录

### 三、后端代码处理

1. 将**连接对象**中的 **localhost** 改为 **'127.0.0.1'（本地 IP）**。
2. 记住创建数据库连接的**用户名**和**密码**。
3. 删除依赖文件 **node_module**，以减小文件夹的体积。
4. 将前、后端代码文件夹复制到合适的文件夹中（dist & back-end）：

### 四、数据库配置

1. 在宝塔面板，进入“**数据库**”，修改 **root 密码**与后端代码保持一致。
2. 在本地电脑使用 cmd 命令行窗口，输入 **ssh root@服务器公网 IP**，并输入 ssh 密码连接 ECS。
3. 输入 **mysql -u root -p;** ，使用在宝塔面板设置的密码登录 MySQL 数据库。
4. 输入 **create database \`db_name\` default character set utf8 collate utf8_general_ci;** ，创建数据库。
5. 从本地数据库中导出 **.sql** 文件，**注意**：如果本地数据库与 ECS 数据库**字符编码格式不同**时，需要**修改**导出的 sql 文件。
6. 使用 **source /path/db_name.sql;**，导入数据库，用 **show tables;** 确认表是否导入成功。
7. 回到宝塔面板的数据库模块，点击“**从服务器获取**”，可以获取上面创建的数据库。

### 五、启用 Node 服务

1. 使用 **node --version** 或 **node -v** 命令查看 ECS 是否安装了 Node.js。
2. 若未安装，使用以下命令安装 Node（**注意：CentOS 属于 Linux 系统**）：
3. ```shell
   $cd /root
   $wget https://nodejs.org/download/release/v14.17.0/node-v14.17.0-linux-x64.tar.gz
   $sudo tar --strip-components 1 -xzvf node-v14.17.0-linux-x64.tar.gz -C /usr/local
   ```
4. 切换到后端文件夹，执行 **npm install** 安装依赖（express，mysql 等）。
5. 安装完毕后，使用 **node main.js** 测试能否成功运行后端。
6. 运行成功后，安装 **pm2** 使 cmd 不需要一直运行以**维持后端服务**：
7. ```shell
   $cd /usr/local
   $npm install -g pm2
   ```
8. 进入后端目录，使用 pm2 启动后端应用，**--name** 可为进程设置名称：
9. ```shell
   $pm2 start main.js --name="name"
   ```
10. 启动成功后，看到如下结果：

    ![pm2 持久化运行后端](../../assets/vue-node-mysql-deployment/4.webp)

11. **附录—— pm2 常用命令**：
    1. **查看所有进程**：`$pm2 list`
    2. **查看某进程详细信息**：`$pm2 info [proc_id]`
    3. **暂停某进程**：`$pm2 stop [proc_id]`
    4. **重启某进程**：`$pm2 restart [proc_id]`
    5. **重启所有进程**：`$pm2 restart all`
    6. **删除某进程**：`$pm2 delete [proc_id]`
    7. **快照**：`$pm2 save`
    8. **重启快照**：`$pm2 resurrect`

### 六、Nginx 配置与启动

1. 进入宝塔面板——软件商店—— Nginx 设置——配置修改，在 **http** 块（**注意**：不是 **server** 块）内增加以下**反向代理**代码：
2. ```js
   server{
       // 前端网页端口号
       listen <port>;
       // ECS 服务器外网 IP 地址
       server_name localhost <host>;
       location / {
       // 前端目录
       root <dir>;
       try_files $uri $uri/ /index.html;
       }
   }
   ```
3. 保存修改，回到服务，先点击**重载配置**，再点击**重启**：
   1. 如果此时运行失败，出现：`bind() to 0.0.0.0:80 failed (98:Adress already in use)`错误，是由于**端口号被占用**。
4. 在浏览器中访问“http://ip:port"，即可进入前端页面
   1. 主页可以正常访问，但**调用后端接口**时，提示错误 **We're sorry but XX doesn't work properly without JavaScript enabled**，原因是 **Nginx 配置异常，没有正确转发后端接口地址**。
   2. 需要在 Nginx 中配置**转发访问后端的具体地址**：
   3. ```js
      server{
          listen <port>; # 前端页面端口
          server_name localhost <host>; # 服务器 IP
          error_page 404 /index.html;	# 防止出现 404 Not Found 页面

          location / {
              root /www/server/tomcat/webapps/dist; # Vue 项目路径
              try_files $uri $uri/ /index.html;
          }
          ## 配置后端反向代理
          location ~ /api/ {
              proxy_pass <back-end-origin>; # 后端运行地址
          }
      }
      ```

   4. 保存，重载配置并重启 Nginx 服务即可。

5. **附注**：
   1. 本部署方法**并未用到 Tomcat 服务器**，只是将前后端代码放在 tomcat 下属的目录（其他目录也可）中，所以**不需要安装 Tomcat**。
   2. **开发环境下**，为了解决调试时的**跨域问题**，而为前端项目配置的 **vue.config.js** 文件在**发布/部署**时不再需要，**不要打包进 dist 目录**。

## 问题与解答

### 单独将后端部署到 ECS 后的调试问题

- 由于使用 pm2 进行后端托管后，**无法看到 node.js 对请求的输出信息**，所以当需要对后端进行**调试（如合并前后端）**时，最好**暂停 pm2 运行**，改为**使用 node 命令运行后端**。

### 后端数据库名称大小写问题

- 在**本地调试后端**时，**connection.query() 方法**中的 **SQL 语句**对大小写不敏感，但部署到服务器上后，后端对**大小写敏感**，需要注意两者一致。
