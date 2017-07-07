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

    tage : [
        "Gestär", "Hüt", "Moärn", "Übärmoärn"
    ],

    day : "today",

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

    onDeviceReady: function() {
        $("#timetable-day").text(app.tage[currentDayIndex]);
        initSheek();
        eventController.register("schüddel", app.loadData);
        eventController.register("settings", app.loadData);
        app.loadData();
        navbar.init();
        initSeddings();
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

        return url;
    },

    loadData: function() {
        var xmlHttp = new XMLHttpRequest();
        displayLoadingOverlay();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                app.loadSuccess(xmlHttp.responseText);
            } else {
                app.loadError();
            }
        }
        xmlHttp.open("GET", app.buildURL(app.settings), true); // true for asynchronous
        xmlHttp.send(null);
    },

    loadError: function() {
        var table = $('<p></p>').addClass('class-error').text("Konnte den Stundenplan der Schule '"+settings.school+"' nicht laden!");
        var container = $('#timetable .content');
        container.html(table)
        hideLoadingOverlay();
    },

    loadSuccess: function(data) {
        var html = $(".ttp-table-wrapper", $.parseHTML( data ));
        var con = $('.ttp-table', html);

        var lines = $('.ttp-line, .ttp-second-row', con);

        var classFound = false;
        var secondLine = false;
        var table;

        for (var i = 0; i < lines.length; i++) {
            var th = $('th', lines[i]);
            if(th.text().toLowerCase().replace(/ /g,'') != settings.class.toLowerCase().replace(/ /g,'')) {
                $($(th).parent(), html).remove();
                if($(lines[i+1]).hasClass('ttp-second-row')){
                    $(lines[i+1], html).remove();
                }
            } else {
                classFound = true;
                if($(lines[i+1]).hasClass('ttp-second-row')){
                    secondLine = true;
                }
            }
        };

        if(!classFound){
            //console.log(html.html());
            table = $('<p></p>').addClass('class-error').text("Keine Klasse '"+settings.class+"' gefunden!");
        } else {
            table = app.parseClass(html, secondLine);
        }

        var container = $('#timetable .content');
        var div = $('<div></div>').html(table);
        console.log(div.html());
        div.onload = function(){
            alert("HI!");
        };
        container.append(div);
        hideLoadingOverlay();
    },

    parseClass: function(con, flag) {
        var hrs = $(con).find("thead .ttp-cell");
        var data = $("tbody .ttp-line td", con);

        var table = $('<table></table>');

        var data2 = $("tbody .ttp-second-row td", con).siblings();
        var counter = 0;
        var rowsW = 0;
        var finished = false;

        for(var i = 0; i < hrs.length; i++){
            if($(data[i]).attr('rowspan') != undefined){
                $(data[i]).removeAttr('rowspan');
            }
            if($(data[i]).attr('colspan') != undefined){
                $(data[i]).attr('rowspan', $(data[i]).attr('colspan'));
                $(data[i]).removeAttr('colspan');
            } else {
                $(data[i]).attr('colspan', 2);
            }
            if($(data[i]).hasClass("ttp-block-cell")){
                if(flag){var row = $('<tr></tr>').append(hrs[i]).append(data[i]).append(data2[counter]);}
                else { var row = $('<tr></tr>').append(hrs[i]).append(data[i]); }
                counter = 1;
                finished = false;
                rowsW = $(data[i]).attr("rowspan")-1;
            } else if(rowsW >= counter && !finished) {
                if(flag){var row = $('<tr></tr>').append(hrs[i]).append(data2[counter]);}
                counter++;
            } else {
                if(flag){var row = $('<tr></tr>').append(hrs[i]).append(data[i-rowsW]);}
                else { var row = $('<tr></tr>').append(hrs[i]).append(data[i]); }
                counter = 0;
                finished = true;
            }
            table.append(row);
        }

        return table;
    }
};
