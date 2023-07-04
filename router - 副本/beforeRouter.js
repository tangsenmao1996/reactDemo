import store from "@/redux/index.js";
import { useEffect } from "react";
// import { GET_HISTORY } from '@/redux/action'



const beforeRouter = (props) => {
  let from = store.getState().History.From;
  // console.log('beforeRouter', from);
  let to = props.meta.path;
  // console.log('beforeRouter', to);

  //点击同一路径不重新渲染
  if (from === to) return null;


  //不同路径更改redux的历史纪录
  store.dispatch({ type: 'CHANGE_FROM', From: to });

  // console.log(store.getState());


  //面包屑
  if (props.meta) {
    let History = [
      props.meta.father.resourceName,
      props.meta.title
    ]
    store.dispatch({ type: 'GET_HISTORY', History });
  }
  // console.log('store', props.meta);

}
export default beforeRouter;
