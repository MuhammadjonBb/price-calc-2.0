import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Orders from "../components/Orders.vue";
import Main from "../components/ProductList.vue";

const routes = [
  { path: "/", name: "Main", component: Main },
  { path: "/login", name: "Login", component: Login },
  { path: "/orders", name: "Orders", component: Orders },
];

const router = createRouter({
  history: createWebHistory("/price-calc/"),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (!token && to.path !== "/login") return "/login";
  if (token && to.path === "/login") return "/";
  return true;
});

export default router;
