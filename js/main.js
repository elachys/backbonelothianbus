var app = app || {};
var ENTER_KEY = 13;

$(function () {
    'use strict';
    // kick things off by creating the `App`
    new app.AppView();
});

app.Stop = Backbone.Model.extend({
    defaults: {
        code: '',
        name: '',
        latitude: 0,
        longitude: 0,
        direction: 0,
        services: []
    }
});
app.BusTime = Backbone.Model.extend({
    defaults: {}
});

var StopTimes = Backbone.Collection.extend({
    model: app.BusTime,
    url: function(){
        return "http://pipes.yahoo.com/pipes/pipe.run?_id=84213487dd2976daa76c23c43764b21d&_render=json&stopcode=" + this.code + "&_callback=?";
    },
    parse: function(res){
        console.log(res.value.items[0]);
    },
    initialize: function(models, options){
        this.code = options.code;
    }
});

var StopList = Backbone.Collection.extend({
    model: app.Stop,
    url: 'http://pipes.yahoo.com/pipes/pipe.run?_id=334bada2b12f8878e90b72890f104978&_render=json&lat=55.939208699999995&lng=-3.222108',
    parse: function(res){
        return _.map(res.value.items[0].stops.slice(0,5), function(entry){
            entry.code = entry.stop_code;
            entry.name = entry.stop_name;
            entry.services = entry.service_list;
            return entry;
        });
    }
});

app.stops = new StopList();

app.AppView = Backbone.View.extend({
    el: '#content',
    initialize: function(){
        this.listenTo(app.stops, 'all', this.render);
        this.listenTo(app.stops, 'add', this.addOne);
        app.stops.fetch();
    },
    addOne: function(stop){
        var view = new app.StopListView({ model:  stop});
        $('#stop-list').append(view.render().el);
    }
});

app.stopView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#stopBuses-template').html()),
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    }
});

app.StopListView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click .times': "times"
    },
    template: _.template($('#stopItem-template').html()),
    times: function(){
        var collection = new StopTimes([], {code: this.model.stop_code});
        collection.fetch();
        var view = new app.stopView({model: this.model});
        this.$el.find('ul').replaceWith(view.render().el);

    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});


