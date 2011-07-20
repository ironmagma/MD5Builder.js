import subprocess
import sys

files = [
   "md5.air.FileStream.js",
   "md5.js",
   "MD5Stream.js"
]

inp = "\n".join([open(x, "r").read() for x in files])

thetest = [97]*5000

inp += """

var x = new MD5Builder();
var m = [%s];
print(x.update(m));

""" % (", ".join([str(x) for x in thetest]))

subprocess.Popen(['/usr/local/bin/js', '-e', inp]).wait()

subprocess.Popen(['md5', '-s', "".join([chr(x) for x in thetest])]).wait()
