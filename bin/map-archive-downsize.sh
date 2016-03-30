#!/bin/bash
root=/mnt/datasets/api.npolar.no/_file/map/archive # Disk root of map archive originals
dest=/mnt/public/Datasets/kartarkiv
i=0

function resize_image {
  original=$1
  preview=$2
  size=$3
  quality=80
  
  if [[ ! -f $preview ]] ; then
    mkdir -p `dirname $preview`
    echo "[$size] $preview [quality $quality] <- $original"
    `nice convert -resize $size -quality $quality $original $preview 2> /dev/null`
  fi  
}

# Loop all (non-restricted) map archive originals => PNG files [-size +1M] ?
find $root -type f -iname *.png | grep -v "\/restricted\/" | while read filename 
do
  
  basename=`basename "$filename" .png`
  basename=`basename "$basename" .PNG`
  
  id=`echo $filename | grep -oE '/_file\/map\/archive\/.*/' | grep -oE '[0-9a-fA-F-]{36,}'`
  
  medium="$dest/$id/$basename-1920px.jpeg"
  large="$dest/$id/$basename-3000px.jpeg"
  jpeg="$dest/$id/$basename.jpeg"
  
  i=$((i+1))
  echo "$i"
  #resize_image "$filename" "$medium" 1920
  resize_image "$filename" "$large" 3000    
  #create_jpeg "$filename" "$jpeg"
done