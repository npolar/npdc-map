'use strict';

// @ngInject
let MapImageService = function($http) {
  
  let self = this;
  
  this.base = 'http://public.data.npolar.no/kartarkiv';
        
  this.basename = function(filename) {
    return filename.split(/\..*$/)[0];
  };
  
  // $scope.images = map.files.filter(f => (/^image\//).test(f.type));
  
  this._image = function(image, map, suffix='-512px', format='jpeg', base=self.base) {
    if (image && image.filename && map && map.id) {
      let filename = image.filename.split(' ').join('_');
      return `${base}/${map.id}/${self.basename(filename)}${suffix}.${format}`;
    }
  };
  
  this.jpeg = function(image, map, suffix='') {
    return self._image(image, map, suffix, 'jpeg');
  };

  this.icon = function(image, map) {
    if (image) {
      return self.jpeg(image,map,'-512px');
    }
  };
  
    
  //this.ikon = function(map) {
  //  let image = map.files.find(f => f.type === 'image/png');
  //  console.log(image);
  //};
  
  this.medium = function(image, map) {
    return self.jpeg(image,map,'-3000px');
  };
  
  this.large = function(image, map) {
    return self.jpeg(image,map,'-3000px');
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
  
  // image metadata <- fileFunnel file metadata
  this.imageFromFile = function(file) {
    //console.log(file);
    return {
      uri: file.url,
      filename: file.filename,
      rel: "edit-media",
      length: file.file_size,
      hash: 'md5:'+file.md5sum,
      type: file.content_type
    };
  };
  
  // 
  //File should be object with keys filename, url, [file_size, icon, extras].
  this.fileFromImage = function(image) {
    //console.log(image);
    let f = {
      url: image.uri,
      filename: image.filename,
      icon: self.icon({id: "x"}, image),
      file_size: image.length,
      md5sum: (image.hash||'md5:').split('md5:')[1],
      content_type: image.type
    };
    console.log(f);
    return f;
  };
    
  return this;
};

module.exports = MapImageService;