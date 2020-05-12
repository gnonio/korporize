[![korporize](./img/korporize.svg)](http://tesseract.projectnaptha.com)

## korpora - OCR - Optical Character Recognition

Offline text recognition from any image. This web extension will enable context menu access to extract text from any image while browsing. Builds upon [Tesseract.js](https://github.com/naptha/tesseract.js)

****

### Install

- [Addons Mozilla page](https://addons.mozilla.org/en-GB/firefox/addon/korporize/)
- Alternate for advanced users:

**End Users Only**

- [download this repository](https://github.com/gnonio/korporize/archive/master.zip)
- unzip to a suitable location in your hardrive

Follow instructions for [Temporary installation in Firefox](./user-install.md)

****

### Usage

- Right click over an image in a web page
- Select "Extract Text from Image"
- A popup will open with korporize interface
- Wait for tesseract to work in the background
- Obtain results in korporize panel
- (Optional) copy results to clipboard

****

To obtain good results:
- make sure the automatic language detected is suitable for the characters in the image loaded
force another language via Options page
- increase quality in Options page (try Normal or Best - both will take longer)
- choose a high resolution version of the image

****

### Features

- Extracts text from any image while browsing
- Works offline (requires network only the first time a language is used to cache the dictionaries)
- Automatic language detection (based on the visited web page)
- Current implementation loads image already loaded at the visited page without downloading it twice

****

### Todo

- Many other options for accessing Tesseract functionality (image from link, PDF load and save, etc...)
- Preloading of language dictionaries (via Options page)
- Provide some cache management options
- Provide access as an API for other webextensions

****