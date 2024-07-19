import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.language || "en";
  }
};

function loadLocaleMessages() {
  const locales: Record<string, VueI18n.LocaleMessages> = import.meta.globEager(
    `./locales/*.json`
  );
  const messages: VueI18n.LocaleMessages = {};
  Object.keys(locales).forEach((key) => {
    const matched = key.match(/\/([A-Za-z0-9-_]{2})\./i);
    if (matched && matched.length > 1) {
      try {
        const locale = matched[1];
        messages[locale] = locales[key];
      } catch (e) {
        console.error("e", e);
      }
    }
  });
  return messages;
}

const storageLanguage = localStorage.getItem("lang");
const userLanguage = storageLanguage || getNavigatorLanguage().slice(0, 2);

/*
 * For translations use https://poeditor.com/projects/view?id=333387
 */
export default new VueI18n({
  locale: userLanguage,
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});
