# Changelog

## [0.1.0-alpha.2](https://github.com/zenobi-us/opencode-background/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2025-11-21)


### ⚠ BREAKING CHANGES

* **background-tasks:** Renamed core classes and interfaces from BackgroundTask to BackgroundProcess
    - Renamed `BackgroundTask` class to `BackgroundProcess`
    - Updated all related test files, type names, and documentation
    - Renamed `BackgroundTaskManager` to `BackgroundProcessManager`
    - Updated README to reflect terminology change from "tasks" to "processes"

### Bug Fixes

* simplify ci ([#7](https://github.com/zenobi-us/opencode-background/issues/7)) ([bd37a54](https://github.com/zenobi-us/opencode-background/commit/bd37a5434204c1e1f7fe4d3a74d619892d766922))
* update .gitignore and AGENTS.md to include .memory/ directory for temporary data ([10624fc](https://github.com/zenobi-us/opencode-background/commit/10624fcd251d1ca1392c9a806a2ec8b0f481c27b))
* update echo syntax for release data output in workflow ([511e5fe](https://github.com/zenobi-us/opencode-background/commit/511e5fe874584a008dc940714b14c234007ea9f8))
* update task descriptions and dependencies in mise scripts ([3e0b818](https://github.com/zenobi-us/opencode-background/commit/3e0b818ac9a40abf548832d8554291482a8fbf3b))


### Code Refactoring

* **background-tasks:** rename BackgroundTask to BackgroundProcess ([ea8cd63](https://github.com/zenobi-us/opencode-background/commit/ea8cd63d4cdb6e0abe65a48ce4d301d816403dad))
