# 后台管理项目

## 介绍
该项目为摊摊卖的后台管理项目，基于ElementUI 封装的后台管理框架vue-admin-template-master搭建，面向的对象为商家。主要分为首页、商品管理、权限管理三个模块。首页模块实现了动态数据的可视化，商品管理模块实现了对品牌、平台属性、SPU、SKU的添加、修改和删除的操作，同时对SPU设置了查看、添加、修改、删除SKU的操作。权限管理模块实现了对用户管理、角色管理、菜单管理的查看、添加、修改、删除等操作。该项目还会有一个超级管理员admin，它拥有后台项目的所有权限，能添加、删除普通管理员以及给普通管理员分配不同的菜单权限。


## 安装教程
```
### 安装依赖
1.  npm install
```
```
### 运行项目
2.  npm run serve
```
```
### 打包项目
3.  
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

```
超级管理员
账号：admin
密码：111111
```

## 项目预览
### 登录
![输入图片说明](preview/%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2.png)

### 首页
![输入图片说明](preview/%E9%A6%96%E9%A1%B5.png)

### 菜单管理
![输入图片说明](preview/%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86.png)

### 修改有用户
![输入图片说明](preview/%E4%BF%AE%E6%94%B9%E7%94%A8%E6%88%B7.png)

### 权限用户信息
![输入图片说明](preview/%E6%9D%83%E9%99%90%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF.png)

### 角色管理
![输入图片说明](preview/%E8%A7%92%E8%89%B2%E7%AE%A1%E7%90%86.png)

### 设置角色
![输入图片说明](preview/%E8%AE%BE%E7%BD%AE%E8%A7%92%E8%89%B2.png)

### 商品展示
![输入图片说明](preview/%E5%95%86%E5%93%81%E5%B1%95%E7%A4%BA.png)

### 属性管理
![输入图片说明](preview/%E5%B1%9E%E6%80%A7%E7%AE%A1%E7%90%86.png)

### sku管理
![输入图片说明](preview/sku%E7%AE%A1%E7%90%86.png)

