#!/bin/bash

strID='1_gen_html.js'

echo "+++ tenim la APP ($strID) running ?"
ps -ef | grep $strID | grep -v grep

exit 0
