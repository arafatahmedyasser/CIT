/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */

Ext.ux.Calendar = function(config) {
    Ext.ux.Calendar.superclass.constructor.call(this, config);
    this.addEvents({
        click: true,
        mouseover: true,
        mouseout: true
    });
};

Ext.ux.Calendar = Ext.extend(Ext.Panel, {
	autoScroll :true,
    onRender: function(container, position) {
        Ext.ux.Calendar.superclass.onRender.apply(this, arguments);
        this.createInitialLayout();
        this.update();
    },
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    value: new Date(),
    moveMonths: function(months) {
        this.value = this.value.add(Date.MONTH, months);
        this.update();
    },
    showPrevMonth: function() {
        this.moveMonths(-1);
    },
    showNextMonth: function() {
        this.moveMonths(1);
    },
    showNavigation: true,

    createInitialLayout: function() {
        var htmlData = [];
        htmlData.push("<table class=\"ux-cal\" width='100%' height='100%' cellspacing='0'>");

        htmlData.push("<thead>");
        htmlData.push("<tr class='ux-cal-header'>");
        htmlData.push("<th><div class='x-date-left'><a href='#'>&nbsp;</a></th>")
        htmlData.push("<th colspan='5' class='ux-cal-monthTitle'>&nbsp;</th>");
        htmlData.push("<th><div class='x-date-right' style='float:right'><a href='#'>&nbsp;</a></div></th>")
        htmlData.push('</th></tr>');
        htmlData.push('</thead>');
        htmlData.push('<tbody>');

        htmlData.push("<tr class='ux-cal-weekday'>");
        var daysOfWeek = this.daysOfWeek;
        for (var i = 0; i < 7; i++) {
            var width = i == 0 || i == 6 ? 15 : 14;
            htmlData.push('<td width="' + width + '%">' + daysOfWeek[i] + '</td>');
        }
        htmlData.push('</tr>');

        for (var i = 0; i < 42; i++) {
            if (i % 7 == 0) { // First day of week
                htmlData.push("<tr class='ux-cal-row'>");
            }
            htmlData.push("<td>&nbsp;</td>");
            if (i % 7 == 6) { // Last day of week
                htmlData.push("</tr>");
            }
        }
        htmlData.push('</tbody>');
        htmlData.push("</table>");
        this.body.update(htmlData.join(""));

        var leftNav = this.body.child("div.x-date-left a");
        var rightNav = this.body.child("div.x-date-right a");
        this.leftClickRpt = new Ext.util.ClickRepeater(leftNav, { handler: this.showPrevMonth, scope: this, preventDefault: true, stopDefault: true });
        this.rightClickRpt = new Ext.util.ClickRepeater(rightNav, { handler: this.showNextMonth, scope: this, preventDefault: true, stopDefault: true });

        var showNavigation = this.showNavigation;
        leftNav.setDisplayed(showNavigation);
        rightNav.setDisplayed(showNavigation);
        this.calendarHeaderEl = this.body.child('th.ux-cal-monthTitle');

        var table = this.body.select('table');
        table.on({
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            click: this.onClick,
            scope: this
        });

        this.cells = this.body.select('tbody td');
    },

    beforeDestroy: function() {
    	   	
        this.leftClickRpt.destroy();
        this.rightClickRpt.destroy();
        this.cells.destroy();
        Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
    },

    onMouseOver: function(e) {
        this.processEvent('mouseover', e);
    },

    onMouseOut: function(e) {
        this.fireEvent('mouseout', e, this);
    },

    onClick: function(e) {
        this.processEvent('click', e);
    },

    processEvent: function(eventName, e) {
        var t = e.getTarget();
        var o = {};
        if (t.tagName == 'TD') {
            var cell = t;
            var row = t.parentNode;
            var rowIndex = row.rowIndex - 2; // Ignore header rows
            o = { cellIndex: cell.cellIndex, rowIndex: rowIndex, row: row, cell: cell };
            if (rowIndex >= 0) {
                o.date = this.startOfCalendar.add(Date.DAY, ((o.rowIndex) * 7) + o.cellIndex);
            }
        }
        this.fireEvent(eventName, o, e);
    },

    update: function() {
        var value = this.value.clearTime();
        var startOfCalendar = value.getFirstDateOfMonth();
        var endOfCalendar = startOfCalendar.getLastDateOfMonth();

        var startWeekDay = Number(startOfCalendar.format("N"));
        if (startWeekDay > 0) {
            startOfCalendar = startOfCalendar.add(Date.DAY, -startWeekDay);
        }

        var endWeekDay = Number(endOfCalendar.format("N"));
        if (endWeekDay < 6) {
            endOfCalendar = endOfCalendar.add(Date.DAY, 6 - endWeekDay);
        }

        var duration = endOfCalendar - startOfCalendar;
        var oneDay = 1000 * 60 * 60 * 24;
        duration = duration / oneDay + 1;

        endOfCalendar = endOfCalendar.add(Date.DAY, 42 - duration);

        var htmlData = [];

        var calendarTitle = value.format("F, Y");
        this.calendarHeaderEl.update(calendarTitle);

        var currentMonth = value.format("m");
        var o = { today: new Date().clearTime(), date: startOfCalendar };
        var cells = this.cells.elements;
        this.startOfCalendar = startOfCalendar;
        for (var i = 0; i < 42; i++) {

            o.css = o.date.format("m") == currentMonth ? "sameMonth" : "otherMonth";
            o.css += " x-unselectable";
            o.caption = o.date.format("d");
            o.cell = cells[i + 7];

            this.formatDay(o);

            o.cell.className = o.css;
            o.cell.innerHTML = o.caption;
            o.date = o.date.add(Date.DAY, 1);
        }
    },
    beforeDestroy: function() {
        if (this.rendered) {
            Ext.destroy(
                this.leftClickRpt,
                this.rightClickRpt
            );
        }
        Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
    }
});
Ext.reg('ux-cal', Ext.ux.Calendar);