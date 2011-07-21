import subprocess
import sys

files = [
   "md5.air.FileStream.js",
   "md5.js",
   "MD5Builder.js"
]

inp = "\n".join([open(x, "r").read() for x in files])

num = int(sys.argv[1])

thetest = [97]*num

inp += """

var x = new MD5Builder();
x.update([
%s
]);
print(x.compute());

""" % ", ".join([str(x) for x in thetest])


subprocess.Popen(['/usr/local/bin/js', '-e', inp]).wait()

x = subprocess.Popen(['md5', '-s', "".join([chr(x) for x in thetest])], stdout = subprocess.PIPE)
x.wait()
print x.stdout.read().split("= ")[1]
