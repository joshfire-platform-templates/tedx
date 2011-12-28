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
        itemList.setDataPath('/datasource/' + datasourceId + '/');

        // Check if the selected datasource should be displayed fullscreen
        var dataCol;
        for(var i=0; i< _this.data.tree['/datasource/'].length; i++ ) {
          if(_this.data.tree['/datasource/'][i].id == datasourceId) {
            dataCol = _this.data.tree['/datasource/'][i].col;       
          }
        }
        var fullSizeClass = 'fullSize';
        if((dataCol == 'photos' || dataCol == 'videos')) {
          if( !itemList.hasHtmlClass(fullSizeClass) ) {
            itemList.addHtmlClass(fullSizeClass);
            detailPanel.addHtmlClass(fullSizeClass);
          }
        } else {
          itemList.removeHtmlClass(fullSizeClass);
          detailPanel.removeHtmlClass(fullSizeClass);
        }

        // Show itemList, because we could be on a detail panel
        _this.ui.element('/content').switchTo('itemList');
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
          if( ! $('#defaultApp__content__itemList ul li').last().hasClass('clearfix') ) {
            $('#defaultApp__content__itemList ul').append('<li class="clearfix"></li>');
          }
        }
      });

      callback(null, true);
    }

  });

});