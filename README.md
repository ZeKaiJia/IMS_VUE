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
<li>已知问题(√): 依旧是跨域问题，暂时不能从后端获取菜单数据，所以只能在前端直接定义菜单，任何人都可以访问</li>
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
<li>已知问题(√): 查询到的数据分页尚未实现，不会真的要我在后端处理吧，不会吧不会吧</li>

### 2020.6.17 - Demo 0.1.2
<li>完成用户列表区，实现用户权限的关闭与开启并将其映射到开关组件中</li>
<li>优化了用户登录时的异步操作与请求判定(之前一直在整菜单的问题忘记了 login 页面)</li>
<li>为用户管理界面添加了删除等操作以及提示，接下来为其绑定后端接口</li>

### 2020.6.18 - Demo 0.1.6
<li>已知问题(√): 真的是佛了，每天都会遇到各种奇奇怪怪的问题而且还无法解决。今天的问题是，使用 get 的时候无法传递 request body ，但是可以传递 param。奇怪的是 post 登录信息的时候可以传递 request body，这算哪门子 bug，无解。因此我现在采用的方法是传入 ID 的参数进行精确查找，暂时不支持同步查找其他数据域</li>
<li>完成了添加用户的功能，点击按钮会弹出一个带有验证功能的表单，成功调用了后端接口</li>
<li>突然发现设置的 row-class-name 没有失效，发现原因在于 scoped 作用于太小，而 table 的样式比重很高，需要定义一个全局的 css ，然后通过 @import 在局部 style 中对全局样式进行导入</li>
<li>添加了用户的修改功能，能够修改用户数据( ID 不可更改)</li>
<li>添加了用户的删除功能，删除的时候会跳出安全提示框防止用户错删数据</li>
<li>优化了 Card 中的显示，将时间的换算统一成了个位补0，现在的界面已经很干净整洁了</li>
<li>现已完成所有用户列表的功能开发</li>
<li>期末考试，停更 2 周 (事实上是一个月)</li>

### 2020.7.14 - Demo 0.1.8
<li>修复了一个小 bug ，今天发现用户列表中搜索用户成功后会报错，大体的意思应该是搜索到的是一个对象，但是需求的是一个数组，应该就是外面少了个括号的原因，所以改用 push 将数据压入</li>
<li>完成了权限列表，与菜单中的子目录一一对应，后续再添加每个子目录中对应使用到的权限</li>
<li>初步完成角色列表，目前权限管理中的数据都是直接存在前端且不可变的</li>

### 2020.7.15 - Demo 0.2.0
<li>目前已经完成了菜单栏中用户管理和权限管理两大块内容，接下来的学生、教师和课程管理才是本系统所特有的，难点就在于不能继续参考电商系统，全部得自己写了</li>
<li>已知问题: 优化菜单栏结构的时候发现收起菜单时显示出的二级菜单会远离一级菜单，通过全局修改 css 无解</li>
<li>完成了学生列表的基本架构，扩展内容中只有少部分学生信息，后期可以增加</li>

### 2020.7.16 - Demo 0.2.3
<li>已知问题: 今天有一个问题困扰了我一个晚上，对于学生的性别由于只有男和女两种，为了节省空间我在数据库中设置的为 tinyint 类型，0代表女生，1代表男生。但是在我使用 update 修改了学生性别之后发现，性别可以改成1、2或3，唯独不能改成0。我通过调试和解读找到了后端程序中学生 Service 层中的一个漏洞，但是修复之后还是不能将男生改成女生，使用 postman 进行接口测试，发现返回的 data 数据中，性别已经改成了0，在使用 Navicat 查看数据库数据，发现还是1。看到这里我几近崩溃，计算机的世界太神奇了，我明明成功修改，数据居然没变，后来我只能使用1代表男生，2代表女生来解决这个问题，我相信问题的根源一定在 tinyint 上，有空再分析一下到底哪里出了问题</li>
<li>完成了学生列表的搜索功能</li>
<li>完成了学生列表的修改功能，其中日期和邮箱采用了复杂的正则表达式，可以精准判断所有日期和邮箱的正确性。对于日期和性别都使用了自定义的转换函数，日期对应 Timestamp 和 Data ，性别对应 String 和 tinyint</li>
<li>修复了用户列表中的显示错误，为学生列表详细列添加了新内容</li>

### 2020.7.17 - Demo 0.2.7
<li>完成了学生列表的添加和删除两个功能，测试添加接口时发现没有学生年龄，然后又发现其实学生的年龄和出生日期应该是相关联的，而后端刚开始写的时候并没有考虑到这一点，所以在前端 utils.js 中加入了学生出生日期自动计算年龄的功能，在调用添加接口时使用该函数自动获取年龄</li>
<li>优化了 Home 界面，添加了用户名的自动显示 (sessionStorage) 和一个头像</li>
<li>本来以为接下来应该写教师的部分了，看了下我的后端根本没有老师的实体，然后把前端页面的菜单等小错误都纠正了过来，所以接下来是课程管理，最后是将学生、课程和教师用户互相串在一起的成绩管理，成绩管理方面可能会涉及较多的内容</li>
<li>已知问题(√): 系统中的搜索功能暂时只能通过 ID 查询，后端的 SelectByAllInfo 暂时还不能使用，后期完工后可以优化这一部分，让用户通过任意关键词查找数据</li>
<li>完成了课程管理中的查询列表搜索功能和状态切换功能</li>
<li>修改 main 栏的长度为 90vh ，因为标题栏占有接近 90% 的空间，所以这样设置的话如果信息过多可以通过滚动 main 栏进行查看，而菜单栏不会随之滚动</li>

### 2020.7.18 - Demo 0.2.8
<li>完成了课程管理中的课程列表，感觉还缺了点什么。接下来是重头戏成绩管理，完成这部分之后主要的数据增删改查处理就完成了</li>

### 2020.7.20 - Demo 0.3.2
<li>已知问题: 发现一个 bug，使用搜狗输入法在课程学分中输入英文字母后，由于 input 中设置了字符只能输入数字，所以输入的英文字符会立马消失，但是在这之后无论输入什么都会提示数据类型错误导致无法提交表单，并且当取消对话框调用 reset 表单之后，再次打开还是可以看到学分输入框是有数据的，只有刷新页面才能解决</li>
<li>已知问题(√): 感觉数据信息中的创建时间和修改时间太碍事了，影响视觉，接下来可以考虑将其显示在拓展列中</li>
<li>添加了两处禁用锁的提示信息</li>
<li>完成了成绩列表的全部功能</li>
<li>将所有列表中的创建时间和修改时间都添加到了拓展列当中，视觉上更加美观了</li>
<li>重大更新: 在原始单条件查找的情况下拓展出了双条件查找功能，当用户输入学号时可以查找所有该学生的成绩，当用户输入课程号号时可以查找所有该课程的成绩，当用户同时输入学号和课程号时可以查找到单条成绩的数据信息</li>

### 2020.7.21 - Demo 0.3.7
<li>优化了双条件查找功能，现在会根据用户清除输入框的不同作出不同的查询</li>
<li>添加了根据分数计算 GPA 的函数</li>
<li>完成了学生成绩单的功能，</li>
<li>为 table 添加了 loading 特效</li>
<li>为页面添加了回到顶部小按钮</li>
<li>修复了学生列表中学生年龄计算错误的小 bug</li>

### 2020.7.25 - Demo 0.4.4
<li>修复了几个小 bug</li>
<li>权限管理添加说明</li>
<li>为图片添加了加载效果，根据学生性别加载不同的图片，自定义加载失败的效果，且两次显示同一张图片时不进行加载</li>
<li>使用了 npm，结果好像自动给我更新的 vue 的脚手架，一堆报错项目无法运行，后来重装了一下，搞不太清除发生了什么</li>
<li>已知问题: 尝试加入暗黑模式，失败。可是可以就是很丑，可能是不太适合我页面的风格设计，有时间可以自己设计不使用官方的主题配色</li>
<li>重大更新: 实现了分页功能，修复了查询数据后再操作分页导致数据还原的 bug。这里的分页采用的是纯前端的数据处理，设置一个数组读取数据库中的数据，另一个数组根据当前页码和每页显示条数截取第一个数组中的数据。对于换页后序号从 1 开始的问题采用添加 template 计算真正的序号然后显示</li>
<li>将 Info 类型的 Alert 修改为使用 Tooltip 进行提示</li>
<li>修改表格样式为斑马纹，表头颜色加深</li>
<li>增加了页脚提示备案信息和版权</li>
<li>为整个成绩单添加了加载效果</li>
<li>调整了成绩列表的搜索框为两个</li>
<li>修改了部分样式，是界面更美观</li>

### 2020.7.26 - Demo 0.4.6
<li>完成了课程成绩单，现在成绩管理的基本功能已经全部完成</li>
<li>完成了数据统计中的综合数据的基本内容，项目的基本内容马上就要完成了</li>

### 2020.7.27 - Demo 0.5.0
<li>优化数据处理，现在可以自动读取当前日期绘制热力图</li>
<li>新增404页面</li>
<li>完善了首页内容</li>
<li>已知问题(√×): 登录页面输入错误信息错误提示样式无法修改 ; 路由拦截失效 ; 点击面包屑首页跳转之后目录的 activePath 无法通过 this.$parent.activePath 改变</li>
<li>修复了 token 失效的问题，原因在于路由重定向和颁发 token 的顺序搞错了</li>
<li>在 css 样式中加入 /deep/ 来使样式覆盖 element ui 中内置的样式</li>

### 2020.8.5 - Demo 0.6.0
<li>找到了前端 ajax 请求无法携带 Cookie 信息导致可以登录但是无法获取 Shiro 权限，添加`axios.defaults.withCredentials = true`后解决了，说的很轻松其实花了我整整三天的时间，真的那时候因为 bug 饭都吃不下</li>
<li>修改了 ajax 的 request 和 response，添加了验证信息科跨域信息</li>
<li>我是真的肝，几天之内就整合了 Shiro 和 Vue 和 SSM，期间遇到了很多关于跨域的问题，好几天晚上都没怎么睡，不过好在问题都解决了</li>
<li>已知问题: 目前把权限方面全部重做了，交给后端 Shiro 管理，所以前端涉及管理员、教师、学生的权限相关的内容还需要做调整</li>
<li>由于重构了数据库表，因此有些数据的类型以及字段都修改过了</li>
<li>无权限状态并不会返回封装了 POJO 的 JSON 数据，而是自定义了一段异常提示，所以在请求失败的时候添加了出错异常的动态提醒，不过遇到一些未知问题，比如数据类型不匹配然后报了我后端没自定义的错误提示还是会有问题（浏览器报错）</li>

### 2020.8.6 - Demo 0.6.2
<li>删除了禁用和恢复权限时的 getList，这样在定向搜索数据之后再操作不会重新获取全部列表</li>
<li>用户属性中添加了备注和角色，与后端互相绑定，在添加用户、删除用户、修改用户时都会对 sys_user_role 表进行操作，并且将中英文进行转换</li>
<li>已知问题: 由于获取列表信息时需要先获取所有用户信息，再通过每一条用户的用户名发送请求查询其角色，所以如果用户较多，可能会在查询列表的时候发送大量的请求。由于后端权限设计的必要，以及分页的操作放在了前端，暂时还没有想出比较好的办法来减少网络开销。先记一笔等后期再处理。</li>
<li>接下来可以着手将之前没有写完的权限管理完善起来了</li>

### 2020.8.7 - Demo 0.6.9
<li>添加了数据的禁用，禁用不等于失去权限，而是不能进行修改和删除的操作，保护数据不被随意修改</li>
<li>优化了禁用和恢复数据的按钮，操作失败时会短暂延迟后复原而不是卡住不懂，但是连续按偶数次会重复调用函数导致错误，一般不会出现这种情况</li>
<li>完善了菜单功能，现在不同类型用户登录系统之后会看到不同的界面，这些都是在前端进行操作的，并没有涉及后端的数据库，为了防止用户越权调用接口，在不被允许的接口上都有注解 RequirePermissions 或 RequireRoles</li>
<li>修正了重构之后导致的数据统计部分的错误</li>
<li>为了符合页面布局，现在每页默认显示 7 条数据</li>
<li>通过后端数据完成了权限的获取，但是暂时还不支持自定义</li>
<li>将欢迎界面的链接改成了饿了吗 ui 自带的标签</li>
<li>优化了用户列表密码的显示，现在不会密文显示了。但是并没有真正的加密，只是不推荐查看其它用户的密码</li>
<li>由于用户添加和删除权限并具备实际功能（除了调用权限其他对后端代码不造成影响），所以目前权限不支持自定义，只能修改名字</li>
<li>明天赶赶工把角色分配权限的内容完成，然后可以准备发布测试版开始第二轮用户测试了</li>

### 2020.8.8 - Demo 0.7.2
<li>完善了权限页面的增删改查功能</li>
<li>完成了角色页面的角色修改等小细节</li>
<li>使用 dialog 和 transfer 的组合实现了给角色分配权限的功能（真的是太难搞啦，中途出现了很多bug）</li>
<li>至此可以说第二阶段已经完成，明天先部署到服务器开放测试，过几天重构一下后端的代码</li>

### 2020.8.9 - Demo 0.8.0
<li>登录界面使用了学校的高斯模糊背景图，并且加入了验证码系统</li>
<li>权限等级、性别等属性采用选择器的方式体现</li>
<li>学生出生日期使用日期选择器，由于获取到的时间不是 UTC 的标准时间，而后端使用的是 UTC 的时间，会相差 8 小时，对设置的日期进行了转换</li>
<li>优化了权限分配的功能，现在可以同时看到权限名和后端对应的权限代码。并且对于这块比较重要的提醒采用弹出 dialog 的方式告诉用户</li>
<li>优化了 data 中的一些属性，比如数字类的使用了 v-model.number 来绑定</li>
<li>优化了详细拓展列的布局</li>
<li>接下来想试一试加入 rememberMe 的功能，以及获取用户修改数据的的修改人属性</li>

### 2020.8.13 - Demo 0.8.2
<li>修复了一个更新用户数据时用户角色出错的 bug</li>
<li>优化了登录失败的提示信息，根据后端抛出的异常来提示</li>
