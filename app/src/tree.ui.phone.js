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
              id: 'title', // the title or the logo
              type: Panel,
              innerTemplate: UI.tplHeader
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
              //scroller: false, // do not use iScroll it's crappy crap (and doesn't work with a grid made of floats)
              type: List,
              htmlClass: 'abs100',
              loadingTemplate: '<div class="loading"></div>',
              itemTemplate: "<li id='<%=itemHtmlId%>' " + 
                            "data-josh-ui-path='<%= path %>' data-josh-grid-id='<%= item.id %>'" + 
                            "class='josh-List joshover item-<%= item.itemType %> mainitemlist " + 
                            // grid view
                            "<% if (item.itemType === 'ImageObject') { %>" +
                              "grid" +
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
                  UI.getItemDescriptionTemplate(70) +
                  UI.tplItemPreview +
                  '<span class="list-arrow"></span>' +
                '<% } else if (item.itemType === "ImageObject") { %>' +
                  UI.tplItemThumbnail +
                '<% } else if (item.itemType === "Article/Status") { %>' +
                  UI.tplTweetItem +
                '<% } else { %>' +
                  '<%= item.name %><span class="list-arrow"></span>' +
                '<% } %>'
            },
            {
              id: 'detail',
              type: Panel,
              loadingTemplate: '<div class="loading"></div>',
              uiDataMaster: '/content/itemList',              
              autoShow: false,
              children: [
                {
                  // Article
                  id: 'article',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loading"></div>',
                  innerTemplate:
                    '<div class="title"><h1><%= data.name %></h1>' +
                      UI.tplDataAuthor +
                    '</div>' +
                    '<% if (data.articleBody) { print(data.articleBody); } %>',
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/article').htmlEl;
                    if (ui.data.itemType === 'VideoObject' || ui.data.itemType === 'ImageObject' || ui.data.itemType == 'Article/Status') {
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
                  innerTemplate:
                  '<div class="tweet">' +
                    '<% if (data.author) { %>' +
                      '<% if (data.author[0] && data.author[0].image) { %>' +
                        '<img src="<%= data.author[0].image.contentURL %>" alt="" />' +
                      '<% } %>' +
                      '<p class="username"><%= data.author[0].name %></p>' +
                      '<% if (data.publisher && (data.publisher.name === "Twitter")) { %>' +
                        ' <p class="userlogin">@<%= data.author[0].url.replace("http://twitter.com/", "") %></p>' +
                      '<% } %>' +
                    '<% } %>' +
                    '<p class="content"><%= data.name %></p>' +
                    '<p class="date"><%= data.datePublished %></p>' +                  
                  '</div>',

                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/image').htmlEl;
                    if (ui.data.source =='twitter') {
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
                  innerTemplate: '<img src="<%= data.contentURL %>" alt="" />',
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
              innerTemplate:
                  '<div class="aboutpage">' +
                    '<% if(Joshfire.factory.config.app.logo) { %>' + 
                      '<img class="applogo" src="<%= Joshfire.factory.config.app.logo.url %>" alt="<%= Joshfire.factory.config.app.name %>" />' +
                    '<% } %>' +
                    '<p class="appname"><%= Joshfire.factory.config.app.name %></p>' +
                  '</div>'
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