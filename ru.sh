#!/bin/bash

mydate=`date +"y%Y/m%m/d%d"`
mytime=`date +"h%H:m%M"`

myhn=$HOSTNAME

logFN=/home/pi/logs/timer.log
#logFN=/home/sebas/node_projects/logs/timer.log
#logFN=/home/mate/node-projects/logs/timer.log

szTxt="("$mydate"-"$mytime") +++ +++ +++ TIMER socis guifi starts on ("$myhn"), log to ("$logFN")."
logger  -i   -p user.info  $szTxt

echo "+++ [`date -R`] +++ {ru.sh} +++ engega TIMET app on ("$myhn")" >> $logFN

# Odin
my_path="/home/pi/timer"
# T60 
#my_path="/home/sebas/node_projects/timer"
# Punt Omnia
#my_path="/home/mate/nodejs-projects/timer"

/usr/bin/node  $my_path/1_gen_html.js $my_path/entrada.json      >>  $logFN   2>&1   &

