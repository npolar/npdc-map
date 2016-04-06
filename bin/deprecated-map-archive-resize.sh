#!/bin/bash

base=http://api.npolar.no/map/archive # Map arcive API base
dest=/mnt/datasets/map-archive        # Destination (disk)
format="jpeg"                          # Destination format

function create_preview {
  original=$1
  preview=$2
  size=$3
  
  if [[ ! -f $preview ]] ; then
    mkdir -p `dirname $preview`
    echo "JPEG [$size px] <- $original -> `dirname $preview`"
    `nice convert -resize $size -quality 80 $tif $preview 2> /dev/null`
  fi  
}  

# Get list of uris for images without length
for uri in `curl --silent -XGET "$base/?q=&sort=-created&not-length=1..&fields=links.href&format=csv&limit=all"`
do
  
  # Check if edit-media URI (original TIF) exists on HTTP
  if [[ $uri =~ ^https?* ]] ; then

    if curl --output /dev/null --silent --head --fail $uri; then
      
      yearIsodate=`echo $uri | grep -oE '/([0-9]{4})/[0-9]{4}-[0-9]{2}-[0-9]{2}/'` # /2015/2015-12-31/
      year=`echo $yearIsodate | grep -oE '^/[0-9]{4}/' | grep -oE '[0-9]{4}'` # 2015
      access=`echo $uri | grep -oE 'open|restricted'` # open
      tif=$dest/$access/$year`echo $uri | gawk -F'(/(open|restricted)/[^/]+|?)' '$0=$2'` # /mnt/datasets/map-archive/open/2015/2015-10-08/Bjornoya_50_1944.tif
      
      # Check if TIF is on disk
      if [[ -f $tif ]] ; then
       
        filename=`basename $tif .tif`
        filename=`basename $filename .TIF`
        
        destNoExt=$dest/$access/$format$yearIsodate$filename
        
        large=$destNoExt-large
        medium=$destNoExt-medium
        small=$destNoExt-small
        thumb=$destNoExt-thumb
        
        create_preview $tif $large.$format 6000
        create_preview $tif $medium.$format 1920
        create_preview $tif $small.$format 1024
        create_preview $tif $thumb.$format 512
        
        # For restricted we also create a tiny preview in "open"
        openThumb=$dest/open/$format$yearIsodate$filename-thumb.$format
        create_preview $tif $openThumb 512
    
      else
        echo $tif
      fi
      
    else
      echo "Not found: $uri";
    fi
    
  fi
done
