function MD5Builder() {
}

MD5Builder.prototype.update = function(bytes) {
	var abcd_start = new Array();
	abcd_start.push(1732584193);
	abcd_start.push(-271733879);
	abcd_start.push(-1732584194);
	abcd_start.push(271733878);

   var buf = 8192;
   var appendPaddingToBlock = false;
	var totalLen = 0;

   for (var i = 0; i < bytes.length; i += buf) {

      if (i+buf <= bytes.length) {
         numbytes = buf;
      }
      else {
         appendPaddingToBlock = true;
         //numbytes = bytes.length-i-buf;
         numbytes = bytes.length % buf;
      }
      print("#: "+numbytes)

      totalLen += numbytes;

 		var bin = new Array();
 		for(var j = 0; j < numbytes * 8; j+=8) {
 			bin[j>>5] |= (bytes[i+(j>>3)] & 0xff) << (j%32);
      }
 		 
 		abcd_start = core_md5_ex(bin, numbytes*8, abcd_start, appendPaddingToBlock, totalLen);

   }

 	return binl2hex(abcd_start);	

}


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

