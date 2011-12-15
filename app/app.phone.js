Joshfire.define(['joshfire/app', 'joshfire/class', './src/tree.data', './src/tree.ui.phone', 'joshfire/utils/splashscreen', 'joshfire/uielements/panel'], function(BaseApp, Class, Data, UI, Splash, Panel) {
  
  return Class(BaseApp, {

    id: 'defaultApp',

    uiClass: UI,

    dataClass: Data,

    setup: function(callback) {
      var _this = this,
          footer = _this.ui.element('/footer'),
          itemList = _this.ui.element('/content/itemList'),
          detailPanel = _this.ui.element('/content/detail'),
          prevBtn = _this.ui.element('/header/prev'),
          logo = _this.ui.element('/header/title');

      this.splash = new Splash();

      // Change app name globally
      document.title = Joshfire.factory.config.app.name;

      // Populate footer
      footer.subscribe('data', function(event, data) {
        // We have data, remove splashscreen
        // Todo: it may better to remove it "onAfterShow" or "onAfterInsert"
        _this.splash.remove();

        // Select the first tab on our footer
        footer.selectByIndex(0);
      });

      // Handle clicks on footer
      footer.subscribe('select', function(event, data) {
        var datasourceId = data[0][0];

        // if about page
        if(datasourceId == 'about') {
          console.log("about");
          _this.ui.element('/content/about').show();
          return;
        }

        // Set the new dataPath
        _this.ui.element('/content/itemList').setDataPath('/datasource/' + datasourceId + '/');

        // Show itemList, because we could be on a detail panel
        _this.ui.element('/content').switchTo('itemList');

        // Hide prev button (todo: check if it's visible before doing so)
        prevBtn.hide();
      });

      // Refresh content each time new data is attached
      itemList.subscribe('data', function(event, data) {
        itemList.refresh();
      });

      // Open item when selected
      itemList.subscribe('select', function(event, data) {

        //use this code if wyou want to disable the preview for a certain datasource
        //var dataPath = itemList.dataPath + data[0];
        //var ds = _app.data.get(dataPath);

        // display detail page except for twitter
        //if(ds.source != 'twitter' ) {
        _this.ui.element('/content/detail').show();

        //   _this.ui.element('/content/detail').setDataPath(dataPath);
        //   _this.ui.element('/content/detail/article').setDataPath(dataPath);
        //   _this.ui.element('/content/detail/video').setDataPath(dataPath);
        //   _this.ui.element('/content/detail/video/player.youtube').setDataPath(dataPath);
        //   _this.ui.element('/content/detail/video/title').setDataPath(dataPath);                                          
        // }

      });

      // Show prev button when viewing details
      detailPanel.subscribe('afterShow', function(event, data) {
        prevBtn.show();
      });

      // Show previous panel now
      prevBtn.subscribe('select', function(event, data) {
        _this.ui.element('/content').switchTo('itemList');

        // _this.ui.element('/header/prev') == this?
        // Also, we could hide the button after displaying /content/itemList
        prevBtn.hide();
      });

      callback(null, true);
    }

  });

});