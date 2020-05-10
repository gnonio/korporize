## Developers

### environment dependencies

- node@v12.16.2
- npm@6.14.4
- rimraf@3.0.2
- webpack@4.43.0
- babel-loader@8.1.0 @babel/core @babel/preset-env
- webpack-cli@3.3.11

### korporize dependencies

[tesseract.js@v2.1.1](https://github.com/naptha/tesseract.js) (with tesseract-core@2.2.0)

```
  npm install tesseract.js
  yarn add tesseract.js

  npm run build
```

**Files included in korporize (folder ./lib):**
(Tesseract.js must be built)

| Library        | Files                                                 |
|:---------------|:------------------------------------------------------|
| Tesseract.js   | node-modules/tesseract.js/dist/tesseract.min.js       |
|                | node-modules/tesseract.js/dist/tesseract.min.js.map   |
|                | node-modules/tesseract.js/dist/worker.min.js          |
|                | node-modules/tesseract.js/dist/worker.min.js.map      |
| Tesseract-core | node-modules/tesseract.js-core/tesseract-core.wasm.js |

[Tesseract Language Trained Data included](https://github.com/naptha/tessdata) (4.0.0)

| Library  | Quality    | Files                         |
|:---------|:-----------|:------------------------------|
| tessdata | 4.0.0      | 4.0.0/eng.traineddata.gz      |
|          |            | 4.0.0/equ.traineddata.gz      |
|          |            | 4.0.0/osd.traineddata.gz      |
|          | 4.0.0_best | 4.0.0_best/eng.traineddata.gz |
|          |            | 4.0.0_best/osd.traineddata.gz |
|          | 4.0.0_fast | 4.0.0_fast/eng.traineddata.gz |
|          |            | 4.0.0_fast/osd.traineddata.gz |

