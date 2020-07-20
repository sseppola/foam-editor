# Foam Editor

A Foam editor for people who don't enjoy the VSCode experience, but want the other benefits of Foam.

Benefits:

1. Own your notes in plaintext
2. Back up and collaborate via git
3. Publish your content from your notes

## Features

- Estetic note taking
- Github Flavored Markdown

## Todos

A goal of this project is to resemble the Foam VSCode environment as much as possible, so when in doubt, use the Foam defaults.

- [ ] Style headers (leading space)
- [ ] Inline links
- [ ] Clickable links
- [ ] Brackets should be added to both sides of a marked word (rather than overwriting)
- [ ] Keybindings (same as `Markdown All in One` to match Foam experience)
- [ ] Toggle-able darkmode
- [ ] Backlinking panel
- [ ] Command palette ("turn into header 3", Todo, link, current date)
- [ ] Yarn workspaces

PRs are welcome

## Overview

The project is based on 2 packages:

### Client

> A website that runs on localhost

Start the client:

```sh
cd packages/client
yarn install
yarn start
```

### Server

> A nodejs server that serves the Foam notes to the client

Start the server:

```sh
cd packages/server
yarn install
yarn start
```
