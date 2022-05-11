&nbsp;

<p align="center">
  <img src="https://cdn.adguard.com/public/Adguard/Common/adguard_extension.svg" width="300px" alt="AdGuard Browser Extension" />
</p>
<h3 align="center">Ad blocker with advanced privacy protection features</h3>
<p align="center">
  AdGuard is a fast and lightweight ad blocking browser extension<br/>that effectively blocks all types of ads and trackers.
</p>

<p align="center">
    <a href="https://qwant.com/">Qwant.com</a> |
    <a href="https://twitter.com/Qwant_FR">Twitter</a> |
    <a href="https://t.me/ClubQwant">Telegram</a>
    <br /><br />
    </a>
</p>

<hr />

> Qwant VIPrivacy does not collect any information about you, and does not participate in any acceptable ads program.

- [Installation](#installation)
  - [Chrome and Chromium-based browsers](#installation-chrome)
  - [Firefox](#installation-firefox)
  - [Microsoft Edge](#installation-edge)
- [Contribution](#contribution)
  - [Testing AdGuard](#contribution-testing)
  - [Reporting issues](#contribution-reporting)
  - [Other options](#contribution-other)
- [Development](#dev)
  - [Requirements](#dev-requirements)
  - [How to build](#dev-build)
  - [Linter](#dev-linter)
  - [Update localizations](#dev-localizations)
- [Minimum supported browser versions](#minimum-supported-browser-versions)
- [License](#license)

<a id="installation"></a>

## Installation

<a id="installation-chrome"></a>

### Chrome and Chromium-based browsers

You can get the latest available AdGuard Extension version from the [Chrome Web Store](https://agrd.io/extension_chrome).

<a id="installation-firefox"></a>

### Firefox

You can get the latest version of AdGuard Extension from the [Mozilla Add-ons website](https://agrd.io/extension_firefox).

<a id="installation-edge"></a>

### Microsoft Edge

The latest stable version of AdGuard browser extension is available in [Microsoft Store](https://agrd.io/extension_edge).

<a id="contribution"></a>

## Contribution

We are blessed to have a community that does not only love AdGuard, but also gives back. A lot of people volunteer in various ways to make other users' experience with AdGuard better, and you can join them!

We, on our part, can only be happy to reward the most active members of the community. So, what can you do?

<a id="contribution-testing"></a>

### Testing AdGuard

You can get a beta version of AdGuard Browser Extension for any browser. All necessary information on this topic can be found on a [dedicated page on our website](https://adguard.com/beta.html).

<a id="contribution-reporting"></a>

### Reporting issues

GitHub can be used to report a bug or to submit a feature request. To do so, go to [this page](https://github.com/Qwant/qwant-viprivacy/issues) and click the _New issue_ button.

> **Note:** for the filter-related issues (missed ads, false positives etc.) use the [dedicated repository](https://github.com/AdguardTeam/AdguardFilters).

<a id="contribution-other"></a>

### Other options

Here is a [dedicated page](https://adguard.com/contribute.html) for those who are willing to contribute.

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

**How to run tests**

```
yarn test
```

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

<a id="dev-linter"></a>

### Linter

Despite our code may not currently comply with new style configuration,
please, setup `eslint` in your editor to follow up with it `.eslintrc`

<a id="dev-localizations"></a>

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

<a id="license"></a>

## License

GNU General Public License v3.0
