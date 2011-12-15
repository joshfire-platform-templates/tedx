/**
 * Contain some UI elements that are used in data trees.
 */

Joshfire.define(['joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube'], function(List, Panel, PanelManager, Button, Video) {
	return {
    tplHeader : '<% if(Joshfire.factory.config.app.logo) { %>' + 
                  '<img class="applogo" src="<%= Joshfire.factory.config.app.logo.url %>" alt="<%= Joshfire.factory.config.app.name %>" />' +
                '<% } else { %>' +
                  '<%= Joshfire.factory.config.app.name %>' +
                '<% } %>',

    tplTweetItem :  '<div class="tweet">' +
                  '<% if (item.author) { %>' +
                    '<% if (item.author[0] && item.author[0].image) { %>' +
                      '<img src="<%= item.author[0].image.contentURL %>" alt="" />' +
                    '<% } %>' +
                    '<p class="user"><span class="name"><%= item.author[0].name %></span>' +
                    '<% if (item.publisher && (item.publisher.name === "Twitter")) { %>' +
                      ' <span class="login">@<%= item.author[0].url.replace("http://twitter.com/", "") %></span>' +
                    '<% } %>' +
                    '</p>' +
                  '<% } %>' +
                  '<p class="content"><%= item.name %></p>' +
                  '<p class="date"><%= item.datePublished %></p>' +                  
                '</div>',

    tplItemPreview :  '<% if (item.image) { %>' +
                        '<div class="preview"><img src="<%= item.image.contentURL %>"></div>' +
                      '<% } %>',

    tplItemThumbnail :  '<% if (item.image && item.image.contentURL) { %>' +
                          '<div class="thumbnail" style="background-image:url(\'<%=item.image.contentURL%>\')"></div>' +
                        '<% } %>',
    
    tplDataAuthor:  '<% if (data.author && data.author[0]) { %>' +
                      '<p class="author">By <strong><%= data.author[0].name %></strong></p>' +
                    '<% } %>',

    getItemDescriptionTemplate: function (maxLength) {
      return '<% if (item.description) { %>' +
        '<div class="abstract">' +
          '<% if (item.description.length > ' + maxLength + ') {' +
            'print(item.description.substring(0, ' + maxLength + ') + "…");' +
          '} else {' +
            'print(item.description); ' +
          '} %>' +
        '</div>' +
        '<% } %>';
    }

	};
});
