import { MODULE_ID } from "./main.js";

export const PACKS_BY_LANGUAGE = {
    en: { tables: "mmmm", injuries: "injuries", items: "mmmmi", journals: "mmmmj" },
    "pt-BR": { tables: "mmmm-pt-BR", injuries: "injuries-pt-BR", items: "mmmmi-pt-BR", journals: "mmmmj-pt-BR" },
};

export function registerSettings() {
    const settings = {
        language: { scope: "client", config: true, type: String, choices: { en: "mmm.settings.language.en", "pt-BR": "mmm.settings.language.ptBR" }, default: "en", onChange: () => window.location.reload() },
        applyOnDamage: { scope: "world", config: true, type: Boolean, default: true },
        damageThreshold: { scope: "world", config: true, type: Number, range: { min: 0.1, max: 1, step: 0.05 }, default: 0.5 },
        applyOnDown: { scope: "world", config: true, type: Boolean, default: true },
        applyOnCrit: { scope: "world", config: true, type: Boolean, default: true },
        applyOnCritSave: { scope: "world", config: true, type: Boolean, default: true },
        triggerNpc: { scope: "world", config: true, type: Boolean, default: false },
        selfdestruct: { scope: "world", config: true, type: Boolean, default: true },
        autoApplyOngoing: { scope: "world", config: true, type: Boolean, default: false },
    };
    for (const [key, value] of Object.entries(settings)) { value.name ??= `${MODULE_ID}.settings.${key}.name`; value.hint ??= `${MODULE_ID}.settings.${key}.hint`; game.settings.register(MODULE_ID, key, value); }
}
export function getSetting(key) { return game.settings.get(MODULE_ID, key); }
export function getPackName(type) { return PACKS_BY_LANGUAGE[getSetting("language")]?.[type] ?? PACKS_BY_LANGUAGE.en[type]; }
