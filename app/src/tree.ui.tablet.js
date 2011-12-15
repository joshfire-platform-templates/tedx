Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'src/ui-components'], function(Class, UITree, List, Panel, PanelManager, Button, UI) {

  return Class(UITree, {

    buildTree: function() {

      var app = this.app;

      return [
        {
          id: 'sidebarleft',
          type: Panel,
          children: [
            {
              id: 'menu',
              type: List,
              dataPath: '/datasourcelist/',
              itemInnerTemplate: '<div class="picto item-<%= item.config.col %>"></div><div class="name"><%= item.name %></div>',
              onData: function() {} // trigger data, WTF?
            }
          ]
        },
        {
          id: 'sidebarright',
          type: Panel,
          children: [
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
                {
                  id: 'title', // the title or the logo
                  type: Panel,
                  innerTemplate: UI.tplHeader
                }
              ]
            },
            {
              id: 'content',
              type: PanelManager,
              uiMaster: '/sidebarleft/menu',
              children: [
                {
                  id: 'itemList',
                  type: List,
                  loadingTemplate: '<div class="loading"></div>',
                  itemTemplate: "<li id='<%=itemHtmlId%>' " + 
                            "data-josh-ui-path='<%= path %>' data-josh-grid-id='<%= item.id %>'" + 
                            "class='josh-List joshover item-<%= item.itemType %> mainitemlist " + 
                            // grid view
                            "<% if (item.itemType === 'ImageObject') { %>" +
                              "grid" +
                            "<% } else if (item.itemType === 'VideoObject') { %>" +
                            // two rows
                              "rows" +
                            "<% } else { %>" +
                            // list view
                              "list" +
                            "<% } %>" +
                            "' >" +
                            "<%= itemInner %>" + 
                            "</li>",
                  itemInnerTemplate:
                    '<% if (item.itemType === "VideoObject") { %>' +
                      '<div class="title"><%= item.name %></div>' +
                      UI.getItemDescriptionTemplate(130) +
                      UI.tplItemPreview +
                      '<span class="list-arrow"></span>' +
                    '<% } else if (item.itemType === "ImageObject") { %>' +
                      UI.tplItemThumbnail +
                    '<% } else if (item.itemType === "Article/Status") { %>' +
                      '<div class="tweet"><%= item.name %></div>' +
                    '<% } else { %>' +
                      '<%= item.name %><span class="list-arrow"></span>' +
                    '<% } %>'
                },
                {
                  id: 'detail',
                  type: Panel,
                  uiDataMaster: '/sidebarright/content/itemList',
                  loadingTemplate: '<div class="loading"></div>',
                  autoShow: false,
                  children: [
                    {
                      // Article (default)
                      id: 'article',
                      type: Panel,
                      uiDataMaster: '/sidebarright/content/itemList',
                      forceDataPathRefresh: true,
                      loadingTemplate: '<div class="loading"></div>',
                      innerTemplate:
                        '<div class="title"><h1><%= data.name %></h1>' +
                        UI.tplDataAuthor +
                        '<% if (data.articleBody) { print(data.articleBody); } %>',
                      onData: function(ui) {
                        var thisEl = app.ui.element('/sidebarright/content/detail/article').htmlEl;
                        if (ui.data.itemType !== 'VideoObject' && ui.data.itemType !== 'ImageObject') {
                          $(thisEl).show();
                        } else {
                          $(thisEl).hide();
                        }
                      }
                    },
                    {
                      // Flickr
                      id: 'image',
                      type: Panel,
                      uiDataMaster: '/sidebarright/content/itemList',
                      forceDataPathRefresh: true,
                      loadingTemplate: '<div class="loading"></div>',
                      innerTemplate: '<img src="<%= data.contentURL %>" />',
                      onData: function(ui) {
                        var thisEl = app.ui.element('/sidebarright/content/detail/image').htmlEl;
                        if (ui.data.itemType === 'ImageObject') {
                          $(thisEl).show();
                        } else {
                          $(thisEl).hide();
                        }
                      }
                    },                    
                    {
                      // Video
                      id: 'video',
                      type: Panel,
                      uiDataMaster: '/sidebarright/content/itemList',
                      forceDataPathRefresh: true,
                      loadingTemplate: '<div class="loading"></div>',
                      onData: function(ui) {
                        var thisEl = app.ui.element('/sidebarright/content/detail/video').htmlEl,
                            player = app.ui.element('/sidebarright/content/detail/video/player.youtube');

                        if ((ui.data.itemType === 'VideoObject') && ui.data.publisher && (ui.data.publisher.name === 'Youtube')) {
                          player.playWithStaticUrl({
                            url: ui.data.url.replace('http://www.youtube.com/watch?v=', ''),
                            width: '480px',
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
                          uiDataMaster: '/sidebarright/content/itemList',
                          innerTemplate:
                            '<div class="title"><h1><%= data.name %></h1>' +
                            UI.tplDataAuthor +
                            '</div>'
                        },
                        {
                          id: 'player.youtube',
                          type: 'video.youtube',
                          autoShow: true,
                          controls: true,
                          noAutoPlay: false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    }

  });

});