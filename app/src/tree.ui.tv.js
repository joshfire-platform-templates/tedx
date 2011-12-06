Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube'], function(Class, UITree, List, Panel, PanelManager, Button, Video) {

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
            }
          ]
        },
        {
          id: 'menu',
          type: List,
          dataPath: '/datasourcelist/',
          itemInnerTemplate: '<%= item.name %>',
          orientation:'left',
          onData: function() {}, // trigger data, WTF?
          beforeGridExit: function(self, direction) {
            if (direction == 'right') {
              app.ui.moveTo('focus', '/content/itemList');
              app.ui.element('/content/itemList').focusByIndex([0]);
            }
          }
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/menu',
          children: [
            {
              id: 'itemList',
              type: List,
              // orientation: 'left',
              loadingTemplate: '<div class="loading"></div>',
              itemTemplate: "<li id='<%=itemHtmlId%>' data-josh-ui-path='<%= path %>' data-josh-grid-id='<%= item.id %>' class='josh-List joshover item-<%= item.source %>'><%= itemInner %></li>",
              itemInnerTemplate:
                '<% if (item.source == "youtube") { %>' +
                  '<div class="preview"><img src="<%= item.image %>"></div><div class="title"><%= item.title %></div>' +
                '<% } else if (item.source == "twitter") { %>' +
                  '<div class="tweet"><%= item.title %></div>' +
                '<% } else { %>' +
                  '<%= item.title %>' +
                '<% } %>',
              beforeGridExit: function(self, direction) {
                // This is a Hack. This should be handled by a Grid Element of the Joshfire framework.

                // CSS impose a grid of 4 element in width
                var widthElements = 4;

                var coords = app.ui.element('/content/itemList').grid.currentCoords;

                switch (direction) {
                  case 'down' :
                    var gotoIndex = coords[0] + widthElements;
                    if( gotoIndex <  app.ui.element('/content/itemList').data.length ) {
                      app.ui.element('/content/itemList').grid.goTo( [gotoIndex, 0] );
                    }
                    break;
                  case 'up' :
                    var gotoIndex = coords[0] - widthElements;
                    if(gotoIndex < 0) {
                      app.ui.moveTo('focus', '/menu');
                    } else {
                      // the followingline doesn't work well: the grid coordinates are not updated 
                      //app.ui.element('/content/itemList').focusByIndex(gotoIndex);
                      app.ui.element('/content/itemList').grid.goTo( [gotoIndex, 0] );
                    }
                  break;
                }
              }
            }
          ]
        },
        {
          id: 'detail',
          type: Panel,
          uiDataMaster: '/content/itemList',
          noMouseAutoFocus: true,
          moveOnFocus: true,
          loadingTemplate: '<div class="loading"></div>',
          autoShow: false,
          children: [
            {
              id: 'back',
              type: Button,
              label: 'Back'
            },
            {
              id: 'text',
              type: Panel,
              uiDataMaster: '/content/itemList',
              forceDataPathRefresh: true,
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate:
                '<div class="title"><h1><%= data.title %></h1>' +
                '<p class="author"><%= data.creator || data.user %></p></div>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/text').htmlEl;
                if (ui.data.source == 'youtube' || ui.data.source == 'twitter') {
                  $(thisEl).hide();
                } else {
                  $(thisEl).show();
                }
              }
            },
            {
              id: 'video',
              type: Panel,
              uiDataMaster: '/content/itemList',
              forceDataPathRefresh: true,
              loadingTemplate: '<div class="loading"></div>',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/video').htmlEl,
                    player = app.ui.element('/detail/video/player.youtube');

                if (ui.data.source == 'youtube') {
                  player.playWithStaticUrl({
                    url: ui.data.url.replace('http://www.youtube.com/watch?v=', ''),
                    width: '480px'
                  });

                  $(thisEl).show();
                } else {
                  $(thisEl).hide();
                }
              },
              children: [
                {
                  id: 'title',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  innerTemplate:
                    '<div class="title"><h1><%= data.title %></h1>' +
                    '<p class="author">By <strong><%= data.creator || data.user %></strong></p></div>'
                },
                {
                  id: 'player.youtube',
                  type: Video,
                  autoShow: true,
                  controls: true,
                  noAutoPlay: false
                }
              ]
            },
            {
              id: 'twitter',
              type: Panel,
              uiDataMaster: '/content/itemList',
              forceDataPathRefresh: true,
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate:
                '<div class="tweet"><%= data.text %><p class="date"><%= data.date %></p></div>',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/twitter').htmlEl;
                if (ui.data.source == 'twitter') {
                  $(thisEl).show();
                } else {
                  $(thisEl).hide();
                }
              }
            }
          ]
        }
      ];
    }

  });

});