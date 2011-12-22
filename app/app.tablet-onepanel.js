Joshfire.define(['joshfire/app', 'joshfire/class', './src/tree.data', './src/tree.ui.tablet', 'joshfire/utils/splashscreen', 'joshfire/uielements/panel'], function(BaseApp, Class, Data, UI, Splash, Panel) {
  
  return Class(BaseApp, {

    id: 'defaultApp',

    uiClass: UI,

    dataClass: Data,

    setup: function(callback) {
      var _this = this,
          menu = _this.ui.element('/sidebarleft/menu'),
          itemList = _this.ui.element('/sidebarright/content/itemList'),
          detailPanel = _this.ui.element('/sidebarright/content/detail'),
          logo = _this.ui.element('/sidebarright/header/title'),
          prevBtn = _this.ui.element('/sidebarright/header/prev');

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
          console.log("about");
          _this.ui.element('/sidebarright/content/about').show();
          return;
        }

        // Set the new dataPath
        _this.ui.element('/sidebarright/content/itemList').setDataPath('/datasource/' + datasourceId + '/');

        // Show itemList, because we could be on a detail panel
        _this.ui.element('/sidebarright/content').switchTo('itemList');

        // Hide prev button (todo: check if it's visible before doing so)
        prevBtn.hide();
      });

      // Refresh content each time new data is attached
      itemList.subscribe('data', function(event, data) {
        itemList.refresh();
      });

      // Open item when selected
      itemList.subscribe('select', function(event, data) {
        _this.ui.element('/sidebarright/content/detail').show();
      });

      // Show prev button when viewing details
      detailPanel.subscribe('afterShow', function(event, data) {
        prevBtn.show();
      });

      // Show previous panel now
      prevBtn.subscribe('select', function(event, data) {
        _this.ui.element('/sidebarright/content').switchTo('itemList');

        // Also, we could hide the button after displaying /content/itemList
        prevBtn.hide();
      });

      callback(null, true);
    }

  });

});