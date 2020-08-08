import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Alert,
  Avatar,
  Image,
  Backtop,
  Loading,
  Popover,
  Carousel,
  CarouselItem,
  Divider,
  Link,
  Transfer
} from 'element-ui'
import VueLazyload from 'vue-lazyload'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Avatar)
Vue.use(Image)
Vue.use(Backtop)
Vue.use(Loading)
Vue.use(Popover)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Divider)
Vue.use(Link)
Vue.use(Transfer)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  loading: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  attempt: 1
})
