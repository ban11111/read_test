#!/bin/bash

echo '123' > temp.txt
git log -5 --name-only > lastgitcommit.text
node gitdifftest.js

for line in `cat temp.txt`
do
if [ $line == 'error' ]
  then echo "禁止push"; exit 1;
fi
done
echo '' > lastgitcommit.text