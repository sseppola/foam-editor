# Foam Editor

A Foam editor for people who don't like the VSCode experience, but want the other benefits of Foam.

## Features

- Github Flavored Markdown

## Todos

A goal of this project is to resemble the Foam VSCode environment in terms of features and keybindings.

- [ ] Backlinking panel
- [ ] Style headers
- [ ] Inline links
- [ ] Command palette ("turn into header 3", Todo, link, current date)
- [ ] Keybindings
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
