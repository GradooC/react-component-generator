# React Component Generator

## Features

Adds a folder context menu item for creating a folder with all necessary files

![Alt text](public/manual.gif)

## Extension Settings

### This extension contributes the following settings

| Name                                  | Description                                   | Default value                          |
| ------------------------------------- | --------------------------------------------- | -------------------------------------- |
| `createReactComponent.index.snippet`  | Specifies content of the created index file.  | [index](#index-file-default-snippet)   |
| `createReactComponent.tsx.snippet`    | Specifies content of the created tsx file.    | [tsx](#tsx-file-default-snippet)       |
| `createReactComponent.styles.snippet` | Specifies content of the created styles file. | [styles](#styles-file-default-snippet) |

#### **Index** file default snippet

```ts
export * from './${name:kebab}';
```

#### **Tsx** file default snippet

```tsx
import React from 'react';
import styles from './${name:kebab}.module.css';

export type ${name:pascal}Props = {};

export const ${name:pascal} = ({}: ${name:pascal}Props) = {
    return <div> className={styles.root}${name:pascal}</div>;
};
```

#### **Styles** file default snippet

```css
.root {}
```

### You can use the following variables in your content snippets

| Name             | Description                                      | Example              |
| :--------------- | :----------------------------------------------- | :------------------- |
| `${name:pascal}` | Name of the component you provided in PascalCase | MyAwesomeComponent   |
| `${name:kebab}`  | Name of the component you provided in kebab-case | my-awesome-component |
