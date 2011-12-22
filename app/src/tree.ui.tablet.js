Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube', 'src/ui-components', 'src/ui-fragments'], function(Class, UITree, List, Panel, PanelManager, Button, Video, UI, UIFragments) {

  return Class(UITree, {

    buildTree: function() {

      var app = this.app;

      return [
        {
          id: 'header',
          type: Panel,
          children: [
            {
              id: 'title',
              type: Panel,
              innerTemplate: '<%= Joshfire.factory.config.app.name %>'
            },
            {
              id: 'menu',
              htmlClass: 'menu',
              type: List,
              dataPath: '/datasourcelist/',
              itemInnerTemplate: '<%= item.name %>',
              onData: function() {} // trigger data, WTF?
            }
          ]
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/header/menu',
          children: [
            UIFragments.itemList(),
            UIFragments.detail(app, "/content", "/content/itemList")
          ]
        }
      ];
    }

  });

});