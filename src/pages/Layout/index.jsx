import { Layout, Menu, Popconfirm } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { fetchUserInfo,clearUserInfo } from "@/store/modules/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Header, Sider } = Layout;

const items = [
  {
    label: "首页",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "文章管理",
    key: "/article",
    icon: <DiffOutlined />,
  },
  {
    label: "创建文章",
    key: "/publish",
    icon: <EditOutlined />,
  },
];

const GeekLayout = () => {
  //1.实现点击跳转二级路由
  const navigate = useNavigate()
  const menuClick = (route) => {
    console.log(route)
    navigate(route.key)
  }
  //2.实现点击高亮
  const location = useLocation()
  const selectedKeys = location.pathname

  //3.获取用户信息
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])
  const userInfo = useSelector((state) => state.user.userInfo)
  //4.退出登录
  const logout = () => {
    dispatch(clearUserInfo())
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={logout}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKeys}
            items={items}
            style={{ height: "100%", borderRight: 0 }}
            onClick={menuClick}
          ></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default GeekLayout;
