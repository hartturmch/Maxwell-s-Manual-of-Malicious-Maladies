// Substitui a fórmula de duração de uma lesão (ex.: [[1d6]] dias) pelo valor rolado, em qualquer idioma.
// A palavra da unidade depois da fórmula não precisa estar em inglês: tenta primeiro as unidades conhecidas
// (idioma atual + inglês) e, se nenhuma servir, aceita qualquer palavra (letras Unicode) logo após a fórmula.

const EN_UNITS = {
    years: ["year", "years"],
    months: ["month", "months"],
    days: ["day", "days"],
    hours: ["hour", "hours"],
    minutes: ["minute", "minutes"],
    seconds: ["second", "seconds"],
    rounds: ["round", "rounds"],
    turns: ["turn", "turns"],
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Tags de formatação que podem envolver a fórmula (ex.: <strong>, <span style="color:...">)
const OPEN = "((?:<(?:strong|em|b|span)\\b[^>]*>\\s*)*)";
const CLOSE = "((?:\\s*<\\/(?:strong|em|b|span)>)*)";
const GENERIC_WORD = "[\\p{L}\\p{M}][\\p{L}\\p{M}\\p{N}'’.-]*";

/** Palavras conhecidas para uma unidade (idioma atual via `localize` + inglês). */
export function unitWords(units, localize) {
    const words = new Set(EN_UNITS[units] ?? []);
    if (typeof localize === "function") {
        for (const form of ["one", "other"]) {
            const key = `mmm.units.${units}.${form}`;
            const text = localize(key);
            if (text && text !== key) words.add(text);
        }
    }
    return [...words];
}

function build(roll, word) {
    // entre a fórmula e a unidade podem existir espaços e tags de abertura (ex.: <span> colorido da unidade)
    return new RegExp(`${OPEN}${roll}${CLOSE}(\\s*(?:<(?:strong|em|b|span)\\b[^>]*>\\s*)*)(${word})(?![\\p{L}\\p{M}])`, "iu");
}

function replacer(value) {
    return (match, open, close, space, word) => {
        const opens = (open.match(/<[a-z]/gi) ?? []).length;
        const closes = (close.match(/<\//g) ?? []).length;
        if (!opens && !closes) return `<strong>${value}</strong>${space}${word}`;
        if (opens === closes) return `${open}${value}${close}${space}${word}`;
        return `${open}<strong>${value}</strong>${close}${space}${word}`; // marcação desbalanceada: preserva e destaca
    };
}

/**
 * @param {string} html     texto com a fórmula
 * @param {string} formula  fórmula de duração (ex.: "1d6")
 * @param {number} value    resultado rolado
 * @param {string[]} [words] unidades conhecidas para o idioma (opcional)
 */
export function applyDurationToText(html, formula, value, words = []) {
    const roll = `\\[\\[\\s*(?:\\/r\\s+)?${escapeRe(formula)}\\s*\\]\\]`;
    const known = [...words].filter(Boolean).sort((a, b) => b.length - a.length).map(escapeRe);
    if (known.length) {
        const specific = build(roll, known.join("|"));
        if (specific.test(html)) return html.replace(specific, replacer(value));
    }
    const generic = build(roll, GENERIC_WORD);
    return html.replace(generic, replacer(value));
}
