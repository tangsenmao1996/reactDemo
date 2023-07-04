import { useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";

function Guard({ element, beforeRouter, meta }) {
  // console.log('guard', store)

  //路由重定向
  let Location = useLocation();
  // console.log('lk', Location);

  let navigate = useNavigate();
  let { pathname } = Location;
  let path = null;

  useEffect(() => {
    if (beforeRouter) {
      //执行守卫
      path = beforeRouter({ pathname, meta });
      if (path instanceof Promise) {
        path.then((res) => {
          if (res && res !== pathname) {
            // console.log("测试", res);
            navigate(res, { replace: true });
          }
        });
      }
    } else {
      if (path && path !== pathname) {
        // console.log('pathname')
        element = <Navigate to={path} replace={true}></Navigate>;
      }
      if (typeof element != "function") {
        // console.log('function')
        return element;
      }
    }
  });


  //返回最终元素
  return element;
}

export default Guard;
