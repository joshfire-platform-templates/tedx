/**
 * UI fragments are data tree elements that can be instanciate in a datatree.
 */
Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'src/ui-components'], function(Class, UITree, List, Panel, PanelManager, Button, UI, UIFragments) {
return {
  itemList : function() {
    return {
      id: 'itemList',
      scroller: true,
      type: List,
      htmlClass: 'itemList',
      loadingTemplate: '<div class="loading"></div>',
      itemTemplate: "<li id='<%=itemHtmlId%>' " + 
                    "data-josh-ui-path='<%= path %>' data-josh-grid-id='<%= item.id %>'" + 
                    "class='josh-List joshover item-<%= item.itemType.replace('/', '') %> mainitemlist " + 
                    // grid view
                    "<% if (item.itemType === 'ImageObject') { %>" +
                      " grid" +
                    "<% } else { %>" +
                    // list view
                      " list" +
                    "<% } %>" +
                    "' >" +
                    "<%= itemInner %>" + 
                    "</li>",
      itemInnerTemplate:
        '<% if (item.itemType === "ImageObject") { %>' +
          UI.tplItemThumbnail +
        '<% } else if (item.itemType === "Article/Status") { %>' +
          UI.tplTweetItem +
        '<% } else if (item.itemType === "Event") { %>' +
          UI.tplEventItem +   
        '<% } else if (item.itemType === "Article" && item.url && item.url.indexOf("spreadsheets.google.com") != -1) { %>' +
          '<div class="directory">' +
            UI.tplItemThumbnail +
            '<p class="name"><%= item.name %></p>' + 
            '<p class="description"><%= item.description %></p>' + 
            '<span class="list-arrow"></span>' +
          '</div>' +
        '<% } else { %>' +
          '<div class="title"><%= item.name %></div>' +
          UI.getItemDescriptionTemplate(70) +
          UI.tplItemPreview +
          '<span class="list-arrow"></span>' +
        '<% } %>'
    };
  },

  title : function() {
    return {
            id: 'title', // only the title, no logo
            type: Panel,
            innerTemplate: '<%= Joshfire.factory.config.app.name %>'
          };
  },

  menu : function(id) {
    return {
          id: id || 'menu',
          type: List,
          htmlClass: 'menu',
          dataPath: '/datasourcelist/',
          itemInnerTemplate: '<div class="picto item-<%= item.config.col %>"></div><div class="name"><%= item.name %></div>',
          onData: function(data) {} // trigger data, WTF?
        };
  },

  /**
   * @param app : a reference to the current application (in a UITree class, this.app)
   * @param treePosition : (optional) the string depresenting the position of the instanciated fragment in the tree. (need more work on this) 
   */
  detail : function(app, treePosition, uiDataMaster) {
    return {
      id: 'detail',
      type: Panel,
      // scroller: true,              
      htmlClass: 'detailView',
      loadingTemplate: '<div class="loading"></div>',
      uiDataMaster: uiDataMaster,        
      autoShow: false,
      children: [
        {
          // Article and default
          id: 'article',
          htmlClass: 'detailViewItem',
          type: Panel,
          scroller: true, 
          uiDataMaster: uiDataMaster,
          forceDataPathRefresh: true,
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate:
            '<div>' +
            '<div class="title"><h1><% if (data && data.name) { print(data.name); } %></h1>' +
              UI.tplDataAuthor +
            '</div>' +
            '<div class="body">'+
              '<% if (data.articleBody) { print(data.articleBody); } %>' +
            '</div>' +
            '</div>',
          onData: function(ui) {
            var thisEl = app.ui.element(treePosition + '/detail/article').htmlEl;
            if (ui.data.itemType === 'VideoObject' 
                || ui.data.itemType === 'ImageObject' 
                || ui.data.itemType === 'Article/Status'
                || ui.data.itemType === 'Event'
                || (ui.data.itemType === 'Article' && ui.data.url && ui.data.url.indexOf("spreadsheets.google.com") != -1)
              ) {
              $(thisEl).hide();
            }
            else {
              $(thisEl).show();
            }
          },
          onAfterRefresh : function() {
            app.ui.element(treePosition + '/detail/article').insertScroller();
          }
        },
        {
          // Twitter
          id: 'twitter',
          htmlClass: 'detailViewItem',                     
          type: Panel,
          uiDataMaster: uiDataMaster,
          forceDataPathRefresh: true,
          scroller: true,                   
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate: UI.tplTweetPage,
          onData: function(ui) {
            var thisEl = app.ui.element(treePosition + '/detail/twitter').htmlEl;
            if (ui.data.itemType === 'Article/Status') {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            app.ui.element(treePosition + '/detail/twitter').insertScroller();
          }
        },
        {
          // Google spreadsheets
          id: 'google',
          htmlClass: 'detailViewItem',                  
          type: Panel,
          scroller: true,                   
          uiDataMaster: uiDataMaster,
          forceDataPathRefresh: true,
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate:  '<div class="directory">' +
                            '<% if (data.image) { %>' +
                              '<div class="picture"><img src="<%= data.image.contentURL %>"></div>' +
                            '<% } %>' +
                            '<p class="name"><%= data.name %></p>' + 
                            '<p class="description"><%= data.description %></p>' + 
                            '<% if (data.articleBody) { %>' +
                              '<p class="content"><%= data.articleBody %></p>' +
                            '<% } %>' +
                          '</div>',
          onData: function(ui) {
            var thisEl = app.ui.element(treePosition + '/detail/google').htmlEl;
            if (ui.data.itemType === 'Article' && ui.data.url && ui.data.url.indexOf("spreadsheets.google.com") != -1) {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            app.ui.element(treePosition + '/detail/google').insertScroller();
          }
        },
        {
          // Flickr
          id: 'image',
          type: Panel,
          htmlClass: 'detailViewItem',                     
          scroller: true,                   
          uiDataMaster: uiDataMaster,
          forceDataPathRefresh: true,
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate: '<img class="picture-fullscreen" src="<%= data.contentURL %>" alt="" />',
          onData: function(ui) {
            var thisEl = app.ui.element(treePosition + '/detail/image').htmlEl;
            if (ui.data.itemType === 'ImageObject') {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            app.ui.element(treePosition + '/detail/image').insertScroller();
          }
        },
        {
          // Event
          id: 'event',
          type: Panel,
          htmlClass: 'detailViewItem',                     
          scroller: true,                   
          uiDataMaster: uiDataMaster,
          forceDataPathRefresh: true,
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate: UI.tplEventPage,
          onData: function(ui) {
            var thisEl = app.ui.element(treePosition + '/detail/event').htmlEl;
            if (ui.data.itemType === 'Event') {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            app.ui.element(treePosition + '/detail/event').insertScroller();
          }
        },
        {
          // Video
          id: 'video',
          type: Panel,
          htmlClass: 'detailViewItem',                     
          scroller: true,                   
          forceDataPathRefresh: true,
          loadingTemplate: '<div class="loading"></div>',
          uiDataMaster: uiDataMaster,
          onData: function(ui) {
            var thisEl = app.ui.element(treePosition + '/detail/video').htmlEl,
                player = app.ui.element(treePosition + '/detail/video/player.youtube');

            if ((ui.data.itemType === 'VideoObject') && ui.data.publisher && (ui.data.publisher.name === 'Youtube')) {
              player.playWithStaticUrl({
                url: ui.data.url.replace('http://www.youtube.com/watch?v=', ''),
                width: '100%'
              });
              $(thisEl).show();
            }
            else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            app.ui.element(treePosition + '/detail/video').insertScroller();
          },
          children: [
            {
              id: 'title',
              type: Panel,
              uiDataMaster: uiDataMaster,
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
    };
  },
  about : function(app, treePosition) {
    return {
      id: 'about',
      scroller: true,               
      type: Panel,
      htmlClass: 'about',   
      loadingTemplate: '<div class="loading"></div>',          
      autoShow: false,
      innerTemplate: UI.tplAboutPage,
      onAfterRefresh : function() {
        app.ui.element(treePosition + '/about').insertScroller();
      }
    };
  }
};
});
