import { createApp } from "vue";
import App from "./App.vue";
import "@jobbnorge/jn-components/assets/css/jn_global_styles.css";

import { createI18n } from "vue-i18n";
import { localizationService } from "@jobbnorge/js-services/localization.service";
import en_common from "./localizations/en.json";
import nb_NO_common from "./localizations/nb-NO.json";

const i18n = createI18n({
  locale: localizationService.getLocalization(),
  fallbackLocale: "nb-NO",
  globalInjection: true,
  messages: {
    en: en_common,
    "nb-NO": nb_NO_common,
  },
});

const app = createApp(App);

app.use(i18n);
app.mount("#app");
