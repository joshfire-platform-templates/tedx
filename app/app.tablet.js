Joshfire.define(['joshfire/app', 'joshfire/class', './src/tree.data', './src/tree.ui.tablet', 'joshfire/utils/splashscreen', 'joshfire/uielements/panel', 'src/ui-components'], function(BaseApp, Class, Data, UI, Splash, Panel, UItpl) {

  return Class(BaseApp, {

    id: 'defaultApp',

    uiClass: UI,

    dataClass: Data,

    setup: function(callback) {
      var _this = this,
          menu = _this.ui.element('/header/menu'),
          itemList = _this.ui.element('/content/itemList'),
          detailPanel = _this.ui.element('/content/detail'),
          title = _this.ui.element('/header/title');

      this.splash = new Splash();

      // Change app name globally
      document.title = Joshfire.factory.config.app.name;

      // Populate menu
      menu.subscribe('data', function(event, data) {
        // We have data, remove splashscreen
        // Todo: it may better to remove it "onAfterShow" or "onAfterInsert"
        _this.splash.remove();

        // Select the first tab on our menu
        menu.selectByIndex(0);
      });

      // Handle clicks on menu
      menu.subscribe('select', function(event, data) {
        var datasourceId = data[0][0];

        // if about page
        if(datasourceId == 'about') {
          _this.ui.element('/content/about').show();
          return;
        }

        // Set the new dataPath
        _this.ui.element('/content/itemList').setDataPath('/datasource/' + datasourceId + '/');

        // Show itemList, because we could be on a detail panel
        _this.ui.element('/content').switchTo('itemList');
      });

      // Refresh content each time new data is attached
      itemList.subscribe('data', function(event, data) {
        itemList.refresh();
      });

      // Open item when selected
      itemList.subscribe('select', function(event, data) {
        _this.ui.element('/content/detail').show();
      });

      // Todo: find better event to select first item
      itemList.subscribe('afterRefresh', function(event, data) {
        var $items = $('#defaultApp__content__itemList li');
        if($items.length == 0) {
          $('#defaultApp__content__itemList').html(UItpl.tplNothingToSeeHere);
        }

        if( $('#defaultApp__content__itemList li.grid').length > 0 ) {
           $('#defaultApp__content__itemList ul').append('<li style="clear:both;"></li>');
        }
      });

      callback(null, true);
    }

  });

});