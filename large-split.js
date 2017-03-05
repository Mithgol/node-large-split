var fs = require('fs');

var bsplit = function(buf, splitBuf, includeDelim){  
   var nextFound = -1;
   var lines = [];
   var splitLen = splitBuf.length;
   var included = includeDelim ? splitLen : 0;
   var fromIndex = 0;

   while( (nextFound = buf.indexOf(splitBuf, fromIndex)) > -1 ){
      lines.push(buf.slice(fromIndex, nextFound + included));
      fromIndex = nextFound + splitLen;
   }

   lines.push( buf.slice(fromIndex, buf.length) );

   return lines;
};

var fsplit = function(filePath, splitBuf, includeDelim){
   var safeLength = 50 * 1024 * 1024; // 50 MB
   var fileDesc = fs.openSync(filePath, 'r');
   var fileLength = fs.fstatSync(fileDesc).size;
   var fromIndex = 0;
   var lines = [];
   var lastBuf = new Buffer(0);
   var readBuf = new Buffer(safeLength);

   while( fromIndex < fileLength ){
      var bytesRead = fs.readSync(
         fileDesc, readBuf, 0, safeLength, fromIndex
      );
      if( bytesRead < 1 ) throw 'FUBAR.';
      fromIndex += bytesRead;
      var actualResult = Buffer.concat([
         lastBuf, readBuf.slice(0, bytesRead) // ← .slice does not copy
      ]);
      var nextLines = bsplit(actualResult, splitBuf, includeDelim);
      lastBuf = nextLines.pop();
      lines = lines.concat(nextLines);
   }
   lines.push(lastBuf);
   fs.closeSync(fileDesc);
   return lines;
};

var isplit = function(filePath, splitBuf, iterator, includeDelim){
   /* jshint -W083 */ // ignore “Don't make functions within a loop”
   var safeLength = 50 * 1024 * 1024; // 50 MB
   var fileDesc = fs.openSync(filePath, 'r');
   var fileLength = fs.fstatSync(fileDesc).size;
   var fromIndex = 0;
   var lineNum = 0;
   var lastBuf = new Buffer(0);
   var readBuf = new Buffer(safeLength);

   while( fromIndex < fileLength ){
      var bytesRead = fs.readSync(
         fileDesc, readBuf, 0, safeLength, fromIndex
      );
      if( bytesRead < 1 ) throw 'FUBAR.';
      fromIndex += bytesRead;
      var actualResult = Buffer.concat([
         lastBuf, readBuf.slice(0, bytesRead) // ← .slice does not copy
      ]);
      var nextLines = bsplit(actualResult, splitBuf, includeDelim);
      lastBuf = nextLines.pop();
      nextLines.forEach( nextLine => iterator(nextLine, lineNum++) );
   }
   iterator(lastBuf, lineNum++, true);
   fs.closeSync(fileDesc);
};

module.exports = {
   bsplit: bsplit,
   fsplit: fsplit,
   isplit: isplit
};