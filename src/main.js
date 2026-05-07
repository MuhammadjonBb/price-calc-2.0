import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

const app = createApp(App);

app.component("Toaster", Toaster);

app.use(router).mount("#app");
