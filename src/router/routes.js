import {remoteViews} from "@remote/views"
// import remoteBigData from "@remote/bigData"

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/components/layout/index.vue"),
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "canvasLottery",
        name: "canvasLottery",
        component: () => import("@/views/canvas/lottery.vue"),
      },
    ],
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
