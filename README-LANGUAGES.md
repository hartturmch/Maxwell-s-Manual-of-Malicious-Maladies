# Maxwell's Manual of Malicious Maladies Languages

This copy includes the languages declared in `module.json`:

- `en`: the original module language;
- `pt-BR`: the translation in `languages/pt-BR.json`.

## Choosing a language

Open **Configure Settings → Module Settings → Maxwell's Manual of Malicious Maladies → Language** and select **English** or **Português (Brasil)**. Foundry reloads to apply the change. The selected language is a client setting, so each user can choose independently.

## Adding a new language

1. Copy `languages/en.json` to `languages/<locale>.json`, using a BCP-47 locale such as `es` or `fr`.
2. Translate message values only. Keep keys (`mmm.dialog.roll`, `mmm.settings.applyOnDamage`, and so on), placeholders such as `{actor}`, and HTML tags such as `<strong>` unchanged.
3. Add the file to the `languages` array in `module.json`:

```json
{
  "lang": "es",
  "name": "Español",
  "path": "languages/es.json"
}
```

4. Add the option to the selector in `scripts/settings.js`:

```js
choices: {
  en: "mmm.settings.language.en",
  "pt-BR": "mmm.settings.language.ptBR",
  es: "mmm.settings.language.es"
}
```

5. Add the label to every language file:

```json
"language": {
  "name": "Language",
  "hint": "Language used by the module.",
  "en": "English",
  "ptBR": "Português (Brasil)",
  "es": "Español"
}
```

6. Run `npm run build` and validate the selection in Foundry. Do not translate keys, IDs, formulas, placeholders, or mechanical references.

Compendium content in `packs/` is separate from the interface and requires its own translation step.
