import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-xhr-backend"

i18n
    .use(LanguageDetector)
    .use(Backend)
    .use(initReactI18next)
    .init({
        // if i want to set initial value, otherwise remove this to be automatic
        lng: "ar",
        load: "languageOnly", // will prevent backend from loading en-US for example
        backend: {
            // loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        detection: {
            // order: ["localStorage",
            // "htmlTag", "cookie", "path" 
            // ],
            caches: ["localStorage"], // cache user language on
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        initImmediate: false,
    })
export default i18n