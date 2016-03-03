'use strict';

// @ngInject
let MapImageService = function() {
  
  let self = this;
  
  this.base = 'http://public.data.npolar.no/kartarkiv';
  
  let editMediaLink = function(d) {
    let mediaLink = d.links.find(l => { return (l.rel === 'edit-media'); });
    
    if (!mediaLink) {
      mediaLink = d.links.find(l => { return (l.type === 'image/tiff'); });
    }
    return mediaLink;
  };
      
  this.basename = function(filename) {
    return filename.split(/\..*$/)[0];
  };
  
  this._image = function(image, map, suffix='-512px', format='jpeg') {
    if (image && image.filename && map && map.id) {
      return `${self.base}/${map.id}/${self.basename(image.filename)}${suffix}.${format}`;
    }
  };
  
  this.icon = function(image, map) {
    return self._image(image,map,'-512px', 'jpeg');
  };
  
  this.medium = function(image, map) {
    return self._image(image,map,'-1920px', 'jpeg');
  };
  
  this.large = function(image, map) {
    return self._image(image,map,'-3000px', 'jpeg');
  };
  
  this.title = function(map) {
    if (map && map.title) {
     
      let title = map.title;
      if (map.publication && map.publication.code) {
        title = `[${map.publication.code}] ${title}`;
      }
      /*if (map.subtitle) {
        title += ': '+map.subtitle;
      }*/
      if (map.publication && map.publication.year) {
        title += ` (${map.publication.year})`;
      } else {
         title += ` (unkown year)`;
      }
      return title;
    }
  };
  
  
  this.editMediaLinkFromFileUpload = function(file) {
    return {
      uri: file.url,
      filename: file.filename,
      rel: "edit-media",
      length: file.file_size,
      //hash: [file.md5sum],
      type: file.content_type
    };
  };
    
  return this;
};

module.exports = MapImageService;