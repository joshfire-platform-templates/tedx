Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'src/ui-components', 'src/ui-fragments'], function(Class, UITree, List, Panel, PanelManager, Button, UI, UIFragments) {

  return Class(UITree, {

    buildTree: function() {

      var app = this.app;

      return [
        {
          id: 'header',
          type: Panel,
          htmlClass: 'header',
          children: [
            {
              id: 'prev',
              type: Button,
              label: 'Prev',
              autoShow: false
            },
            UIFragments.title()
          ]
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/footer',
          children: [
            UIFragments.itemList(),
            UIFragments.detail({app: app, treePosition:"/content", uiDataMaster:"/content/itemList"}),
            UIFragments.about(app, "/content")
          ]
        },
        UIFragments.menu( {id:'footer'} )
      ];
    }

  });

});