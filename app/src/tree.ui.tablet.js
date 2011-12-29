Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube', 'src/ui-components', 'src/ui-fragments'], function(Class, UITree, List, Panel, PanelManager, Button, Video, UI, UIFragments) {

  return Class(UITree, {

    buildTree: function() {

      var app = this.app;

      return [
        {
          id: 'header',
          type: Panel,
          children: [
            UIFragments.title(),
            UIFragments.menu()
          ]
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/header/menu',
          children: [
              UIFragments.itemList({toGrid: ['ImageObject', 'VideoObject']})
            , UIFragments.detail({app:app, treePosition:"/content", uiDataMaster:"/content/itemList"})
            , UIFragments.about(app, "/content")
          ]
        }
      ];
    }

  });

});