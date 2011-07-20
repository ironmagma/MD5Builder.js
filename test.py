import subprocess
import sys

files = [
   "md5.air.FileStream.js",
   "md5.js",
   "MD5Builder.js"
]

inp = "\n".join([open(x, "r").read() for x in files])

inp += """

var x = new MD5Builder();
x.update([%s]);
print(x.calc());

""" % ("".join(['97, ']*8192)[:-2])

subprocess.Popen(['/usr/local/bin/js', '-e', inp]).wait()

x = subprocess.Popen(['md5', '-s', "a"*8192], stdout = subprocess.PIPE)
x.wait()
print x.stdout.read().split("= ")[1]
