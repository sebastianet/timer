#!/bin/bash

mydate=`date +"y%Y/m%m/d%d"`
mytime=`date +"h%H:m%M"`

logFN=/home/pi/logs/timer.log
szTxt="("$mydate"-"$mytime") +++ +++ +++ TIMER socis guifi starts, logging to ("$logFN")."
logger  -i   -p user.info  $szTxt

echo "+++ [`date -R`] +++ engega TIMET app" >> $logFN

node  /home/pi/timer/1_gen_html.js       >>  $logFN   2>&1   &
