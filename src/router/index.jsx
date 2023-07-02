import { BrowserRouter as Router, useRoutes, Navigate } from "react-router-dom";
import React, { lazy } from "react";
import A from "../views/A";
import B from "../views/B";
import C from "../views/C";
import D from "../views/child/D";
import E from "../views/child/E";

const lazyLoad = (moduleName) => {
  const Module = lazy(() => import(`views/${moduleName}`));
  return <Module />;
};

const Appraisal = ({ children }) => {
  console.log("进入守卫");
  //localStorage.getItem("token")
  const token = "abc";
  return token ? children : <Navigate to="/c" />;
};

let routes = [
  {
    path: "/",
    element: (
      <Appraisal>
        <A />
      </Appraisal>
    ),
    children: [
      {
        path: "/",
        element: <D />,
      },
      {
        path: "/e",
        element: <E />,
      },
    ],
  },
  {
    path: "/B",
    element: <B />,
  },
  {
    path: "/c",
    element: <C />,
  },
];

//定义routes组件
function RoutesList() {
  let Element = useRoutes(routes);
  return Element;
}

function RouterView() {
  return (
    <Router>
      <RoutesList></RoutesList>
    </Router>
  );
}

export default RouterView;
