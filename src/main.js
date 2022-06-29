import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import "@jobbnorge/jn-components/assets/css/jn_global_styles.css";

const app = createApp(App);

app.mount("#app");
