'use strict';

// @ngInject
let MapImageService = function($http) {

  let self = this;

  this.archive = 'https://api.npolar.no/map/archive';

  this.base = 'https://api.npolar.no/map/archive-jpeg';

  this.basename = function(filename) {
    return filename.split(/\..*$/)[0];
  };

  this.filename = function(uri) {
    let p = uri.split('/');
    return p[p.length-1];
  };

  this.all_files_uri = (map, quality='high') => {
    if (!map) {
      return;
    }
    let file_endpoint = self.archive;
    if (quality === 'web' || quality == 'preview') {
      file_endpoint = self.base;
    }
    return `${file_endpoint}/${ map.id }/_file/_all?filename=${ encodeURIComponent(map.title) }&format=zip`;
  }

  this.mm = function(pixels, ppi) {
    if (!pixels || !ppi) {
      return;
    }
    return Math.round(25.4*pixels/ppi, 0);
  };

  // $scope.images = map.files.filter(f => (/^image\//).test(f.type));

  this._image = function(image, map, suffix='-512px', format='jpeg', base=self.base) {
    if (image && image.filename && map && map.id) {
      let filename = image.filename.split(' ').join('_');
      return `${base}/${map.id}/_file/${self.basename(filename)}${suffix}.${format}`;
    }
  };

  this._imageInLink = function(uri, size='medium', extension='jpg') {

    //console.log(uri, size, extension);
    let path;

    if (/https?:\/\/api\.npolar\.no/.test(uri)) {

      let parts = uri.split("//")[1].split('/');
      // ["api.npolar.no", "map", "archive", "14fb353a-5828-51cd-980e-5859343ff124", "_file", "11344", "Gronland_foreign_65.TIF"]
      let filename = parts.pop().split(".")[0]; // "Gronland_foreign_65"
      let ident = parts[parts.length-1]; // "11344"
      path = "https://data.npolar.no/_file/map/archive/open/legacy/"+ident+"/"+size+"/"+filename+"."+extension;

    } else if (/(open|restricted)/.test(uri)) {

      let p;
      p = uri.split(/(open|restricted)/).slice(-2); // ["open", "/2015/2015-05-21/Bouvetøya_1986.tif"]
      extension = (extension === 'jpg') ? 'jpeg' : extension;

      p[1] = p[1].replace(/\.tif(f)?$/i, `-${size}.${extension}`);

      path = `${this.base}/${p[0]}/${this.previewFormat}${p[1]}`;

    }
    //console.log('path', path);
    return path;
  };


  this.jpeg = function(image, map, suffix='') {
    //console.log(image);
    //console.debug(map);
    if (image && map && map.files && map.files.length > 0) {
      return self._image(image, map, suffix, 'jpeg');
    } else if (map && map.links && map.links.length > 0) {
      let link = map.links[0];
      return self._imageInLink(link.href);
    }

  };

  this.icon = function(image, map) {
    if (image || map) {
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
      if (map.preamble) {
        title = `(${map.preamble}) ${title}`;
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
