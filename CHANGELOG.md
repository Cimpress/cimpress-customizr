# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.1.11] - 2019.09.11
### Changed
- Fix setPreferredMcpLanguage.

## [1.1.10] - 2019.09.10
### Changed
- Updating dependencies to address potential vulnerabilities.

## [1.1.9] - 2019.07.12
### Changed
- Updating axios dependency to address potential vulnerability.

## [1.1.8] - 2019.06.23
### Changed
- Updating axios dependency to address potential vulnerability.

## [1.1.7] - 2019.04.25
### Changed
- Removed dependency on moment-timezone in favor of a file containing the list of timezones.  Removes ~1MB of package size.

## [1.1.6] - 2019.01.17
### Fixed
- Pass shouldResetTimeout=true to axiosRetry to ensure better retry results

## [1.1.3] - 2018.12.05
### Fixed
- Fixed exception when reading languages in case of no data.

## [1.1.2] - 2018.10.09
### Fixed
- Fixed failure to save settings for users with no previous settings.

## [1.1.1] - 2018.10.09
### Fixed
- Fixed incomplete validation for timezones

## [1.1.0] - 2018.10.04
### Added
- Added return value for all set* methods

## [1.0.2] - 2018.09.11
### Added
- Added `setPreferredMcpSettings` helper to validate and update all users settings in a single call

## [1.0.1] - 2018.09.05
### Added
- Removed rfc5646 dependency as it is causing issues with minifications

## [1.0.0] - 2018.09.05
### Added
- Added get/setPreferredTimezone helpers
- Added auto-retry capability (options: retryAttempts and retryDelayInMs)
- Added tests

## [0.0.6] - 2018.08.14
### Added
- Initial version
