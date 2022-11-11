#!/bin/bash

cd /home/homeassistant/.homeassistant
source /srv/homeassistant/bin/activate
hass --script check_config

find . -name \.AppleDouble -prune -exec sudo rm -rf {} \;
find ./ -depth -name ".AppleDouble" -exec sudo rm -Rf {} \;

git add .
git status

echo -n "Enter the Description for the Change: " [Minor Update]
read CHANGE_MSG

git commit -m "${CHANGE_MSG}"
git push origin master
exit
