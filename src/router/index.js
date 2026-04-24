import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/Login.vue";
import Orders from "../components/Orders.vue";
import Main from "../components/ProductList.vue";

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

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  // если не залогинен — только /login доступен
  if (!token && to.path !== "/price-calc/login") {
    return "/price-calc/login";
  }

  // если залогинен — не пускаем на login
  if (token && to.path === "/login") {
    return "/price-calc/";
  }

  return true;
});
export default router;
