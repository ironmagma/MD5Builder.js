function MD5Builder() {
   if(!(this instanceof MD5Builder)) throw new ValueError("MD5Builder constructor mustn't be called as function.");
   this.littleBuffer = []; // TODO make littleBuffer a real buffer
   this._totalLen = 0;

 	this.abcd_start = [ 1732584193, -271733879, -1732584194, 271733878 ];
}

(function() {

   var BUFFER_SIZE = 8192;

   function KittyArray(buf, arr) { // simulates the buffer catted to the array
   
      if(!(this instanceof KittyArray)) throw new ValueError("KittyArray constructor mustn't be called as function.");

      if(typeof ArrayBuffer !== 'undefined' && arr.constructor === ArrayBuffer) {
         arr = new Uint8Array(arr);
      }

      this.buf = buf;
      this.arr = arr; 
      

      // cached lengths
      this.bufLen = buf.length;
      this.arrLen = arr.length; 
      this.length = this.bufLen+this.arrLen;
   }

   KittyArray.prototype.getElem = function (i) {
      if (i < this.bufLen) return this.buf[i];
      return this.arr[i-this.bufLen];
   };

   MD5Builder.prototype.update = function(bytes) {

      // Concatenate the littleBuffer and the update(...) data.
      var cat = new KittyArray(this.littleBuffer, bytes);

      var numbytes = 0;

      for (var i = 0; i < cat.length; i += BUFFER_SIZE) {

         if (i+BUFFER_SIZE <= cat.length) {
            this._process(cat, i, BUFFER_SIZE, false);
            continue;
         }

         numbytes = cat.length % BUFFER_SIZE;

      }


      // TODO make it not delete the whole buffer every time
      this.littleBuffer = []; // TODO make littleBuffer a real buffer

      var offset = i - BUFFER_SIZE;

      for (var j = 0; j < numbytes; j++) {
         this.littleBuffer.push(cat.getElem(offset+j));
      }

   }

   MD5Builder.prototype.calc = function() {
      if (this.littleBuffer.length > 0) {
         return this._process(this.littleBuffer, 0, this.littleBuffer.length, true);
      }
      return binl2hex(this.abcd_start);
   }

   MD5Builder.prototype._process = function (bytes, offset, numbytes, pad) {

      if(bytes.getElem) {
         var getElem = function(x) {return bytes.getElem(x);};
      }
      else {
         var getElem = function(x) { return bytes[x]; }
      }

      var bin = new Array();

  		for(var j = 0; j < numbytes * 8; j+=8) {
  			bin[j>>5] |= (getElem(offset+(j>>3)) & 0xff) << (j%32);
      }

      if (!pad) {
         this._totalLen += numbytes;
         this.abcd_start = core_md5_ex(bin, numbytes*8, this.abcd_start, false, this._totalLen);
      }
      else {
         var totalLen = this._totalLen + numbytes;
         return core_md5_ex(bin, numbytes*8, this.abcd_start, true, totalLen);
      }

   }

}());

// MD5Builder.prototype.update = function(bytes) {
// 	var abcd_start = new Array();
// 	abcd_start.push(1732584193);
// 	abcd_start.push(-271733879);
// 	abcd_start.push(-1732584194);
// 	abcd_start.push(271733878);
// 
//    var buf = 8192;
//    var appendPaddingToBlock = false;
// 	var totalLen = 0;
// 
//    for (var i = 0; i < bytes.length; i += buf) {
// 
//       if (i+buf <= bytes.length) {
//          numbytes = buf;
//       }
//       else {
//          appendPaddingToBlock = true;
//          //numbytes = bytes.length-i-buf;
//          numbytes = bytes.length % buf;
//       }
//       print("#: "+numbytes)
// 
//       totalLen += numbytes;
// 
//  		var bin = new Array();
//  		for(var j = 0; j < numbytes * 8; j+=8) {
//  			bin[j>>5] |= (bytes[i+(j>>3)] & 0xff) << (j%32);
//       }
//  		 
//  		abcd_start = core_md5_ex(bin, numbytes*8, abcd_start, appendPaddingToBlock, totalLen);
// 
//    }
// 
//  	return binl2hex(abcd_start);	
// 
// }


// function hex_md5_stream(inStream)
// {
// 	while (inStream.bytesAvailable > 0)
// 	{
// 		inStream.readBytes(inBytes, 0, Math.min(8192, inStream.bytesAvailable));		
// 		if(inBytes.length < 8192)
// 		{
// 			appendPaddingToBlock = true;
// 		}
// 		 
// 		totalLen += inBytes.length;
// 		 
// 		var bin = new Array();
// 		for(var i = 0; i < inBytes.length * 8; i+=8)
// 			bin[i>>5] |= (inBytes[i>>3] & 0xff) << (i%32);
// 		 
// 		abcd_start = core_md5_ex(bin, inBytes.length*8, abcd_start, appendPaddingToBlock, totalLen);
// 		inBytes.clear();
// 	}
// 	 
// }
//

