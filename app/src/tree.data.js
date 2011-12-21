Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore'], function(Class, DataTree, _) {

  return Class(DataTree, {

    buildTree: function() {
      var self = this;

      // Joshfire datasources
      var datasources = Joshfire.factory.config.datasources;

      // transform these datasources in a Joshfire Framework friendly datasource type
      var datasourceArray = [];
      _.each(datasources, function(value, key) {
        if(_.isArray(value)) {
          _.each(value, function(val, index) {
            datasourceArray.push( _.extend(Joshfire.factory.getDataSource(key).children[index], { id: key + index, name: val.name }) );  
          });
        } else {
          datasourceArray.push( _.extend(Joshfire.factory.getDataSource(key), { id: key }) );
        }
      });

      // add a last fake datasource for the About page 
      if(Joshfire.factory.config.template.options && Joshfire.factory.config.template.options.abouthtml) {
        datasourceArray.splice(datasourceArray.length, 0, {
                id: "about",
                config : {
                  col : "about"
                }, 
                name : "About"
              });
      }

      // Loop trough all datasources to create data tree branches
      var datachildren = [];
      _.each(datasourceArray, function(datasource, index) {
        datachildren.push(
          {
            'id': datasource.id,
            'col': datasource.config.col,
            'database': datasource.config.db,
            children: function(query, cb) {
              datasource.find({}, function (err, data) {
                // The framework requires an 'id', but datasources
                // use 'url' (or nothing). Make sure we have an id.
                // NB: the framework does not like URL as ids!
                var items = _.map(data.entries, function (item, idx) {
                  return _.extend(item, { id: "#" + idx });
                });

                cb(null, items);
              });
            }
          });
      });

      // return the data tree
      return [
        {
          id: 'datasourcelist',
          children: function(query, callback) {
            callback(null, datasourceArray);
          }
        },
        {
          id: 'datasource',
          children: datachildren
        }
      ];

    }
  });

});