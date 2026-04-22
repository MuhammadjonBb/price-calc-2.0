import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/Login.vue";
import Orders from "../components/Orders.vue";
import Main from "../components/productList.vue";

const routes = [
  {
    path: "/price-calc/",
    name: "Main",
    component: Main,
  },
  {
    path: "/price-calc/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/price-calc/orders",
    name: "Orders",
    component: Orders,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
