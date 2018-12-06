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
 */
cbx.ns('ct.view');
/**
 * @className : ct.view.listView
 * @extends : cbx.core.Component
 * @description: This class is responsible to initate all LIST view components. <BR>
 *               This does the following three tasks : <BR>
 *               1) Fetches Grid Template and keeps it for future actions .<BR>
 *               2) Responsible for all ajax calls.<BR>
 *               3) Prepares GRID component for use.
 */
ct.view.listView = Class(cbx.core.Component, {

    columnArr: {},
    selectedData: [],
    modifiedData: [],

    /**
     * @member initialize
     * @memberof ct.view.listView
     * @description Class constructor, Called from JQTBS portlet and it initialize the config.
     * @constructor
     */
    initialize: function() {
        var me = this.md;
        this.widgetID = me.WIDGET_ID;
        this.listViewMD = me.md.VIEW_MD;
        this.perPage = parseInt(this.listViewMD.FLD_RECORDS_PER_PAGE) || 0;
        var portalLimit = parseInt(iportal.systempreferences.getPageSizeForPagination()) || 45;
        this.sortClass = "";
        if (this.perPage <= 0) {
            this.perPage = portalLimit;
        }
        this.renderListView();
    },
    /**
     * @member getPerPage
     * @memberof ct.view.listView
     * @description Returns the per page count of a list i.e Maximum number of records shown in a page, next set of records can be achieved via pagination.
     */
    getPerPage: function() {
        return parseInt(this.perPage);
    },
    /**
     * @member renderListView
     * @memberof ct.view.listView
     * @description Initialize the listGroup class if the field view type is 'GROUP' else initializes the listRenderer.Listrenderer class is used to render the list.This class holds
     * the metadata,business data and handlers to perform action on that list.
     */
    renderListView: function() {
        var that = this;
        if (this.listViewMD.FLD_VIEW_TYPE == "GROUP") {
            this.renderer = new canvas.lib.listGroup({
                scope: this
            });
        } else
            this.renderer = new canvas.lib.listRenderer({
                scope: this
            });

        var params = that.renderer.prepareParams();
        that.doAjax(params);
    },

    /**
     * @member doRefresh
     * @memberof ct.view.listView
     * @description API to refresh the widget
     */
    doRefresh: function() {
        var params = this.renderer.prepareParams();
        if (!this.renderer.compactView) {
            if (this.listViewMD.FLD_VIEW_TYPE != "PROPERTY") {
                this.renderer.updatePosition();
            }
        }

        this.doAjax(params);
    },

    /**
     * @member destroy
     * @memberof ct.view.listView
     * Destroying scope, for fresh init
     * 		ct.view.listView.$superp.destroy();
     */
    destroy: function() {
        this.renderer.removeFilters();

    },
    /**
     * @member getSelectedData
     * @memberof ct.view.listView
     * @description Gets the selected records from the store and returns
     */
    getSelectedData: function() {
        return this.selectedData;
    },
    /**
     * @member getModifiedData
     * @memberof ct.view.listView
     * @description Gets the modified records from the store and returns
     */
    getModifiedData: function() {
        return this.modifiedData;
    },
    /**
     * @member destroy
     * @memberof ct.view.listView
     * @description updates the business data by columnName rowIndex and value
     * @param {string} columnName 
     * @param {string} rowIndex
     * @param {string} value
     */
    updateData: function(columnName, rowIndex, value) {
        this.renderer.updateListAppCellValue(columnName, rowIndex, value);
    },
    /**
     * @member doAjax
     * @memberof ct.view.listView
     *	@description Responsible to make an ajax call to get the metadata and business data 
     *	@params : {object} params to get metadata and business data
     *	@params {function} callback executes the function after successful ajax call.
     *	@callback: Callback to function to execute after render the list view 
     */
    doAjax: function(params, callback, compactView) {
        this.selectedData = [];
        this.modifiedData = [];
        var additionalparams = this.parentPortlet.alterReqParams.call(this.parentPortlet);

        if (!cbx.isEmpty(additionalparams)) {
            cbx.apply(params, additionalparams);
        }

        var that = this;
        CTLOADMASKMANAGER.initiateLoadMask(that.elem, iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LOADING") + that.md.md.VIEW_MD.VIEW_DISPLAY_NM, that.elem);
        cbx.ajax({
            isGlobalMaskReq: false,
            params: params,
            success: function(data) {
                that.viewConf.raiseEvent(CWEC.DATA_LOAD, data.response.value, that.listViewMD);
                var config = {
                    md: data,
                    compactView: compactView
                };
                if (typeof(callback) == 'function') {
                    callback.apply(that, [metadata]);
                }
                that.renderer.initalizeRenderer(config);
            }
        });
    },

    /**
     * @member refresh
     * @memberof ct.view.listView
     * @description used to refresh the list view
     */
    refresh: function() {
        this.doRefresh();
    },
    /**
     * @member clearFilter
     * @memberof ct.view.listView
     * @description remove all filters and calls the dorefresh function.
     */
    clearFilter: function() {
        this.renderer.removeFilters();
        this.doRefresh();
    },
    /**
     * @member maximizeOpen
     * @memberof ct.view.listView
     * @description used to refresh the content of list when it is opened in modal window i.e fullscreen
     */
    maximizeOpen: function() {
        this.doRefresh();
    },
    /**
     * @member refreshViewAfterModalClose
     * @memberof ct.view.listView
     * @description Refresh the content of list in main screen after closing the fullscreen window
     */
    refreshViewAfterModalClose: function() {
        this.doRefresh();
    },
    /**
     * @member exportToPDF
     * @memberof ct.view.listView
     * @description This method is responsible for exporting the list to PDF format
     */
    exportToPDF: function() {

        ct.app.exportHandler.execute(this, 'PDF');
    },
    /**
     * @member exportToExcel
     * @memberof ct.view.listView
     * @description This method is responsible for exporting the list to Excel format
     */
    exportToExcel: function() {

        ct.app.exportHandler.execute(this, 'XLS');
    },
    /**
     * @member exportToCSV
     * @memberof ct.view.listView
     * @description This method is responsible for exporting the list to CSV format
     */
    exportToCSV: function() {

        ct.app.exportHandler.execute(this, 'CSV');
    },
    /**
     * @member exportToRTF
     * @memberof ct.view.listView
     * @description This method is responsible for exporting the list to RTF format
     */
    exportToRTF: function() {

        ct.app.exportHandler.execute(this, 'RTF');
    },
    /**
     * @member print
     * @memberof ct.view.listView
     * @description This method is responsible for printing the list.
     */
    print: function() {

        ct.app.exportHandler.execute(this, 'PRINT');
    },
});

CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'GROUP'
}, ct.view.listView);
CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'CLASSIC_GRID'
}, ct.view.listView);
CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'PROPERTY'
}, ct.view.listView);