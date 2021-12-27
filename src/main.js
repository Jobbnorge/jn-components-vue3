import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import "@jobbnorge/jn-components/assets/css/jn_global_styles.css";

const i18n = createI18n({
  locale: "nb-NO",
  fallbackLocale: "nb-NO",
});
const app = createApp(App);
app.use(i18n);
app.mount("#app");
