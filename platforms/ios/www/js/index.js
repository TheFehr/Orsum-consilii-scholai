/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var app = {

    days : [
        "yesterday", "today", "tomorrow", "dayAfterTomorrow"
    ],

    day : "today",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        initSheek();
        eventController.register("schüddel", app.loadData);
        eventController.register("settings", app.loadData);
        app.loadData();
        navbar.init();
    },

    buildURL: function() {
        var url = "https://intranet.tam.ch/";
        if(settings.school != ''){
            url = url.concat(settings.school);
        } else {
            url = url.concat("kbw");
        }
        if(settings.day != ''){
            url = url.concat("/public/timetable/daily-class-schedule?dayShort=", app.day);
        } else {
            url = url.concat("/public/timetable/daily-class-schedule?dayShort=today");
        }
        
        return /*"http://192.168.43.31/today.html"*/url;
    },

    loadData: function() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            app.loadSuccess(xmlHttp.responseText);
        }
        xmlHttp.open("GET", app.buildURL(app.settings), true); // true for asynchronous
        xmlHttp.send(null);
    },

    loadError: function(data) {

    },

    loadSuccess: function(data) {
        var html = $($.parseHTML( data ));
        var con = $('.ttp-table', html);

        var lines = $('.ttp-line, .ttp-second-row', con);

        var classFound = false;
        var table;

        for (var i = 0; i < lines.length; i++) {
            var th = $('th', lines[i]);
            if(th.text().toLowerCase().replace(/ /g,'') != settings.class.toLowerCase().replace(/ /g,'')) {
                $($(th).parent(), html).remove();
            } else {
                classFound = true;
            }
        };

        if(!classFound){
            table = $('<p></p>').addClass('class-error').text("Keine Klasse '"+settings.class+"' gefunden!");
        } else {
            table = app.parseClass(html);
        }

        var container = $('#timetable .content');
        container.html(table)
    },

    parseClass: function(con) {
        var hrs = $(con).find("thead .ttp-cell");
        var data = $(con).find("tbody td");

        console.log(hrs.text());

        var table = $('<table></table>');

        for(var i = 0; i < hrs.length; i++){
            if($(data[i]).attr('colspan') != undefined){
                $(data[i]).attr('rowspan', $(data[i]).attr('colspan'));
                $(data[i]).removeAttr('colspan');
            }
            var row = $('<tr></tr>').append(hrs[i]).append(data[i]);    
            table.append(row);
        };

        /*for(var i = 1; i < hrs.length; i++){
            var d = $(data[i]);
            var row = $('<tr></tr>').append(hrs[i]).append(d);
            if(data.length > hrs.length) {
                row.append(data[data.length-(data.length-hrs.length+i)]);       
            }
            table.append(row);
        }*/
        
        return table;
    }
};
