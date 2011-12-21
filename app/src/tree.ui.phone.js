Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'src/ui-components'], function(Class, UITree, List, Panel, PanelManager, Button, UI) {

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
            {
              id: 'title', // only the title, no logo
              type: Panel,
              innerTemplate: '<%= Joshfire.factory.config.app.name %>'
            }
          ]
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/footer',
          children: [
            {
              id: 'itemList',
              scroller: true,
              type: List,
              htmlClass: 'abs100',
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
            },
            {
              id: 'detail',
              type: Panel,
              scroller: true,
              htmlClass: 'detailView',
              loadingTemplate: '<div class="loading"></div>',
              uiDataMaster: '/content/itemList',              
              autoShow: false,
              children: [
                {
                  // Article and default
                  id: 'article',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loading"></div>',
                  innerTemplate:
                    '<div class="title"><h1><%= data.name %></h1>' +
                      UI.tplDataAuthor +
                    '</div>' +
                    '<div class="body">'+
                      '<% if (data.articleBody) { print(data.articleBody); } %>' +
                    '</div>',
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/article').htmlEl;
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
                  }
                },
                {
                  // Twitter
                  id: 'twitter',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loading"></div>',
                  innerTemplate: UI.tplTweetPage,
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/twitter').htmlEl;
                    if (ui.data.itemType === 'Article/Status') {
                      $(thisEl).show();
                    } else {
                      $(thisEl).hide();
                    }
                  }
                },
                {
                  // Google spreadsheets
                  id: 'google',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
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
                    var thisEl = app.ui.element('/content/detail/google').htmlEl;
                    if (ui.data.itemType === 'Article' && ui.data.url && ui.data.url.indexOf("spreadsheets.google.com") != -1) {
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
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loading"></div>',
                  innerTemplate: '<img class="picture-fullscreen" src="<%= data.contentURL %>" alt="" />',
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/image').htmlEl;
                    if (ui.data.itemType === 'ImageObject') {
                      $(thisEl).show();
                    } else {
                      $(thisEl).hide();
                    }
                  }
                },
                {
                  // Event
                  id: 'event',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loading"></div>',
                  innerTemplate: UI.tplEventPage,
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/event').htmlEl;
                    if (ui.data.itemType === 'Event') {
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
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loading"></div>',
                  uiDataMaster: '/content/itemList',
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/video').htmlEl,
                        player = app.ui.element('/content/detail/video/player.youtube');

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
                  children: [
                    {
                      id: 'title',
                      type: Panel,
                      uiDataMaster: '/content/itemList',
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
            },
            {
              id: 'about',
              type: Panel,
              loadingTemplate: '<div class="loading"></div>',          
              autoShow: false,
              innerTemplate: UI.tplAboutPage
            }
          ]
        },
        {
          id: 'footer',
          type: List,
          dataPath: '/datasourcelist/',
          itemInnerTemplate: '<div class="picto item-<%= item.config.col %>"></div><div class="name"><%= item.name %></div>',
          onData: function(data) {} // trigger data, WTF?
        }
      ];
    }

  });

});