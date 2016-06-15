'use strict';

var MapArchive = function(MapArchiveResource, NpolarApiSecurity) {
  'ngInject';
  const schema = '//api.npolar.no/schema/map-archive-1';

  return Object.assign(MapArchiveResource, {

    schema,

    create: function() {
      // Set "processor" to current user
      let user = NpolarApiSecurity.getUser();
      let processor = {
        email: user.email,
        name: user.name
      };
      let contributors = [
        { name: user.name, role: 'editor', email: user.email },
        { name: processor.name, role: 'processor', email: processor.email }
      ];
      let type = 'topographic';
      let collection = 'map-archive';
      let title = `Nytt kart oppretta av ${user.name} ${ new Date().toISOString()}`;
      let archives = [{
         'placename': 'Tromsø',
         'where': 'Framsenteret 5083',
         'count': 1,
         'country': 'NO',
         'organisation': 'Norsk Polarinstitutt'
       }];
      let license = null; //'http://creativecommons.org/licenses/by/4.0/';
      let rightsExpire = "2100-01-01";
      //let id = MapArchiveResource.randomUUID();
      return { title, license, type, collection, schema, archives, contributors };
    }


  });

};

module.exports = MapArchive;
// FIXME new => set processor, archives etc.

// authors/editors
//"homepage": {
//  "type": "string",
//  "description": "Web address of rights holder"
//},
//"

// code => sheet ?
//
//ISO 19115	/ 19115-1 roles
//+ resourceProvider
//+ custodian
//+ owner
//+ user
//+ distributor
//+ originator
//+ pointOfContact
//+ principalInvestigator
//+ processor
//+ publisher
//+ author
//+ sponsor
//+ coAuthor
//+ collaborator
//+ editor
//+ mediator
//+ rightsHolder
//+ contributor
//+ funder
//+ stakeholder
