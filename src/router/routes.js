import {remoteViews} from "@remote/views"
// import remoteBigData from "@remote/bigData"

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/Index.vue"),
  },
  {
    path: "/bigData",
    name: "bigData",
    meta: {
      title: "大数据平台",
    },
    // component: remoteBigData,
  },
];

export default routes;
