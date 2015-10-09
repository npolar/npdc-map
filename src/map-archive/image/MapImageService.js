'use strict';

// @ngInject
let MapImageService = function() {
  
  this.schema = 'http://api.npolar.no/schema/map-archive-1';
  
  let editMediaLink = function(d) {
    let mediaLink = d.links.find(l => { return (l.rel === 'edit-media'); });
    
    if (!mediaLink) {
      mediaLink = d.links.find(l => { return (l.type === 'image/tiff'); });
    }
    return mediaLink;
  };
  
  this.newMap = function(processor) {
   return {
      schema: this.schema,
      type: 'topographic',
      rightsHolder: {
          name: 'Norsk Polarinstitutt'
      },
      publication: {
        country: 'NO',
        publisher: 'Norsk Polarinstitutt',
        where: 'Tromsø'
      },
      location: {
        country: 'NO',
        hemisphere: 'N'
      },
      collection: 'map-archive',
      processor,
      archives: [
        {
          'placename': 'Tromsø',
          'where': '5083',
          'count': 1,
          'country': 'NO',
          'organisation': 'Norsk Polarinstitutt'
        }
      ]
    };
  
  };
  
  this.src = function(d, size='medium', extension='jpg') {
    if (d === undefined || !d.links) {
      return '';
    }
    extension = extension.replace('.', '');
    
    let path = '';
    let mediaLink = editMediaLink(d);

    if (mediaLink && mediaLink.href) {
      path = this.preview(mediaLink.href, size);
      
    }
    return path;

  };
  
  //
  this.editMediaLink = function(document) {
    
    let yearCreated = new Date(document.created || new Date()).getFullYear();
    let isodateCreated = new Date(document.created || new Date()).toISOString().split("T")[0];
    let filename = `${ document.title.split(' ').join('_') }_${document.publication.code || ''}_${document.publication.year || yearCreated }.tif`.replace('__', '_');
    let access = (document.restricted === true) ? 'restricted' : 'open' ;
    return {
      'type': 'image/tiff',
      'rel': 'edit-media',
      'href': `https://data.npolar.no/_file/map/archive/${access}/${yearCreated}/${isodateCreated}/${filename}`
    };
  };
  
  this.preview = function(uri, size='medium', extension='jpg') {
    let path;
    if (/https?:\/\/api\.npolar\.no/.test(uri)) {
      
      let parts = uri.split("//")[1].split('/');
      // ["api.npolar.no", "map", "archive", "14fb353a-5828-51cd-980e-5859343ff124", "_file", "11344", "Gronland_foreign_65.TIF"]
      let filename = parts.pop().split(".")[0]; // "Gronland_foreign_65"       
      let ident = parts[parts.length-1]; // "11344"
      path = "https://data.npolar.no/_file/map/archive/open/legacy/"+ident+"/"+size+"/"+filename+"."+extension;

    } else {
      path = uri.replace(/\.tif(f)?$/i, `-${size}.${extension}`);
    }
    return path;
  };
  
  this.editImageLinks = function(links, type='image/tiff') {
    if (!links) {
      return [];
    }
    return links.filter(link => {
      return (link.rel === 'edit-media' && link.type === type);
    });
  };
  
  this.linkTitle = function(map) {
    return ``;
  };
  
  return this;
};

module.exports = MapImageService;