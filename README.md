# 信息管理系统前端 IMS-VUE

## 说明
后端项目基本已经完成，当然一些拦截器、跨域问题等还有待修复。使用 Postman 测试接口可视化效果不强，所以希望能写一个前端项目，今后与后端项目一起部署到服务器上投入使用。 <br>
2020.6.10开始更新本项目的开发日志.

## 层次结构
assets -> 资源包 <br>
components -> 组件 <br>
plugins -> 插件 <br>
router -> 路由 <br>
views -> 视图 <br>
App.vue -> 入口 <br>
main.js -> 主配置 <br>

## 开发日志
### 2020.6.10 - Demo 0.0.1
<li>已知问题(√): 由于没有解决前后端跨域问题，目前前后端资源被屏蔽，不能够互相访问</li>
<li>初步完成了 Login 组件</li>

### 2020.6.11 - Demo 0.0.2
<li>添加导航守卫，使用token校验用户唯一性</li>

### 2020.6.12 -Demo 0.0.3
<li>已知问题: 依旧是跨域问题，暂时不能从后端获取菜单数据，所以只能在前端直接定义菜单，任何人都可以访问</li>
<li>布局主界面，添加菜单栏和标题栏内容，实现多级菜单的动态绑定</li>

### 2020.6.13 - Demo 0.0.6
<li>优化菜单细节</li>
<li>实现了侧边栏折叠</li>
<li>开启了导航路由，接下来开始开发各个接口对应的页面</li>

### 2020.6.14 - Demo 0.0.7
<li>优化菜单栏的选项与高亮的同步绑定</li>
<li>添加了面包屑导航与卡片槽</li>

### 2020.6.15 - Demo 0.0.8
<li>跨域问题拖的有些就，导致各种 VUE 组件不能获取后端从数据库查询到的信息，明天开始先把 nginx 搭建好再继续开发</li>

### 2020.6.16 - Demo 0.1.0
<li>使用 springboot 中的 @crossorigin 注解解决了前后端跨域问题，现在可以正常访问后端接口了，但是由于前后端没有 API 文档的统一，需要做很多的双向修改</li>
<li>菜单的问题花了好几天还是没有解决，从后端接受到的菜单数组赋值之后无法读取数据的信息，暂时开放所有菜单接口的权限</li>
<li>已知问题: 查询到的数据分页尚未实现，不会真的要我在后端处理吧，不会吧不会吧</li>

### 2020.6.17 - Demo 0.1.2
<li>完成用户列表区，实现用户权限的关闭与开启并将其映射到开关组件中</li>
<li>优化了用户登录时的异步操作与请求判定(之前一直在整菜单的问题忘记了 login 页面)</li>
<li>为用户管理界面添加了删除等操作以及提示，接下来为其绑定后端接口</li>

### 2020.6.18 - Demo 0.1.4
<li>已知问题: 真的是佛了，每天都会遇到各种奇奇怪怪的问题而且还无法解决。今天的问题是，使用 get 的时候无法传递 request body ，但是可以传递 param。奇怪的是 post 登录信息的时候可以传递 request body，这算哪门子 bug，无解。因此我现在采用的方法是传入 ID 的参数进行精确查找，暂时不支持同步查找其他数据域</li>
<li>完成了添加用户的功能，点击按钮会弹出一个带有验证功能的表单，成功调用了后端接口</li>
<li>突然发现设置的 row-class-name 没有失效，发现原因在于 scoped 作用于太小，而 table 的样式比重很高，需要定义一个全局的 css ，然后通过 @import 在局部 style 中对全局样式进行导入</li>
