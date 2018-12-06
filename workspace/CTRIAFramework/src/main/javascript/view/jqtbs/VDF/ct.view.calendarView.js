/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.ns('ct.view');
/**
 * @class 		"ct.view.calendarView"
 * @extends 	"cbx.core.Component"
 * @description This class is responsible for rendering calendar app. 
 */
ct.view.calendarView = Class(cbx.core.Component, {
    /**
     * @method 		initialize
     * @memberof 	"ct.view.calendarView"
     * @description Initialises the calendar component.
     */
    initialize: function() {
        var me = this;
        this.widgetId = me.md.WIDGET_ID;
        this.viewMd = me.md;
        this.paremtElem = me.elem;
        this.highlightedDates = [];
        this.createComponent();
    },
    /**
     * @method 		doAjax
     * @memberof 	"ct.view.calendarView"
     * @description Returns the ajax call for the calendar component.
     */
    doAjax: function() {
        var that = this;
        var params = {
            'PAGE_CODE_TYPE': 'VDF_CODE',
            'INPUT_ACTION': 'INIT_DATA_ACTION',
            'INPUT_PRODUCT': that.md.md.VIEW_MD.PRODUCT_CODE,
            'INPUT_SUB_PRODUCT': that.md.md.VIEW_MD.SUB_PRODUCT_CODE,
            'INPUT_FUNCTION_CODE': that.md.md.VIEW_MD.FUNCTION_CODE,
            'PRODUCT_NAME': that.md.md.VIEW_MD.PRODUCT_CODE,
            'WIDGET_ID': that.widgetId,
            'VIEW_ID': that.md.md.VIEW_MD.VIEW_ID
        };
        CTLOADMASKMANAGER.initiateLoadMask($(this.paremtElem), '', $(this.paremtElem));
        cbx.ajax({
            isGlobalMaskReq: false,
            params: params,
            success: function(data) {
                that.highlightedDates = data.response.value.ALL_RECORDS;
                that.loadCalendarView();
                CTLOADMASKMANAGER.hideLoadMask($(that.paremtElem), $(that.paremtElem));
            }
        });
    },
    /**
     * @method 		createComponent
     * @memberof 	"ct.view.calendarView"
     * @description Calls the template file related to calendar component
     */
    createComponent: function() {
        var viewMetaData = this.viewMd;
        var tmpLayer = new ct.lib.tmplLayer('calendarview.cttpl', viewMetaData);
        tmpLayer.getTemplate(this.applyTemplate, this);
    },
    /**
     * @method 		applyTemplate
     * @memberof 	"ct.view.calendarView"
     * @params		template - String that contains HTML DOM
     * @description Inserts the calendar into the DOM when initiased. 
     */
    applyTemplate: function(template, tmpClass) {
        if (!cbx.core.isEmpty(this.paremtElem)) {
            $(this.paremtElem).append(template);
            $(this.paremtElem).find('[data-item-id=calendarcontainer]').datetimepicker({
                format: "DD/MM/YYYY",
                useCurrent: true,
                calendarWeeks: false,
                showClear: true,
                inline: true
            });
            this.doAjax();
        }
    },
    /**
     * @method 		loadCalendarView
     * @memberof 	"ct.view.calendarView"
     * @description Loads the calendar view by displaying the date picker with special dates.
     */
    loadCalendarView: function() {
        var me = this;
        $(this.paremtElem).find('[data-item-id=calendarcontainer]').data("destroy");
        $(this.paremtElem).find('[data-item-id=calendarcontainer]').datetimepicker({
            format: "DD/MM/YYYY",
            calendarWeeks: false,
            showTodayButton: true,
            inline: true
        });
        this.updateHighlightedDates();
        $(this.paremtElem).find('[data-item-id=calendarcontainer]').on("dp.update", function(e) {
            me.updateHighlightedDates(e);
        });
    },
    updateHighlightedDates: function(e) {
        var me = this;
        if (!cbx.isEmpty(me.highlightedDates)) {
            for (var i = 0; i < me.highlightedDates.length; i++) {
                var date = iportal.jsutil.convertStringToDateObject(me.highlightedDates[i]['HIGHLIGHTED_DATE']).format("m/d/Y")
                $(me.paremtElem).find('[data-item-id=calendarcontainer]').find('td[data-day = "' + date + '"]').addClass(me.highlightedDates[i]['HIGHLIGHTED_DATE_CLASS']).attr('title', me.highlightedDates[i]['HIGHLIGHTED_DATE_TEXT']);
            }
        }
    }
});
CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'CALENDAR'
}, ct.view.calendarView);