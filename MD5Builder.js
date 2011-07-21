var MD5Builder = (function() {

function assert(x, msg) { if(!x) throw new Error("Assert error" + ((msg !== undefined)?(": "+msg):"")); }

var BUFFER_SIZE = 8192;
BUFFER_SIZE = 5;

function MemBuffer() {
   if(!(this instanceof MemBuffer)) throw new ValueError("MemBuffer constructor mustn't be called as function.");
   if (typeof Uint8Array !== "undefined")  {
      this.buf = new Uint8Array(BUFFER_SIZE);
   }
   else {
      this.buf = new Array();
   }
   this.size = 0;
}

MemBuffer.prototype.empty = function() {
   this.size = 0;
};

MemBuffer.prototype.getElem = function(i) {
   return this.buf[i];
};

MemBuffer.prototype.setElem = function(i, v) {
   assert(i < this.buf.size, "Buffer index out of bounds.");
   this.buf[i] = v;
};

MemBuffer.prototype.append = function(v, offset) {
   offset = offset || 0;
   assert(v.length-offset <= BUFFER_SIZE, "Adding beyond");

   if (v instanceof KittyArray) {
      function getElem(x) {return v.getElem(x);}
   }
   else {
      function getElem(x) {return v[x];}
   }

   for (var i = 0; i < v.length - offset; i++) {
      this.buf[this.size + i] = getElem(offset+i);
      this.size++;
   }
};

MemBuffer.prototype.setBufferValue = function(arr, offset) {
   this.empty();
   this.append(arr, offset);
};

MemBuffer.prototype.toString = function() {
   var ret = "[";
   for (var i = 0; i < this.size; i++) {
      ret += this.buf[i] + ", ";
   }
   if ( ret !== "[" ) {
      ret = ret.substring(0, ret.length-2);
   }
   ret += "]";
   return ret;
};

function MD5Builder() {
   this.abcd_start = [
      1732584193,
      -271733879,
      -1732584194,
      271733878
   ];
   this.totalLen = 0;
   this.bigBuf = new MemBuffer();
};

MD5Builder.prototype._getbuf = function() {
   return this.bigBuf;
};

MD5Builder.prototype.update = function(bytearr) {
   if (typeof bytearr === "number") {
      return this.update([bytearr]);
   }

   var catted = new KittyArray(this.bigBuf, bytearr);
   var chunksProcessed = 0;
   while (catted.length-chunksProcessed*BUFFER_SIZE > BUFFER_SIZE) {
      this._process(catted, chunksProcessed*BUFFER_SIZE, BUFFER_SIZE)
      chunksProcessed++;
   }
   if (chunksProcessed > 0) {
      var bytesToStore = catted.length-chunksProcessed*BUFFER_SIZE;
      this.bigBuf.setBufferValue(catted, chunksProcessed*BUFFER_SIZE);
   }
   else {
      this.bigBuf.append(bytearr);
   }
}

MD5Builder.prototype._process = function(byteArr, offset, numBytes) {
}


function KittyArray(buf, arr) { // simulates the buffer catted to the array

   if(!(this instanceof KittyArray)) throw new ValueError("KittyArray constructor mustn't be called as function.");

   if(typeof ArrayBuffer !== 'undefined' && arr.constructor === ArrayBuffer) {
      arr = new Uint8Array(arr);
   }

   this.buf = buf;
   this.arr = arr; 

   // cached lengths
   this.bufLen = buf.size;
   this.arrLen = arr.length; 
   this.length = this.bufLen+this.arrLen;
}

KittyArray.prototype.getElem = function (i) {
   if (i < this.bufLen) return this.buf.getElem(i);
   return this.arr[i-this.bufLen];
};


var appendPaddingToBlock = true;
var totalLen = 0;

   this.abcd_start = [
      1732584193,
      -271733879,
      -1732584194,
      271733878
   ];

var inBytes = [];
for(var q = 0; q < 8192; q++) {
   inBytes.push(97);
}

totalLen += inBytes.length;

bin = new Array();
for(var i = 0; i < inBytes.length * 8; i+=8)
  bin[i>>5] |= (inBytes[i>>3] & 0xff) << (i%32);

abcd_start = core_md5_ex(bin, inBytes.length*8, abcd_start, appendPaddingToBlock, totalLen);

return MD5Builder;

}());
