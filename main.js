import { createApp } from "vue";
import App from "./App.vue";
import { createPinia as createPinia2 } from "./js/create/createpinia";
import { storage } from "./js/plugin/storage";
const pinia2 = createPinia2();
pinia2.use(storage);
createApp(App).use(pinia2).mount("#app");
