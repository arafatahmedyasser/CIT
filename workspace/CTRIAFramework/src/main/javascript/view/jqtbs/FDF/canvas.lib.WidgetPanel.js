/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib');
/**
 * @namespace "canvas.lib"
 * @description This component is currently responsible for rendering widget panel element.
 */
canvas.lib.WidgetPanel = Class(canvas.lib.FormElements, {
    /**
     * @method generateFieldSpecificEvents
     * @memberof "canvas.lib.WidgetPanel"
     * @description This method is responsible for creating the element specific functions.
     */
    generateFieldSpecificEvents: function() {
        var element = this.getComponent().find("div[name='" + this.itemId + "']");
        var that = this;
        var widgetConfig = {
            CONTAINER_FLAG: 'N',
            'WGT_HEADER_IND': 'Y',
            WIDGET_ID: this.widgetId
        };
        var config = {
            elem: element,
            PORTLET_REQ: true,
            uData: this.uData
        };
        cbx.core.extend(config, widgetConfig);
        that.app = new canvas.lib.app(config);
        that.app.cellClickHandler = $.proxy(this.cellclick, that);
        that.app.cellDblClickHandler = $.proxy(this.cellDblClick, that);
        that.app.cellSingleClickHandler = $.proxy(this.cellSingleClick, that);
        that.app.dataModifiedClickHandler = $.proxy(this.dataModified, that);
        that.app.extraParamsHandler = $.proxy(this.extraParamsHandler, that);
        that.app.handleDataLoaded = $.proxy(this.handleDataLoaded, that);
    },
    /**
     * @method setFieldValue
     * @memberof "canvas.lib.WidgetPanel"
     * @description This method is responsible to set the field value.
     */
    setFieldValue: function(value) {},
    /**
     * @method getFieldValue
     * @memberof "canvas.lib.WidgetPanel"
     * @description This method is responsible to get the field value.
     */
    getFieldValue: function() {},
    handleDataLoaded: function() {
        var params = {};
        params.PAGE_CODE_TYPE = 'VDF_CODE';
        params.PRODUCT_NAME = this.app.renderer.listViewMD.PRODUCT_CODE;
        params.INPUT_SUB_PRODUCT = this.app.renderer.listViewMD.PRODUCT_CODE;
        params.INPUT_FUNCTION_CODE = this.app.renderer.listViewMD.FUNCTION_CODE;
        params.INPUT_ACTION = 'EXPORT_ACTION';
        params.GROUP_HEADER_REQD = 'N';
        params.IS_STREAM_ENABLED = 'N';
        params.EXPORT_FORMAT = 'HTML';
        params.ONLY_CONTENT = 'Y';
        params.WIDGET_ID = this.app.renderer.widgetID;
        params.VIEW_ID = this.app.renderer.md.md.VIEW_MD.VIEW_ID;
        params.CURRENCY_CD = iportal.preferences.getEquivalentCurrency();
        params.WID_BUNDLE_KEY = 'common';
        params._colProperties = this.app.renderer.renderer.headerArrayContent;
        var returnParamObj = this.app.renderer.renderer.prepareParams();
        var colFilters = this.app.renderer.renderer.filterClass.colFiltersForWidgetPanelPrint;
        if (colFilters) {
            for (var key in colFilters) {
                params[key] = colFilters[key];
            }
        }
        params.sort = returnParamObj.sort;
        params.dir = returnParamObj.dir;
        this.preparedParams = [];
        this.preparedParams.push(params);
        this.updateScreenViewData(this);
    },
    dataModified: function() {
        for (var i = 0; i < arguments[2].length; i++) {
            arguments[2][i].data.widgetId = this.widgetId;
        }
        this.formManager.handlerEvent('cbxwidgetmodified', this.itemId, arguments[2]);
    },
    selectedRecords: function() {
        this.formManager.handlerEvent('cbxwidgetselected', this.itemId, arguments[2]);
    },
    cellclick: function() {
        var fn = CWEH.getHandler(this.widgetId, CWEC.CELL_CLICK);
        if (cbx.core.isFunction(fn)) {
            fn.apply(this.app, arguments);
        }
        this.formManager.handlerEvent('cbxwidgetcellclick', this.itemId, arguments[2]);
    },
    extraParamsHandler: function() {
        var fn = CWEH.getHandler(this.widgetId, CWEC.EXTRA_PARAMS_HDLR);
        if (cbx.core.isFunction(fn)) {
            fn.apply(this.app, arguments);
        }
        var addParams = this.formManager.handlerEvent('cbxbeforeload', this.itemId, arguments[0]);
        return (cbx.apply(arguments[0], addParams));
    },
    cellSingleClick: function() {
        var fn = CWEH.getHandler(this.widgetId, CWEC.SINGLE_CLICK);
        if (cbx.core.isFunction(fn)) {
            fn.apply(this.app, arguments);
        }
        this.formManager.handlerEvent('cbxwidgetsingleclick', this.itemId, arguments[2]);
    },
    exportParams: function() {
        return this.preparedParams;
    },
    getScreenViewData: function() {
        var params = {};
        params['widgetID'] = this.widgetId;
        params['exportParams'] = this.exportParams();
        return params;
    }
});
CFCR.registerFormCmp({
    'COMP_TYPE': 'FORM_FIELDS',
    'COMP_NAME': 'cbx-widgetpanel'
}, canvas.lib.WidgetPanel);