# Hanabi.cards

Hanabi is a cooperative card game created by French game designer Antoine Bauza published in 2010 by Asmodée Éditions.

Being locked down in March 2020, we were willing to play the Hanabi game remotely. Thus, we decided to create an online mobile-friendly version of the game since we both have fun coding and playing.

Like us, please buy the [physical version](https://fr.asmodee.com/fr/games/hanabi/products/hanabi/) to support its creator if you like this game!

If you enjoy our app, you can also [buy us a coffee](https://www.buymeacoffee.com/hanabicards) ☕️. It will help cover the Firebase costs!


## Contribute

We are so happy to see people join the project and contribute to the repository. Do not hesitate to add an issue or open a pull request.

### Issues

Open an issue everything you want to report
- an improvement
- a missing feature you would like to see in the app
- a bug

Do not hesitate to give us context on what you were trying to achieve, what page you were on, what user story, etc.

### Code

##### Frameworks

The project uses the [Next.JS](https://nextjs.org/) React framework with Typescript and [Firebase Realtime Database](https://firebase.google.com/) as a back-end.

You'll need to setup a free Firebase account to test the project locally.

##### <a id="setup"></a>Local setup and development

1. Clone the project locally on your computer

2. Execute `yarn` to install dependencies

```bash
# Install dependencies
$ yarn

# Configure Firebase
$ cp .env.sample && open .env

# Launch development environment
$ yarn dev
```

You'll probably see the following answer
> ready - started server on http://localhost:3000
> info  - Loaded env from .env

4. Open your browser on `http://localhost:3000`


### Help us translate

The game is currently available in English, French, Dutch, Spanish and Russian thanks to a handful of contributors! Thanks a lot again!

We use react-i18n for translations. Documentation can be found [here](https://react.i18next.com/).
Want to add a new language? Here is a short intro on how to proceed.

#### How to add a new language

First, setup the project locally and find the 2-letter language code of the new language you want to add. We use the standard [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). `en` for English, `es` for Spanish, `it` for Italian...

**Setup**

- [Fork](https://github.com/bstnfrmry/hanabi/fork) the repository

- Follow the [Local setup and development](#setup) instructions

**Create the translation file and translate**

- Duplicate an exisiting translation file in the `locale` folder (/src/locales) and name it after the new langague you want to add. For example, `it.ts` if you want to add the Italian language.
<br/>

- Edit the language code on line 3  `export const it = {`

ℹ️ How the translations are composed
`tagline: "Play Hanabi online with friends!",`
The first element of every line is the translation name (keep it as is and do not translate it). The translation itself is located under the double-quotes.

- Start translating!

> For example,
> `welcome: "Benvenuto",` // Welcome in Italian

ℹ️ If you see html elements in your translation like `<1>`, you can refer to the next section for additional information.

**Import the new languaage**

- Import your file here [src/lib/i18n.ts](https://github.com/bstnfrmry/hanabi/tree/master/src/lib/i18n.ts) and add the new language in the i18n ressources initiatlization.

``` Typescript
(...)
import { en } from "~/locales/en";
import { es } from "~/locales/es";
import { fr } from "~/locales/fr";
import { it } from "~/locales/it"; // italian
import { nl } from "~/locales/nl";
import { ru } from "~/locales/ru";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      es: {
        translation: es,
      },
      it: { // italian
        translation: it,
      },
```

**Add it to the selector**

- Add the new language to the language selector dropdown. File `src/components/languageSelector.tsx`

```Typescript
const Languages = {
  en: "English",
  fr: "Français",
  es: "Español",
  nl: "Dutch",
  ru: "Russian",
  it: "Italian"
};
```

- Commit your code and open a pull request with your changes on Github.



**Some advice**
If you started some work and did not have time to finish, do not hesitate to open a pull request labelling it as WIP (work in progress). It will help us know someone is currently working on the project so as to let them know if a new feature has been added (with new translations) or to help them continue translating directly on the open branch.

#### HTML elements in translations

- Text under double brackets refer to variables. Do not translate them.

> discardPile: "discard ({{ discardLength }})",

ℹ️ The following `discardPile` translation will be displayed as `discard (13)` in English when 13 cards are in the discard pile.

- `<1>...</1>` or `<0>...</0>` are HTML elements. Usually, they are used to apply some transformation on the encapsuled expression (like color, font weight, text decoration, etc.) or enclose objects.

#### Need to modify the code?

If your language requires adapting the code or splitting a translation and you do not know how to implement these modifications, do not hesitate to ask for help on [Github](https://github.com/bstnfrmry/hanabi/issues/) or [Discord](https://discord.gg/QEWtYdW).
