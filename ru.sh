#!/bin/bash

mydate=`date +"y%Y/m%m/d%d"`
mytime=`date +"h%H:m%M"`

myhn=$HOSTNAME

# Odin
# my_path="/home/pi/timer"
# logFN="/home/pi/logs/timer.log"

# T60 
# my_path="/home/sebas/node_projects/timer"
# logFN="/home/sebas/node_projects/logs/timer.log"

# Punt Omnia
# my_path="/home/mate/nodejs-projects/timer"
# logFN="/home/mate/logs/timer.log"

if [ $myhn = "odin" ]
then
  my_path="/home/pi/timer"
  logFN="/home/pi/logs/timer.log"
elif [ $myhn = "t60" ]
then
  my_path="/home/sebas/node_projects/timer"
  logFN="/home/sebas/node_projects/logs/timer.log"
elif [ $myhn = "punt-omnia" ]
then
  my_path="/home/mate/nodejs-projects/timer"
  logFN="/home/mate/logs/timer.log"
else
  my_path="/tmp"
  logFN="/tmp"
fi

szTxt="("$mydate"-"$mytime") +++ +++ +++ ($HOSTNAME) +++ TIMER socis guifi starts, log to ("$logFN")."
logger  -i   -p user.info  $szTxt

echo "+++ [`date -R`] +++ {ru.sh} +++ TIMER app engega on ("$myhn")." >> $logFN

/usr/bin/node  $my_path/1_gen_html.js $my_path/entrada.json      >>  $logFN   2>&1   &

