#!/usr/bin/python

# we have to return 2 strings :
#   1) the IP we are ping-ing
#   2) the result

import sys

import pyping
# pip install pyping
# https://github.com/certator/pyping/blob/master/bin/pyping

numArg = len( sys.argv )
idx = 0

# for arg in sys.argv:
#     print 'IDX' + str(idx) + ':' + arg
#     idx = idx + 1

# print 'Number of arguments: (', numArg, ') arguments.'
# print 'Argument List:', str(sys.argv)

szDesti = '74.125.143.104'
szDesti = sys.argv[1]                         # in nodejs we code "python_options.args[0] = szIP ;"

print 'Lets ping (', szDesti, ').'
response = pyping.ping( szDesti, timeout=900, count=2 )        # -t 900 -c 2

if response.ret_code == 0:
    print( "RC 0 - Viagra, reachable" )          # 74.125.143.104
else:
    print( "RC KO - Promescent, unreachable" )   # 1.2.3.4
