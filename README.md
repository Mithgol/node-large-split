[![(a histogram of downloads)](https://nodei.co/npm-dl/large-split.png?height=3)](https://npmjs.org/package/large-split)

This module (`large-split`) is a collection of methods that split large Buffers and files.

It is inspired by Ryan Day's [`buffer-split`](https://github.com/soldair/node-buffer-split) module, but has the following differences:

* does not have dependencies,

* requires Node.js version 4.x (or newer) to run,

* has additional methods to process larger data structures.

## Installing the splitter

[![(npm package version)](https://nodei.co/npm/large-split.png?downloads=true&downloadRank=true)](https://npmjs.org/package/large-split)

* Latest packaged version: `npm install large-split`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-large-split/tarball/master`

You may visit https://github.com/Mithgol/node-large-split#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using the splitter

When you `require()` the installed module, you get an object with the following methods:

### bsplit(buf, splitBuf, includeDelim)

This method's name (`bsplit`) means “a Buffer's splitter”.

This method is directly inspired by Ryan Day's [`buffer-split`](https://github.com/soldair/node-buffer-split) module.

This method takes a large Buffer (`buf`) and splits it into an array of Buffers by separating the Buffer into subbuffers. That array is returned.

The second parameter (`splitBuf`) is used as a delimiter to decide where the next subbuffer starts.

If the third parameter (`includeDelim`) is present and `true`, then delimiters are included to the subbuffers that precede them.

**Example:**

```js
var contentArray = require('large-split').bsplit(
   sourceBuffer,
   Buffer('\r\n') // CRLF
);
```

**Note: ** if a Buffer is large enough (hundreds of megabytes), it cannot be created (Node.js [issue 3543](https://github.com/nodejs/node/issues/3543)). Use one of the following methods to split such data structures as files (without attempting to read the whole file to memory).

### fsplit(filePath, splitBuf, includeDelim)

This method's name (`fsplit`) means “a file's splitter”.

This method takes a large file (using the given `filePath`) and splits it into an array of Buffers by separating the file's contents into subbuffers. That array is returned.

The second parameter (`splitBuf`) is used as a delimiter to decide where the next subbuffer starts.

If the third parameter (`includeDelim`) is present and `true`, then delimiters are included to the subbuffers that precede them.

The file is read synchronously in relatively small portions (50 megabytes each).

**Example:**

```js
var contentArray = require('large-split').fsplit(
   sourceFilePath,
   Buffer('\r\n') // CRLF
);
```

**Note: ** if a file is large enough (a gigabyte or more), even an array of its subbuffers won't fit into memory (unless V8 options are changed). Use the following method to process each subbuffer separately.

### isplit(filePath, splitBuf, iterator, includeDelim)

This method's name (`isplit`) means “an iterative splitter”.

This method takes a large file (using the given `filePath`) and splits it by separating the file's contents into subbuffers.

The second parameter (`splitBuf`) is used as a delimiter to decide where the next subbuffer starts.

If the third parameter (`includeDelim`) is present and `true`, then delimiters are included to the subbuffers that precede them.

The file is read synchronously in relatively small portions (50 megabytes each).

For each of the subbuffers (in order of appearance) the call `iterator(nextBuf, bufIndex, last)` is performed with the following parameters:

* `nextBuf` — the next subbuffer,

* `bufIndex` — the (zero-based) index of the subbuffer,

* `last` — present and `true` if the given subbuffer is the last in the file.

**Example:**

```js
isplit(
   sourcePath, Buffer('\r\n'), // CRLF
   (nextLineBuf, IDX, lastLine) => {
      if( nextLineBuf.length === 0 ){
         if( lastLine ){
            require('ciel').skip(
               `The file ${sourcePath} ends with an empty line.`
            );
            return;
         }
         require('ciel').fail(
            `The file ${sourcePath} contains an empty line. ` +
            "That's not the last line!"
         );
         return;
      }
      // ... more processing ...
   }
);
```

## Testing the splitter

[![(build testing status)](https://img.shields.io/travis/Mithgol/node-large-split/master.svg?style=plastic)](https://travis-ci.org/Mithgol/node-large-split)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the splitter).

After that you may run `npm test` (in the directory of the splitter). Only the JS code errors are caught; the code's behaviour is not tested.

## License

MIT license (see the `LICENSE` file).