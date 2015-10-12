#!/bin/bash

base=http://api.npolar.no/map/archive # Map arcive API base
dest=/mnt/datasets/map-archive        # Destination (disk)
format="jpeg"                          # Destination format

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
       
        destNoExt=$dest/$access/$format$yearIsodate`basename $tif .tif`
        large=$destNoExt-large
        medium=$destNoExt-medium
        small=$destNoExt-small
        thumb=$destNoExt-thumb
        
        # @todo For restricted we also create a tiny preview in "open"
        
        # Large
        if [[ ! -f $large.$format ]] ; then
          mkdir -p `dirname $large`
          echo "JPEG large [6000 px]"
          cmd="nice convert -resize 6000 -quality 80 $tif $large.$format"
          `$cmd`
        fi
        
        # Medium
        if [[ ! -f $medium.$format ]] ; then
          mkdir -p `dirname $medium`
          echo "JPEG medium [1920 px]"
          cmd="nice convert -resize 1920 -quality 80 $tif $medium.$format"
          echo $cmd
          `$cmd`
        fi
        
        # Small
        if [[ ! -f $small.$format ]] ; then
          echo "JPEG small [1024 px]"
          cmd="nice convert -resize 1024 -quality 80 $tif $small.$format"
          echo $cmd
          `$cmd`
        fi
        
        # Thumb
        if [[ ! -f $thumb.$format ]] ; then
          echo "JPEG thumb [128 px]"
          cmd="nice convert -resize 128 -quality 80 $tif $thumb.$format"
          echo $cmd
          `$cmd`
        fi
        
      fi
      

    else
      echo "Not found: $uri";
    fi
    
  fi
done


# ch@arken:~/github.com/npdc-map$ curl -I -XHEAD https:# data.npolar.no/_file/map/archive/open/2015/2015-01-15/Van_Keulenfjorden_B11G_1990.tif
# HTTP/1.1 200 OK
# Server: nginx/1.8.0
# Date: Tue, 06 Oct 2015 15:48:01 GMT
# Content-Type: image/tiff
# Content-Length: 263520880
# Connection: keep-alive
# Last-Modified: Tue, 06 Oct 2015 12:13:20 GMT
# ETag: "5613bae0-fb50270"
# Accept-Ranges: bytes

# {
# "type": "image/tiff",
# "title": "Svalbardkart_20tallet_5.TIF",
# "rel": "edit-media",
# "length": 103546364,
# "modified": "2013-01-10T13:36:49Z",
# "href": "https:# api.npolar.no/map/archive/05b5733c-6030-5241-9d5a-c01f05ad718b/_file/11106/Svalbardkart_20tallet_5.TIF"
# }
# "links": [
# {
# "rel": "edit-media",
# "href": "https:# data.npolar.no/_file/map/archive/open/2015/3f655aa4-0941-4c4b-8138-d9db30ae1574/Bouvet%C3%B8ya_1986.tif",
# "length": 205555360,
# "title": "Bouvetøya_1986.tif (TIFF 10807x8770 8-bit 205.6MB)",
# "type": "image/tiff"
# }
# ]

