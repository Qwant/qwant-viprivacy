&nbsp;

<p align="center">
  <img src="https://user-images.githubusercontent.com/1442690/168590504-defc3ec9-0b78-4d85-b87f-bb76724ca665.png" width="300px" alt="Qwant VIPrivacy Browser Extension" />
</p>
<h3 align="center">Ad blocker with advanced privacy protection features</h3>
<p align="center">
  Qwant VIPrivacy is a fast and lightweight ad blocking browser extension<br/>that effectively blocks all types of ads and trackers.
</p>

<p align="center">
    <a href="https://qwant.com/">Qwant.com</a> |
    <a href="https://twitter.com/Qwant_FR">Twitter</a> |
    <a href="https://t.me/ClubQwant">Telegram</a>
</p>

<hr />
<br />

- [Installation](#installation)
  - [Chrome and Chromium-based browsers](#installation-chrome)
  - [Firefox](#installation-firefox)
  - [Microsoft Edge](#installation-edge)
- [Reporting issues](#contribution-reporting)
- [Development](#dev)
  - [Requirements](#dev-requirements)
  - [How to build](#dev-build)
  - [Linter](#dev-linter)
  - [Localizations](#dev-localizations)
- [Minimum supported browser versions](#minimum-supported-browser-versions)
- [Fork](#fork)
- [Privacy](#privacy)
- [License](#license)

<br />
<hr />

<a id="installation"></a>

## Installation

<a id="installation-chrome"></a>

### Chrome and Chromium-based browsers

You can get the latest available Qwant VIPrivacy Extension version from the [Chrome Web Store](https://chrome.google.com/webstore/detail/qwant/hnlkiofnhhoahaiimdicppgemmmomijo).

<a id="installation-firefox"></a>

### Firefox

You can get the latest version of Qwant VIPrivacy Extension from the [Mozilla Add-ons website](https://addons.mozilla.org/fr/firefox/addon/qwantcom-for-firefox/).

<a id="installation-edge"></a>

### Microsoft Edge

The latest stable version of Qwant VIPrivacy browser extension is available in [Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/qwant/eljplgljphmgjhnalbganhenlcapgnne).

<a id="contribution-reporting"></a>

## Reporting issues

GitHub can be used to report a bug or to submit a feature request. To do so, go to [this page](https://github.com/Qwant/qwant-viprivacy/issues) and click the _New issue_ button.

> **Note:** for the filter-related issues (missed ads, false positives etc.) use the [dedicated repository](https://github.com/AdguardTeam/AdguardFilters).

<a id="dev-requirements"></a>

## Development

### Requirements

- [Node.js LTS](https://nodejs.org/en/download/)
- [Yarn v1.22](https://yarnpkg.com/en/docs/install/)

Install local dependencies by running:

```
yarn install
```

<a id="dev-build"></a>

### How to build

**Building the dev version**

Run the following command:

```
yarn dev
```

This will create a build directory with unpacked extensions for all browsers:

```
  build/dev/edge
  build/dev/chrome
  build/dev/firefox-amo
  build/dev/firefox-standalone
```

**Building the beta and release versions**

Before building the release version, you should manually download necessary resources: filters and public suffix list.

```
yarn resources
```

You will need to put `mozilla_credentials.json` file in the `./private` directory. This build will create unpacked extensions and then pack them (xpi for Firefox).

**How to run tests**

```
yarn test
```

<a id="dev-linter"></a>

### Linter

Setup `eslint` in your editor to follow up with `.eslintrc`. Linting runs on every commit.

Or you can validate linting rules manually:

```
yarn lint
```

<a id="dev-localizations"></a>

### Localizations

To validate translations run:

```
yarn locales:validate
```

To show locales info run:

```
yarn locales:info
```

<a id="minimum-supported-browser-versions"></a>

## Minimum supported browser versions

| Browser                 | Version |
| ----------------------- | :-----: |
| Chromium Based Browsers |   79    |
| Firefox                 |   78    |
| Edge                    |   79    |

<a id="fork"></a>

## History of the codebase

Qwant VIPrivacy is based on the excellent [Adguard Browser Extension](https://github.com/AdguardTeam/AdguardBrowserExtension). We chose to fork Adguard because it provides a solid basis for blocking trackers. We felt that it is a good starting point. It allows us to focus on providing a clean user-interface and curated defaults.

Thank you to Adguard for providing a fantastic foundation for this project.

<a id="privacy"></a>

## Privacy

Qwant VIPrivacy uses APM ([Application Performance Monitoring](https://www.elastic.co/guide/en/apm/guide/current/apm-overview.html))to report bugs, catch errors and perform basic stats. Qwant VIPrivacy does not collect any PII (Personally Identifiable Information).

**TL;DR** This is the dashboard we use to observe general, ananymous, trends and help keep an eye on the health of the extension.

<details><summary>Screenshot</summary>

![image](https://user-images.githubusercontent.com/1442690/168628853-57494bad-d90d-4969-af4d-468108eca1bb.png)

</details>

APM is optional and can be fully turned off during the onboarding or at any time. Enabling APM allows Qwant to resolve technical issues and bugs faster and provide a better user experience.

The basic information that goes through APM:
- Browser Type (Firefox, Chrome, Edge, etc...)
- Extension version (v1, v2, etc...)
- Basic stats (Do people prefer the "standard" or "strict" level of protection, etc..)
- Technical error reports (Did we make a mistake and how can we fix it)

<a id="license"></a>

## License

GNU General Public License v3.0
