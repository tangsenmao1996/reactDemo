//整个路由文件
import React, { Suspense, useEffect, useMemo } from "react";
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  useRoutes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// import { useSelector } from "react-redux";
import store from "@/redux/index";
// import { GET_MENU } from "@/redux/action";
// import axios from "axios";
import Login from "/src/views/Login";
import Index from "/src/views/Index";
import Error from "/src/views/error";
import { getCookie } from '@/utils/cookie.js'
import { getStorage } from '@/utils/html5.js'

import beforeRouter from './beforeRouter'
import Guard from './guard'

//定义路由view组件
function RouterView() {

  //从redux中取menu   这个menu是在
  let menu = store.getState().User.Menu;
  // let navigate = useNavigate();

  useMemo(() => {
    // console.log('subscribe', menu);
    let router = [];
    menu.map((item) => {
      if (item.children && item.children.length) {
        item.children.map((citem) => {
          router.push(citem);
        })
      }
    });
    //添加默认路由
    router.push({
      path: "/",
      element: <Navigate to="/registerBefore"></Navigate>,
    });
    // console.log('router', router);
    routes[0].children = router;

    // navigate("/", { replace: true });
  }, ...(menu))

  let element = useRoutes(routes);
  return element;
}

//定义配置文件
let routes = [
  {
    path: "/",
    element: (
      <CheckLogin>
        <Index />
      </CheckLogin>
    ),
    children: [

    ],
  },
  {
    path: "/login",
    element: <NotLogin><Login /></NotLogin>,
  },
  {
    path: "/error",
    element: <Error />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];


//将组件转为懒加载组件
function lazyLoad(url, meta, beforeRouter) {
  let LazyEle = null;

  // console.log('lz', meta);
  LazyEle = React.lazy(() => import(url));
  let Lazy = <Suspense fallback={<div>loading</div>}><LazyEle /></Suspense>
  return (
    <Guard meta={meta} element={Lazy} beforeRouter={beforeRouter}>
    </Guard>
  );
}


//定义接收菜单
let menu = null;
let user = null;
//定义认证组件
//利用的是插槽
function CheckLogin({ children }) {
  // console.log('CL')

  //检测是否登录
  let token = getCookie("_token");
  // console.log('guard', token)
  if (!token) {
    alert('该页面必须登录后才能访问');
    return (<Navigate to="/login"></Navigate>);
  }
  if (!menu) {
    let LSmenu = getStorage('menu');
    // console.log('router1', LSmenu);

    menu = Patter(LSmenu);
    // console.log('router2', menu);

    // console.log('router2', state);
    store.dispatch({ type: 'GET_MENU', userMenu: menu });
    // let state = store.getState()
    // console.log('getstate', state);
  }
  if (!user) {
    console.log('!user');
    let LUser = getStorage('user');
    store.dispatch({ type: 'GET_USER', userInfo: LUser });
  }
  return children;
}

//登陆后不再返回login页面
function NotLogin({ children }) {
  // console.log('NL')
  let token = getCookie("_token");
  if (token) {
    return <Navigate to="/"></Navigate>;
  } else {
    return children;
  }
}

//解析menu菜单 解析为路由配置格式
//递归的关键就是数组要在函数内循环外
//单个对象要在循环内
//每次循环要push  单个对象
function Patter(arr, theFather) {
  let array = [];
  // console.log('patter', arr)
  arr.forEach((item) => {
    let single = {};
    // console.log('loop', array);
    // console.log('forEach', item);
    if (item.children && item.children.length) {
      // console.log('father');
      single.children = Patter(item.children, item);
      single.label = item.resourceName;
      single.key = String(item.resourceId);
    }

    if (item.children === null) {
      // console.log('children')
      single.path = item.resourceUrl,
        single.meta = {
          title: item.resourceName,
          path: item.resourceUrl,
          father: theFather
        };
      //加入懒加载元素、meta信息、路由守卫
      single.element = lazyLoad(`/src/views/child${item.resourceUrl}`, single.meta, beforeRouter);
      single.label = item.resourceName;
      single.key = item.resourceUrl;
    }
    array.push(single)
  });
  // console.log('patterFN', array)
  return array;
}



//Router在此文件的最开始import引入，定义了路由方式是hash还是history
//Router

//定义路由组件
function RouterComponent() {
  return (
    <Router>
      <RouterView ></RouterView>
    </Router>
  );
}


export default RouterComponent;
