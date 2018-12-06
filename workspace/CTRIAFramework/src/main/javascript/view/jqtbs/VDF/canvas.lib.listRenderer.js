/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * =============================================================================================== CHANGE CODE AUTHOR
 * DESCRIPTION DATE JQTBS01 ArunKumar Sekar Creating initial List View 01-02-2015
 * ===============================================================================================
 */
/*
 * TODO : Global Date Filter validation TODO : Equalant Currency, Action Buttons, Checkbox TODO : Date and amount
 * alignment from configuration ISSUE : TR inside div, need to fix gopal ISSUE: On hiding first column, search tags
 * getting hide
 */
cbx.ns("canvas.lib");
/**
 * @className : canvas.lib.listRenderer
 * @description: This class is responsible to render LIST view. <BR>
 *               This does the following three tasks : <BR>
 *               1) Prepares template and template parameters .<BR>
 *               2) Grid header, pagination and Filter actions.<BR>
 *               3) Row value data type preparations.
 */
canvas.lib.listRenderer = Class({

    tmplParams: {},
    tmplObj: null,
    dirClass: "flaticon-up-down-arrow2",
    filters: null,
    actionParams: {},
    filterClass: null,
    /**
     * Class constructor, prepares all parameters Singleton constructor
     * 
     * @config: Widget and View metadata
     */
    constructor: function(config) {
        this.ptScope = config.scope;
        this.tagConfig = [];
        this.colFilters = [];
        this.colFiltersForWidgetPanelPrint = {};
        this.headerData = config.scope.listViewMD.FLD_COLUMN_LIST;
        this.headerCount = config.scope.listViewMD.FLD_COLUMN_LIST.length;
        this.widgetID = config.scope.widgetID;
        this.workspaceID = config.scope.workspaceID;
        this.bundleKey = config.scope.listViewMD.FLD_BUNDLE_KEY;
        this.dateTo = canvas.datePreferences.getParsedDateFormat();
        this.datePrefFormat = canvas.datePreferences.getParsedDateFormat();
        this.perPage = config.scope.getPerPage();
        this.parentCont = this.ptScope.elem;
        this.dateFormat = "dd/mm/yyyy";
        this.dateFrom = "d/m/Y";
        this.pageVisible = 5;
        this.validateFlag = true;
        this.columnValue = {};
        this.scrollField = true;
        this.initColHeaders();

        /* Singleton Instance */
        this.actionParams = this.setDefaultAddParams();
        // this.tmplObj = this.ptScope.tpl;
        /* Initiate context class */
        this.context = new canvas.lib.listContext({
            "contextMenu": this.ptScope.md.md.CONTEXT_MENU_LIST,
            "viewMD": this.ptScope.listViewMD,
            "parent": this.ptScope
        });

        var id;

        var that = this;
        $(window).on("resize", function() {
            clearTimeout(id);
            id = setTimeout(function() {
                var scrollDetected = false,
                    scrollDisabled = false;
                var grid = that.parentCont.find(".table-responsive");
                if (grid.hasScrollBar().horizontal) {
                    if (scrollDetected == false && that.compactView != true) {
                        LOGGER.log("Scrollbar enabled");
                        that.config.compactView = true;
                        that.initalizeRenderer(that.config)
                        scrollDetected = true;
                        scrollDisabled = false;
                    }
                } else {
                    if (scrollDisabled == false && that.compactView != false) {
                        LOGGER.log("Scrollbar not exists");
                        that.config.compactView = false;
                        that.initalizeRenderer(that.config);
                        scrollDisabled = true;
                        scrollDetected = false;
                    }
                }
            }, 500);
        });

        for (var i = 0; i < this.headerCount; i++) {
            if (this.headerData[i].FLD_SORT_POSITION == "1") {
                flag = true;
                this.actionParams.colID = this.headerData[i].FLD_COLUMN_ID;
                if (this.headerData[i].FLD_SORT_ORDER == "ASC") {
                    this.actionParams.sortDir = "ASC";
                    this.actionParams.sortClass = "flaticon-up-arrow"; // JQTBS#SORT Class changed from
                    // ct-app__tools-sort-asc to ct-app__tools-asc
                } else {
                    this.actionParams.sortDir = "DESC";
                    this.actionParams.sortClass = "flaticon-down-arrow"; // JQTBS#SORT Class changed from
                    // ct-app__tools-sort-desc to
                    // ct-app__tools-desc
                }
            }
        }

    },

    /**
     * Another constructor, that will re-paint business data and aruguments accordingly
     * 
     * @config: Business data
     */
    initalizeRenderer: function(config) {
        this.headerArray = [];
        this.config = config;
        this.sorting = config.sorting;
        this.tmplOpts = {};
        this.saveAsColFilters = [];
        this.compactView = config.compactView || false;
        this.colFiltersForWidgetPanelPrint = [];
        this.records = config.md.response.value.ALL_RECORDS;
        this.additionalData = config.md.response.value.ADDITIONAL_DATA;
        this.modifiedRecords = config.md.response.value.ADDITIONAL_DATA.MODIFIED_COLUMN_NAMES;
        this.recordsCount = parseInt(config.md.response.value.TOTAL_COUNT);
        this.pages = Math.ceil(this.recordsCount / this.perPage);
        this.recordsLength = this.records.length;
        this.utility = new canvas.lib.listUtility({
            config: this
        });
        // this.utility.doHandlerBarsHelpers();
        if (!this.filterClass)
            this.filterClass = new canvas.lib.listFilters({
                "scope": this
            });
        if (this.ptScope.listViewMD.FLD_SELECTION_TYPE == "ROWMULTI" || this.ptScope.listViewMD.FLD_SELECTION_TYPE == "MULTIPLE") {
            this.setParams("ROWSELECTION", "true");
        } else
            delete this.tmplOpts.ROWSELECTION;
        if (this.pages > 0) {
            this.setParams("previousPage", this.getParamValue("previousPage"));
            this.setParams("nextPage", this.getParamValue("nextPage"));
        }
        // this.mapParent();
        this.renderListApp();
    },

    /**
     * removes all filter applied to list
     */
    removeFilters: function() {
        delete this.tmplOpts.FILTERS;
        this.filterClass.removeAllFilters();
    },

    setParams: function(key, value) {
        this.tmplOpts[key] = value;
    },

    /**
     * Updating additional parameter registry like, paging, sorting, filtered column, etc.,
     * 
     * @key: registry key
     * @value: value to be update
     * @registerTmpl(Bool): if true, it will register the same param for template,
     */
    updateAddParams: function(key, value, registerTmpl) {
        if (this.actionParams.hasOwnProperty(key)) {
            this.actionParams[key] = value;
            if (registerTmpl) {
                this.setParams(key, value);
            }
        }
    },

    /**
     * get induvidual parameter from additional params registry
     * 
     * @key: registry key
     */
    getParamValue: function(key) {
        return this.actionParams[key];
    },

    getModifiedHeaderValue: function(modifiedHeaderKey) {
        for (key in this.modifiedRecords) {
            if (key == modifiedHeaderKey) {
                return this.modifiedRecords[key];
            }
        }
        return false;
    },
    /**
     * Responsible to render Grid header
     */
    getListHead: function() {
        if (this.ptScope.md.md.VIEW_MD.FLD_GROUP_HEADER_REQD == "Y")
            this.setParams("groupHeaderInd", true);
        var headerLen = this.headerCount;
        var tempArray = $.extend(true, [], this.headerData);
        var sortedArray = tempArray.sort(function(a, b) {
            return a.FLD_PRIORITY - b.FLD_PRIORITY;
        });
        var prev = 0,
            highestPriority = 0,
            prevPriority = 0;
        for (var i = 0; i < sortedArray.length; i++) {
            if (prevPriority == parseInt(sortedArray[i].FLD_PRIORITY)) {
                sortedArray[i].FLD_PRIORITY = prev;
            } else if ((sortedArray[i].FLD_PRIORITY == "") || cbx.isEmpty(sortedArray[i].FLD_PRIORITY)) {
                sortedArray[i].FLD_PRIORITY = "";
            } else {
                prevPriority = parseInt(sortedArray[i].FLD_PRIORITY);
                sortedArray[i].FLD_PRIORITY = parseInt(prev) + 1;
                prev = sortedArray[i].FLD_PRIORITY;
            }
            if (highestPriority < prev) {
                highestPriority = prev;
            }
        }

        for (var i = 0; i < this.headerData.length; i++) {
            for (var j = 0; j < sortedArray.length; j++) {
                if (this.headerData[i].FLD_COLUMN_ID == sortedArray[j].FLD_COLUMN_ID) {
                    if ((sortedArray[j].FLD_PRIORITY == "") || cbx.isEmpty(sortedArray[j].FLD_PRIORITY)) {
                        this.headerData[i].FLD_PRIORITY = highestPriority + 1;
                    } else {
                        this.headerData[i].FLD_PRIORITY = sortedArray[j].FLD_PRIORITY;
                    }

                }
            }
        }

        /*
         * if(this.ptScope.listViewMD.FLD_VIEW_TYPE == "GROUP"){ headerLen = headerLen -1;
         * if(this.ptScope.listViewMD.FLD_SELECTION_TYPE == "ROWSINGLE" || this.ptScope.listViewMD.FLD_SELECTION_TYPE ==
         * "ROWMULTI" || this.ptScope.listViewMD.FLD_SELECTION_TYPE == "SINGLE" ||
         * this.ptScope.listViewMD.FLD_SELECTION_TYPE == "MULTIPLE") { headerLen = headerLen +1; } }
         */

        if (headerLen > 0) {
            for (var i = 0; i < headerLen; i++) {

                if (this.headerData[i].FLD_HIDDEN_IND == "Y") {
                    this.hiddenInd++;
                    continue;
                }
                if (this.ptScope.listViewMD.FLD_CONTEXT_COLUMN == "N" && this.headerData[i].FLD_COLUMN_ID == "CONTEXT")
                    continue;
                var cssClass = this.utility.columnPriority(parseInt(this.headerData[i].FLD_PRIORITY));
                cssClass = this.headerData[i].FLD_DATA_TYPE == "float" ? cssClass + " text-right" : cssClass;
                var listData = iportal.jsutil.getTextFromBundle(this.bundleKey, "LBL_" + this.headerData[i].FLD_COLUMN_DISPLAY_NAME_KEY);
                if (listData.search('LBL_') == 0) {
                    listData = listData.split(/_(.+)?/)[1];
                }
                var modified = this.getModifiedHeaderValue(this.headerData[i].FLD_COLUMN_ID);

                if (modified)
                    listData = modified;
                var colObj = {
                    "COL_ID": this.headerData[i].FLD_COLUMN_ID,
                    "VISIBLE_IND": this.headerData[i].FLD_VISIBLE_IND,
                    "LIST_DATA": $.trim(listData),
                    "DATA_TYPE": this.headerData[i].FLD_DATA_TYPE,
                    "FLD_APPEND_CURRENCY_MODE": this.headerData[i].FLD_APPEND_CURRENCY_MODE,
                    "LINKED_SOURCE_CCY": this.headerData[i].LINKED_SOURCE_CCY,
                    "TH_INDEX": i,
                    "FLD_PRIORITY": this.headerData[i].FLD_PRIORITY,
                    "DRILLDOWN_IND": this.headerData[i].FLD_DD_REQ_IND,
                    "cssClass": cssClass,
                    "VISI_IND": this.headerData[i].FLD_VISIBLE_IND == "Y" ? true : false,
                    "FLD_COL_ORDER_IND":this.ptScope.listViewMD.FLD_COL_ORDER_IND== "Y" ? true :false	//Column_ordering for classic Grid by chandrakala
                };

                if (this.headerData[i].FLD_PARENT_COLUMN_ID.length > 0)
                    colObj["PARENT_ID"] = this.headerData[i].FLD_PARENT_COLUMN_ID;
                var key = colObj.COL_ID;
                for (var k = 0; k < this.headerArrayContent.length; k++) {
                    if (key == this.headerArrayContent[k]._id) {
                        colIndex = k;
                        break;
                    }
                }
                if (this.headerData[i].FLD_VISIBLE_IND == "N" || this.headerArrayContent[colIndex]._hidden == "Y") {
                    colObj.HIDDEN = "true";
                    colObj.cssClass += " hidden";
                    this.headerArrayContent[colIndex]._hidden == "Y";
                }
                if (this.headerData[i].FLD_COLUMN_ID == "CONTEXT")
                    colObj.FILTER_ENABLED = false;
                colObj.showHideMenu = true;
                if (this.ptScope.listViewMD.FLD_COL_ORDER_IND == "Y" && this.ptScope.listViewMD.FLD_VIEW_TYPE != "GROUP")
                    colObj.COLUMNORDER = "true";
                if (this.headerData[i].FLD_GROUPABLE_IND == "Y" && this.ptScope.listViewMD.FLD_IS_GROUP_MODIFIABLE == "Y" && this.ptScope.listViewMD.FLD_VIEW_TYPE == "GROUP")
                    colObj.GROUPABLE = "true";
                if (this.headerData[i].FLD_MANDATORY_IND == "Y")
                    colObj.MANDATORY = "true";
                /*
                 * Sortable and Filter not applicable for context column
                 */
                if (this.headerData[i].FLD_COLUMN_ID != "CONTEXT" && (this.headerData[i].FLD_IS_DISABLED == "N" || this.headerData[i].FLD_IS_DISABLED == "")) {
                    if (this.headerData[i].FLD_SORTABLE_IND == "Y" && this.headerData[i].FLD_DATA_TYPE != 'translatedvalue')
                        colObj.SORTABLE = "true";
                    if (this.ptScope.listViewMD.FLD_FILTER_IND == "Y") {
                        if (this.headerData[i].FLD_FILTER_ENABLE_IND == "Y" && this.headerData[i].FLD_DATA_TYPE != 'translatedvalue') {
                            colObj.FILTER_ENABLED = true;
                            this.filterClass.setXType(this.headerData[i].FLD_DATA_TYPE);
                            var submenu = this.filterClass.getSearchTypes();
                            if (submenu.length > 1) {
                                colObj.SUBMENU = submenu;
                            }
                        } else {
                            colObj.FILTER_ENABLED = false;
                        }
                        this.setParams("FILTER_IND", true);
                    } else {
                        this.setParams("FILTER_IND", false);
                    }
                }
                var showhide_ind = this.ptScope.listViewMD.FLD_VIEW_TYPE != "PROPERTY" ? true : false;
                this.setParams("SHOWHIDE_IND", showhide_ind);

                this.setParams("FLD_COL_ORDER_IND", this.ptScope.listViewMD.FLD_COL_ORDER_IND == "Y")
                colObj.tooTipforColOrder = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_COLUMNS_ORDER");
                colObj.toolTipforGroupable = iportal.jsutil
                    .getTextFromBundle(CRB.getFWBundleKey(), "TOOLTIP_GROUPABLE");
                this.setParams("toolTipforShowHide", iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "TOOLTIP_SHOWHIDE"));
                this.setParams("toolTipforFilter", iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "TOOLTIP_FILTER"));
                this.setParams("toolTipforClearFilter", iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "TOOLTIP_CLEAR_FILTER"));
                this.setParams("toolTipforSorting", iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_SORT_BY"));

                this.headerArray.push(colObj);
            }
        }
        var colLen = headerLen;
        if (this.ptScope.listViewMD.FLD_VIEW_TYPE == "GROUP") {
            colLen = headerLen - 1;
            if (this.ptScope.listViewMD.FLD_SELECTION_TYPE == "ROWSINGLE" || this.ptScope.listViewMD.FLD_SELECTION_TYPE == "ROWMULTI" || this.ptScope.listViewMD.FLD_SELECTION_TYPE == "SINGLE" || this.ptScope.listViewMD.FLD_SELECTION_TYPE == "MULTIPLE") {
                colLen = headerLen + 1;
            }
        }
        if (this.ptScope.listViewMD.FLD_CONTEXT_ACTION_IND == "Y" || this.ptScope.listViewMD.FLD_DETAIL_ACTION_IND == "Y") {
            colLen = colLen + 2;
            this.setParams("CONTEXT_COLUMN", iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_ACTION"));
        }
        this.setParams("colLen", colLen);
        this.setParams("headerCols", this.headerArray);
    },

    /**
     * Responsible to render Grid footer and pagination
     */
    getListFoot: function() {
        if (this.ptScope.listViewMD.FLD_TOTAL_RESULT_IND == "Y")
            this.setParams("pagingRecords", {
                "displaying": CRB.getFWBundle()["DISPLAYING"],
                "of": CRB.getFWBundle()["OF"],
                "from": parseInt(this.getParamValue("start") + 1),
                "to": (this.perPage * this.getParamValue("currentPage") > this.recordsCount ? this.recordsCount : (this.perPage * this.getParamValue("currentPage"))),
                "total": this.recordsCount
            });
        // Enable Pagination
        if (this.perPage < this.recordsCount) {
            this.setParams("totalPages", this.pages);
            this.setParams("pagination", this.utility.getPages(this.getParamValue("currentPage")));
            this.updateAddParams("currentPage", this.getParamValue("currentPage"), true);
        } else {
            if (this.tmplOpts.hasOwnProperty("pagination"))
                delete this.tmplOpts.pagination;
        }
    },

    /**
     * additional parameter registry with default values
     */
    setDefaultAddParams: function() {
        return {
            "sortDir": "",
            "sortClass": "",
            "colID": "ALL",
            "currentPage": 1,
            "previousPage": 1,
            "nextPage": 2,
            "start": 0,
            "limit": this.perPage
        };

    },

    /**
     * Responsible to render searched or filtered column title as tags
     */
    searchTags: function() {
        var allFilters = this.filterClass.getFilters(this.ptScope.md.getViewFilters());
        var tags = [],
            label_val;
        if (allFilters.length > 0) {
            for (var i = 0; i < allFilters.length; i++) {
                for (key in allFilters[i]) {
                    if (allFilters[i].hasOwnProperty(key)) {
                        if (this.columnValue[key]) {
                            if (this.columnValue[key].length > 1) {
                                label_val = this.columnValue[key][0].value + " - " + this.columnValue[key][1].value;
                            } else {
                                label_val = allFilters[i][key]._CONSTRAINT + " " + this.columnValue[key][0].value;
                            }
                        } else if (allFilters[i][key]._CONSTRAINT == "dtEquals" || allFilters[i][key]._CONSTRAINT == "lt" || allFilters[i][key]._CONSTRAINT == "gt") {
                            label_val = allFilters[i][key]._CONSTRAINT + " " + allFilters[i][key]._VALUE_DATE;
                        } else if (allFilters[i][key]._CONSTRAINT == "LAST_N_DAY" || allFilters[i][key]._CONSTRAINT == "LAST_N_MONTH") {

                            label_val = allFilters[i][key]._CONSTRAINT + " " + allFilters[i][key]._VALUE_PERIOD;
                        } else if (allFilters[i][key]._CONSTRAINT == 'PREVIOUS_MONTH') {

                            label_val = allFilters[i][key]._CONSTRAINT;
                        } else if (allFilters[i][key]._CONSTRAINT == 'range') {

                            label_val = allFilters[i][key]._VALUE_DATE + " - " + allFilters[i][key]._VALUE_DATE2;
                        } else {
                            label_val = allFilters[i][key]._CONSTRAINT + " " + allFilters[i][key]._VALUE_TXT;
                        }
                        tags.push({
                            "label": this.headerArray[this.headerArray.map(function(e) {
                                return e.COL_ID;
                            }).indexOf(key)].LIST_DATA,
                            "value": label_val,
                            "ID": key,
                            "cfg": this.tagConfig[i]
                        });
                    }
                }
            }
            this.setParams("FILTERS", tags);
            this.setParams("labelFilterBy", iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_SEARCH_BY"));
        }
    },

    /**
     * Responsible to render GRID rows with business data
     * 
     * @data: Business data (can be override at any point in time)
     */
    getListRecords: function(data) {
        var rows = [];
        var that = this;
        var colIndex;
        var viewList = this.ptScope.md.md.VIEWS_LIST;
        var currView = viewList.filter(function(data, index) {
            return data.VIEW_ID == that.ptScope.listViewMD.VIEW_ID;
        });

        this.records = data || this.records;
        if (this.tmplOpts.hasOwnProperty("NODATA"))
            delete this.tmplOpts.NODATA;
        var headerLen = this.headerArray.length;
        if (this.records && this.records.length > 0) {
            for (var li = 0; li < this.perPage; li++) {
                var record = this.records[li];
                if (record) {
                    var obj = [];
                    for (var h = 0; h < headerLen; h++) {
                        var value = '';
                        var key = this.headerArray[h].COL_ID;
                        for (var k = 0; k < this.headerArrayContent.length; k++) {
                            if (key == this.headerArrayContent[k]._id) {
                                colIndex = k;
                                break;
                            }
                        }
                        var cssClass = this.utility.columnPriority(parseInt(this.headerArray[h].FLD_PRIORITY));
                        if (this.headerArray[h].VISIBLE_IND == "N" || this.headerArrayContent[colIndex]._hidden == "Y")
                            cssClass += " hidden";
                        if (this.headerArray[h].DATA_TYPE == "amount" || this.headerArray[h].DATA_TYPE == "float")
                            cssClass = cssClass + " text-right";
                        if (record.HIGHTLIGHT) {
                            cssClass += " " + record.HIGHTLIGHT;
                        }
                        var params = {
                            "cssClass": cssClass,
                            "key": key + "|" + li,
                            "colKey": this.utility.getTextByColumnID(key),
                            "rowIndex": li
                        };
                        if (key == "CONTEXT" && this.ptScope.listViewMD.FLD_CONTEXT_COLUMN == "Y") {
                            value = "CONTEXT-ICON";
                            params.enableContext = this.ptScope.md.md.CONTEXT_MENU_LIST[0].context_type;
                        } else {
                            this.headerArray[h].additionalData = this.additionalData;
                            value = this.utility.validateRowData(this.headerArray[h].DATA_TYPE, record[key],
                                this.headerArray[h], record);
                        }
                        params.rowValue = value;
                        obj.push(params);
                    }
                    rows.push(obj);
                }
            }
            this.setParams("rows", rows);
        } else if (this.additionalData.hasOwnProperty("ENTL_ERROR") || currView.IS_ENTITLED == "N") {
            var nodata_key = this.ptScope.listViewMD.SYSTEM_VIEW_ID + "_NOT_ENTITLED_WIDGET";
            var text = CRB.getBundleValue(this.bundleKey, nodata_key);
            if (cbx.isEmpty(text)) {
                text = CRB.getFWBundleValue("NOT_ENTITLED_WIDGET");
            }
            this.setParams("NODATA", text);
        } else {
            var nodata_key = this.ptScope.listViewMD.SYSTEM_VIEW_ID + "_NO_DATA_MSG";
            var text = CRB.getBundleValue(this.bundleKey, nodata_key);
            if (cbx.isEmpty(text)) {
                text = CRB.getFWBundleValue("NO_DATA_MSG");
            }
            this.setParams("NODATA", text);
        }
    },

    /**
     * responsible to return specific portion from template
     * 
     * @key: registry key
     */
    getGridTemplate: function() {

        if (!this.compactView)
            return this.getTmplFromGroup("listview_table").html();
        else
            return this.getTmplFromGroup("listview_mobile_table").html();
    },

    /**
     * Responsible to get the header for property grid
     */

    getPropertyGridHeader: function() {
        var particulars = CRB.getBundleValue(this.bundleKey, "LBL_PARTICULARS");
        if (cbx.isEmpty(particulars)) {
            particulars = CRB.getFWBundleValue("LBL_PARTICULARS") || "PARTICULARS";
        }
        this.headerArray[0] = {
            "COL_ID": "PARTICULARS",
            "LIST_DATA": $.trim(particulars),
            "TH_INDEX": 0,
            "FILTER_ENABLED": "Y"
        };
        var values = CRB.getBundleValue(this.bundleKey, "LBL_VALUE");
        if (cbx.isEmpty(values)) {
            values = CRB.getFWBundleValue("LBL_VALUE") || "VALUE";
        };
        this.headerArray[1] = {
            "COL_ID": "VALUE",
            "LIST_DATA": $.trim(values),
            "TH_INDEX": 1
        };
        this.setParams("colLen", this.headerArray.length);
        this.setParams("headerCols", this.headerArray);
        if (this.ptScope.listViewMD.FLD_FILTER_IND == "Y") {
            this.setParams("FILTER_IND", true);
        } else {
            this.setParams("FILTER_IND", false);
        }
        this.setParams("SHOWHIDE_IND", false);
    },

    /**
     * Get all business data for property grid
     */
    getPropertyGridListRecords: function(data) {
        var rows = [];
        this.records = data || this.records;
        if (this.tmplOpts.hasOwnProperty("NODATA"))
            delete this.tmplOpts.NODATA;
        var headerLen = this.headerArray.length;
        if (this.records && this.records.length > 0) {
            for (var li = 0; li < this.records.length; li++) {
                var record = this.records[li];
                if (record) {
                    var obj = [],
                        cssClass = "";
                    for (var h = 0; h < headerLen; h++) {
                        var key = this.headerArray[h].COL_ID;
                        if (this.headerArray[h].VISIBLE_IND == "N")
                            cssClass += " hidden";
                        var value = record[key];
                        if (key == "VALUE") {
                            cssClass = cssClass + "";
                            var addParams = {
                                "FLD_APPEND_CURRENCY_MODE": this.utility.getDataTypeByColID(record["PARTICULARS"],
                                    this.headerData, "FLD_APPEND_CURRENCY_MODE"),
                                "LINKED_SOURCE_CCY": this.utility.getDataTypeByColID(record["PARTICULARS"],
                                    this.headerData, "LINKED_SOURCE_CCY"),
                                "additionalData": this.additionalData
                            };
                            value = this.utility.validateRowData(this.utility.getDataTypeByColID(record["PARTICULARS"],
                                this.headerData, "FLD_DATA_TYPE"), record[key], addParams, record);
                        } else {
                            value = iportal.jsutil.getTextFromBundle(this.bundleKey, "LBL_" + value);
                        }
                        var colKey = this.headerArray[this.headerArray.map(function(e) {
                            return e.COL_ID;
                        }).indexOf(key)].LIST_DATA;
                        var params = {
                            "cssClass": cssClass,
                            "key": key + "|" + li,
                            "colKey": colKey,
                            "rowIndex": li
                        };
                        params.rowValue = value;
                        obj.push(params);
                    }
                    rows.push(obj);
                }
            }
            this.setParams("rows", rows);
        } else {
            var nodata_key = this.ptScope.listViewMD.SYSTEM_VIEW_ID + "_NO_DATA_MSG";
            var text = CRB.getBundleValue(this.bundleKey, nodata_key);
            if (cbx.isEmpty(text)) {
                text = CRB.getFWBundleValue("NO_DATA_MSG");
            }
            this.setParams("NODATA", text);
        }
    },
    compactViewValidationOnload: function() {
        var scrollDetected = false,
            scrollDisabled = false;
        var grid = this.parentCont.find(".table-responsive");
        if (grid.hasScrollBar().horizontal) {
            if (scrollDetected == false && this.compactView != true) {
                LOGGER.log("Scrollbar enabled");
                this.config.compactView = true;
                this.initalizeRenderer(this.config)
                scrollDetected = true;
                scrollDisabled = false;
                this.scrollField = false;
            }
        }
    },
    saveAsFilters: function() {
        var allFilters = this.filterClass.getFilters();

        for (var i = 0; i < allFilters.length; i++) {
            for (var key in allFilters[i]) {
                var obj = {};
                for (var k in allFilters[i][key]) {
                    var constraint = allFilters[i][key]['_CONSTRAINT'];
                    if (constraint == 'dtEquals' || constraint == 'range' || constraint == 'lt' || constraint == 'gt' || constraint == 'PREVIOUS_MONTH' || constraint == "LAST_N_DAY" || constraint == "LAST_N_MONTH") {
                        if (k != '_VALUE_TIME' && k != '_VALUE_TIME2') {
                            obj[k.toLowerCase()] = allFilters[i][key][k];
                        }
                    } else {
                        obj[k.toLowerCase()] = allFilters[i][key][k];
                    }

                }
                this.saveAsColFilters.push(obj);
            }
        }
    },
    updateListAppCellValue: function(colName, rowIndex, value) {

        var tdele = this.parentCont.find("[data-grid-rowIndex='" + rowIndex + "'] [data-item-data='" + colName + "|" + rowIndex + "']");

        var data = this.eventHandler;

        data.initialize(tdele);
        var colID = data.getColID();
        var colValue = data.getColValue();
        var rowData = data.getRow();

        colValue = value;
        rowData[colID] = colValue;
        this.ptScope.modifiedData.push(rowData);

        this.ptScope.viewConf.raiseEvent(CWEC.DATA_MOD, colID, colValue, this.ptScope.modifiedData);

        var headerLen = this.headerArray.length;
        var colMetadata;

        for (var h = 0; h < headerLen; h++) {
            if (this.headerArray[h].COL_ID == colID) {
                colMetadata = this.headerArray[h];
                break;
            }
        }

        if (colMetadata) {
            this.utility.updateCellValue(tdele, colMetadata, rowIndex, colID, value);
        }
    },
    /**
     * Method that will called from constructor, its collects all method in sync manner
     */
    renderListApp: function() {
        this.utility.doHandlerBarsHelpers(this);
        if (this.ptScope.listViewMD.FLD_VIEW_TYPE == "PROPERTY") {
            this.getPropertyGridHeader();
            this.getPropertyGridListRecords();
        } else {
            this.getListHead();
            this.searchTags();
            this.getListRecords();
            this.getListFoot();
        }
        var templateUrl = this.compactView ? "listViewMobile.cttpl" : "listViewTemplate.cttpl";
        var tpl = new ct.lib.tmplLayer(templateUrl, this.tmplOpts);
        tpl.getTemplate(this.applyTemplate, this);
    },

    applyFilterTemplateIfPropertyGrid: function(opts) {
        this.opts = opts;
        var that = this;
        var filterParams = that.filterClass.getTemplateParams("contains");
        filterParams["btnCancel"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_CANCEL");
        filterParams["field_Name"] = that.headerArray[that.headerArray.map(function(e) {
            return e.COL_ID;
        }).indexOf(opts.column)].LIST_DATA;
        var tpl = new ct.lib.tmplLayer(that.filterClass.getTmplObject("string"), filterParams)
        tpl.getTemplate(function(template) {
            that.parentCont.find("[data-filter-form]").html(template);
            var container = that.parentCont.find("[data-filterformcontainer]");
            container.find("[data-action=\"submit\"]").hide();
            if (!container.is(":visible")) {
                container.show("0", function() {
                    that.parentCont.find("[data-filterformcontainer] input").focus();
                });
            } else {
                that.parentCont.find("[data-filterformcontainer] input").focus();
            }
            container.find("input#stringContains").keydown(function(e) {
                if (e.which == 13)
                    return false;
            }).keyup(function(e) {
                if ('' != this.value) {
                    var reg = new RegExp(that.escapeRegExp(this.value), 'i'); // case-insesitive
                    // $(this).parents("table").find('tbody tr[data-grid-records]').each(function() {
                    that.parentCont.find('[data-grid-records] td').filter(function() {
                        if ($(this).data('item-data').split('|')[0] == that.opts.column)
                            return true;
                        else
                            return false;
                    }).each(function() {
                        var $me = $(this);
                        if (!$me.text().match(reg)) {
                            $me.parent().hide();
                        } else {
                            $me.parent().show();
                        }
                    });
                } else {
                    that.parentCont.find('[data-grid-records]').show();
                }
            });
            container.find("[data-action=\"cancel\"]").on("click", function(evt) {
                evt.preventDefault();
                container.find("input#stringContains").val('');
                that.parentCont.find('[data-grid-records]').show();
                that.parentCont.find("[data-filterformcontainer]").hide();
            });
        }, that);

    },
    applyFilterTemplate: function(template) {
        var that = this;
        this.parentCont.find("[data-filter-form]").html(template);
        var container = this.parentCont.find("[data-filterformcontainer]");
        if (this.opts.xType == "float" || this.opts.xType == "string") {
            if (!container.is(":visible")) {
                container.show("0", function() {
                    that.parentCont.find("[data-filterformcontainer] input").focus();
                });
            } else {
                container.hide();
                container.show("0", function() {
                    that.parentCont.find("[data-filterformcontainer] input").focus();
                });
            }
        } else {
            if (!container.is(":visible")) {
                container.show();
            }
        }
        var datePickers = this.parentCont.find("[data-enableCalender='true']");
        /*if (this.datePrefFormat.search('YY') > -1)
			this.datePrefFormat = that.datePrefFormat.replace("YY", "yyyy");
		else if (this.datePrefFormat.search('Y') > -1)
			this.datePrefFormat = this.datePrefFormat.replace("Y", "yy");
*/
        if (datePickers.length > 0) {
            datePickers.datetimepicker({
                format: that.datePrefFormat.toUpperCase()
            });
        }
        this.filterFormActions(this.opts);
    },
    applyTemplate: function(template) {
        this.parentCont.html(template);
        this.bindHandlers();
        this.parentCont.find("[data-attr=\"listColumnsDrag\"][data-colorder='true']").canvasColumnSortable();
        if (this.ptScope.listViewMD.FLD_CONTEXT_ACTION_IND != "Y") {
            this.parentCont.find("[data-item-id=ct-contextaction-fld]").addClass("ct-action-disabled");
        } else if (this.ptScope.listViewMD.FLD_DETAIL_ACTION_IND != "Y") {
            this.parentCont.find("[data-item-id=ct-detailaction-fld]").addClass("ct-action-disabled");
        }
        this.compactViewValidationOnload();
        this.createSortInfo();
        this.saveAsFilters();
        $('[data-toggle="tooltip"]').tooltip();
        CTLOADMASKMANAGER.hideLoadMask(this.parentCont, this.parentCont);
        this.ptScope.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, {
            elem: template
        });
    },
    bindHandlers: function() {
        /**
         * Default events, invoked by end user
         */
        this.defaultEventHandler();
        /**
         * Module Selection Handlers, invoked by business developers
         */
        var config = {
            scope: this.ptScope,
            header: this.headerArray,
            MD: this.records
        };
        this.eventHandler = new canvas.lib.listEventHandlers(config).getEventHelper();

        /**
         * Attach Context Action Handlers, invoked by business developers
         */

        this.context.attachContextEventHandlers(this.eventHandler);
    },

    /**
     * Preparing all parameters for ajax call
     */
    prepareParams: function() {
        var param = {};
        var obj = {
            INPUT_ACTION: "INIT_DATA_ACTION",
            INPUT_FUNCTION_CODE: this.ptScope.listViewMD.FUNCTION_CODE,
            INPUT_SUB_PRODUCT: this.ptScope.listViewMD.SUB_PRODUCT_CODE,
            PAGE_CODE_TYPE: "VDF_CODE",
            PRODUCT_NAME: this.ptScope.listViewMD.PRODUCT_CODE,
            VIEW_ID: this.ptScope.listViewMD.VIEW_ID,
            WIDGET_ID: this.ptScope.widgetID,
            WORKSPACE_ID: this.ptScope.workspaceID,
            __LISTVIEW_REQUEST: "Y",
            forceCallbacks: "true"
        };
        var extraparams = this.ptScope.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, obj)[0];
        if (!cbx.isEmpty(extraparams)) {
            cbx.apply(obj, extraparams);
        }

        obj.dir = this.actionParams.sortDir;
        obj.sort = this.actionParams.colID;
        obj.limit = this.actionParams.limit;
        obj.start = this.actionParams.start;

        if (this.filterClass) {
            var filterParams = this.filterClass.mergeFilterParams();
            if (filterParams.COLUMN_COUNT != 0) {
                var obj = $.extend({}, obj, filterParams);
            }
        }
        return obj;
    },

    createSortInfo: function() {
        var returnParamsObj = this.prepareParams();
        this.sortInfo = {};
        this.sortInfo["field"] = returnParamsObj.sort;
        this.sortInfo["direction"] = returnParamsObj.dir;
        this.sortInfo["position"] = 1;
    },
    /**
     * Thows error message if value does not satisfy validation criteria for filter inputs
     */
    setInvalidList: function(opts) {
        if (opts.xType == "date" && opts.searchType == "between") {
            this.parentCont.find("[data-item-id=datepicker]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "last-n-days") {
            this.parentCont.find("[data-item-id=dateOnError]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "last-n-months") {
            this.parentCont.find("[data-item-id=dateOnError]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "float" && opts.searchType == "equals" || opts.searchType == "lesser" || opts.searchType == "greater") {
            this.parentCont.find("[data-item-id=submenuError]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_AMOUNT"));
        } else if (opts.xType == "string") {
            this.parentCont.find("[data-item-id=listStringValidate]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_FIELD"));
        } else if (opts.xType == "date" && opts.searchType == "on") {
            this.parentCont.find("[data-item-id=dateOnError]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "before") {
            this.parentCont.find("[data-item-id=dateOnError]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "after") {
            this.parentCont.find("[data-item-id=dateOnError]").addClass('has-error');
            this.parentCont.find("[data-item-id=errorMsgListForm]").removeClass('hidden').addClass('show')
                .tooltip();
            this.parentCont.find("[data-item-id=errorMsgListForm]").attr('data-original-title',
                iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        }
    },
    /**
     * Initialize column headers for show/hide and exporting columns
     */
    initColHeaders: function() {
        this.dupHeaderArrayContent = [];
        this.headerArrayContent = [];
        for (var i = 0; i < this.headerCount; i++) {
            var headerObj = {};
            headerObj._id = this.headerData[i].FLD_COLUMN_ID;

            if (this.headerData[i].FLD_VISIBLE_IND == 'N') {
                headerObj._hidden = 'Y';
            } else {
                headerObj._hidden = 'N';
            }

            headerObj._dataindex = this.headerData[i].FLD_COLUMN_ID;
            headerObj._position = this.headerData[i].FLD_POSITION;
            this.headerArrayContent.push(headerObj);
        }
        this.dupHeaderArrayContent = $.extend(true, [], this.headerArrayContent);
    },
    /**
     * column properties for updating export columns and show/hide in group and list view.
     */
    colProperties: function(columnId, hiddenInd) {
        for (var j = 0; j < this.headerCount; j++) {
            if (this.headerArrayContent[j]._id == columnId) {
                if (hiddenInd == "Y") {
                    this.headerArrayContent[j]._hidden = "Y";
                } else {
                    this.headerArrayContent[j]._hidden = "N";
                }
                break;
            }
        }
    },
    /**
     * Updates show / hide column
     * 
     * @colID The column id to be updated
     * @colIndex position of the column
     * @_this scope
     */
    updateShowHideColumns: function(colID, colIndex, _this) {
        var li = _this.parents("li").find('a'),
            tblhead = $("th[data-column-linked='" + colID + "']", this.parentCont.find("table thead")),
            liParent = _this.parents("[data-column-id='" + colIndex + "']").find('a'),
            liCont = _this.parents("ul").find("li> a.flaticon-checked"),
            cssClass = this.utility.columnPriority(parseInt(this.headerData[colIndex].FLD_PRIORITY));
        tblbody = $("td[data-item-data^='" + colID + "']:not([data-column='paging-action'])", this.parentCont.find("tbody tr")).not(".ct-rowselection");
        var parentHeader = [];
        var array = this.parentCont.find("tr[data-item-header] th:first").nextUntil(tblhead);

        var dataParentId = this.parentCont.find("tr[data-item-header] th[data-column-linked=" + colID + "]").attr("data-parent-id");
        var dataHeader = this.parentCont.find("tr[data-item-group] th[data-header-id= " + dataParentId + "]:not(.hidden)");

        for (var i = 0; i < array.length; i++) {
            var parentId = $(array[i]).attr("data-parent-id");
            if (parentId && parentHeader.indexOf(parentId) == -1) {
                parentHeader.push(parentId);
            }
        }
        var dataParentIdLen = this.parentCont.find("[data-parent-id=" + dataParentId + "]:not(.hidden)").length;
        if (li.hasClass("flaticon-checked")) {
            if (liCont.length > 1) {
                // Hide Column
                tblhead.addClass("hidden " + cssClass);
                tblbody.filter(function() {
                    $(this).addClass("hidden " + cssClass);
                });
                liParent.removeClass("flaticon-checked");
                this.colProperties(colID, "Y");
            } else {
                var bundle = CRB.getBundle(CRB.getFWBundleKey());
                var lastColHideWarnMsg = new canvas.Dialog({
                    dialogType: 'ERROR',
                    message: bundle['LAST_COLUMN_HIDE_WARN'],
                    title: bundle['LBL_WARN']
                });
                lastColHideWarnMsg.show();
            }

        } else {
            // Show Column
            tblhead.removeClass("hidden").attr("class", tblhead.attr("class").replace(cssClass, ""));
            tblbody.filter(function() {
                $(this).removeClass("hidden");
                $(this).attr("class", $(this).attr("class").replace(cssClass, ""));
            });
            liParent.addClass("flaticon-checked");
            this.colProperties(colID, "N");

        }

    },
    /*
     * 
     */
    updatePosition: function() {
        var tdObj = this.parentCont.find("[data-column-linked]");
        var head = [];
        var arrayContent = [],
            headData_temp = $.extend(true, [], this.headerData);
        for (var i = 0; i < tdObj.length; i++) {
            var columnID = $(tdObj[i]).attr("data-column-linked");

            var obj = $.grep(this.headerData, function(data, index) {
                return data.FLD_COLUMN_ID == columnID;
            });
            var arrayObj = $.grep(this.headerArrayContent, function(data, index) {
                return data._id == columnID;
            });
            head.push(obj[0]);

            arrayObj[0]._position = i + 1;
            arrayContent.push(arrayObj[0]);

        }

        for (var i = 0; i < headData_temp.length; i++) {

            if (head.map(function(e) {
                    return e.FLD_COLUMN_ID;
                }).indexOf(headData_temp[i].FLD_COLUMN_ID) == -1) {
                head.push(headData_temp[i]);
            }
        }
        this.headerData = head;
        this.headerArrayContent = arrayContent;
        var arrayLength = this.headerArrayContent.length;
        for (var i = 0; i < this.dupHeaderArrayContent.length; i++) {

            if (this.headerArrayContent.map(function(e) {
                    return e._id;
                }).indexOf(this.dupHeaderArrayContent[i]._id) == -1) {
                this.tempHeader = {};
                this.tempHeader._id = this.dupHeaderArrayContent[i]._id;
                this.tempHeader._dataindex = this.dupHeaderArrayContent[i]._dataindex;
                this.tempHeader._position = arrayLength + i + 1;
                this.tempHeader._hidden = this.dupHeaderArrayContent[i]._hidden;
                this.headerArrayContent.push(this.tempHeader);
            }
        }
    },
    /**
     * escaping special characters in input field for filter
     */
    escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    /**
     * All events are binded in this method
     */
    defaultEventHandler: function() {
        var that = this;

        /**
         * Sub Menu click event handler
         */
        this.parentCont.find("[data-item-id=filter-submenu]")
            .on(
                "click",
                function(evt) {
                    var $this = $(this),
                        searchType = $this.data("submenu"),
                        xtype = $this
                        .data("xtype"),
                        columnID = $this.parents("li").data("colid");
                    if (that.compactView == true)
                        columnID = $this.parents("li").data("colid");
                    that.setParams(searchType, "true");

                    if (searchType == "previous-month") {
                        var formValue = iportal.jsutil.getSystemDate();
                        var cfg = {
                            "datatype": xtype,
                            "searchtype": searchType,
                            "column": columnID,
                            "formData": formValue
                        };
                        var opts = {
                            "xType": xtype,
                            "searchType": searchType,
                            "column": columnID
                        };
                        that.updateAddParams("start", 1, true);
                        that.updateAddParams("currentPage", 1, true);
                        that.tagConfig.push(opts);
                        var params = that.filterClass.getAjaxParams(cfg);
                        if (params) {
                            that.ptScope.doAjax(that.prepareParams(params));
                        }
                    } else if (searchType == "bool_true" || searchType == "bool_false") {
                        var cfg = {
                            "datatype": xtype,
                            "searchtype": searchType,
                            "column": columnID
                        };
                        var opts = {
                            "xType": xtype,
                            "searchType": searchType,
                            "column": columnID
                        };
                        that.tagConfig.push(opts);
                        var params = that.filterClass.getAjaxParams(cfg);
                        if (params) {
                            that.ptScope.doAjax(that.prepareParams(params));
                        }
                    } else {
                        var opts = {
                            "xType": xtype,
                            "searchType": searchType,
                            "column": columnID
                        };
                        that.renderFilterForm(opts);

                        /*var datePickers = that.parentCont.find("[data-enableCalender='true']");
                        if (that.datePrefFormat.search('YY') > -1)
                        	that.datePrefFormat = that.datePrefFormat.replace("YY", "YYYY");
                        else if (that.datePrefFormat.search('Y') > -1)
                        	that.datePrefFormat = that.datePrefFormat.replace("Y", "YY");

                        if (datePickers.length > 0)
                        {
                        	datePickers.datetimepicker({
                        		format : "DD/MM/YYYY"
                        	});
                        }
                        that.filterFormActions(opts);*/
                    }

                });
        this.parentCont.find("[data-action='sortformobile']").on("click", function(e) {
            var colindex = $(this).data("column-id");
            that.updateAddParams("colID", that.headerData[colindex].FLD_COLUMN_ID);
            var direction = "ASC";
            direction = (that.getParamValue("sortDir") == "ASC") ? "DESC" : direction;
            that.updateAddParams("sortClass", that.utility.getSortcClass(direction));
            that.updateAddParams("sortDir", direction);
            // position after column reordering and sorting
            that.scrollField = true;
            that.ptScope.doAjax(that.prepareParams());
        });

        /**
         * Asc/ Des
         */
        this.parentCont
            .find("[data-attr='listColumns'] [data-action='column-sorter']")
            .mousedown(
                function(evt) {
                    evt.stopImmediatePropagation();
                    evt.preventDefault();
                    var parent = $(this).parents("th"),
                        colindex = parseInt(parent.data("thindex")),
                        activePage = parseInt(that.parentCont
                            .find("tfoot ul li.active").find("[data-page]").data("page"));
                    that.updateAddParams("colID", that.headerData[colindex].FLD_COLUMN_ID);
                    var direction = "ASC";
                    direction = (that.getParamValue("sortDir") == "ASC") ? "DESC" : direction;
                    that.updateAddParams("sortClass", that.utility.getSortcClass(direction));
                    that.updateAddParams("sortDir", direction);
                    // position after column reordering and sorting
                    that.updatePosition();
                    that.ptScope.doAjax(that.prepareParams());
                });

        /**
         * 
         */
        this.parentCont.find("[data-column='paging-action'] [data-item-id=ct-detailaction-fld]").on("click",
            function(evt) {
                evt.stopPropagation();
                if (that.ptScope.listViewMD.FLD_DETAIL_ACTION_IND != "Y") {
                    return false;
                } else {
                    var spanObj = $(evt.target).parents("[data-item-data]")
                    $(this).parents("[data-grid-records]").trigger("click", [spanObj, 2]);
                }

            });

        /**
         * Pagination handler
         */
        this.parentCont.find("tfoot ul a").dblclick(function(e) {
            return false;
        });
        this.parentCont.find("tfoot ul a").on("click", function(evt) {
            $this = $(this);
            $parent = $this.parents("li");
            if (!$parent.hasClass("active")) {
                if (!$parent.hasClass("hidden")) {
                    var pageNo = parseInt($this.data("page"));
                    if ((pageNo - 1) >= that.pages)
                        return false;
                    that.updateAddParams("currentPage", pageNo, true);
                    if (that.recordsCount > that.perPage) {
                        that.updateAddParams("previousPage", (pageNo - 1), true);
                        that.updateAddParams("nextPage", (pageNo + 1), true);
                        that.updateAddParams("start", (that.utility.recordsFrom(pageNo, that.perPage) - 1), true);
                    }
                    that.scrollField = true;
                    that.ptScope.doAjax(that.prepareParams());
                }
            }
        });
        this.parentCont.find("[data-item-id=list_clearFilterTool]").on("click", function() {
            that.ptScope.clearFilter();
        });
        /**
         * Filter Form Enable, if its no sub menu
         */
        this.parentCont.find("[data-icn-action='filter'] li a").on("click", function(evt) {
            $this = $(this);
            if ($this.next().length == 0) {
                var xtype = $this.data("xtype");
                // columnID = $this.parents("th[data-thindex]").data("column-linked");
                columnID = $(this).parent().data("colid"), xtype = $(this).parent().data("xtype")
                if (that.compactView == true)
                    columnID = $(this).parent().data("colid"), xtype = $(this).parent().data("xtype");
                if (xtype == "" && columnID == "PARTICULARS" || columnID == "VALUE") {
                    /*
                     * var filterParams=that.filterClass.getTemplateParams("contains"); filterParams["btnCancel"] =
                     * iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_CANCEL"); var tpl = new
                     * ct.lib.tmplLayer(that.filterClass.getTmplObject("string"),filterParams)
                     * tpl.getTemplate(that.applyFilterTemplateIfPropertyGrid,that);
                     */
                    var opts = {
                        "xType": xtype,
                        "column": columnID,
                        "searchType": "contains"
                    };
                    that.applyFilterTemplateIfPropertyGrid(opts);
                } else {
                    that.ptScope.columnID = columnID;
                    var opts = {
                        "xType": xtype,
                        "column": columnID,
                        "searchType": "contains"
                    };
                    that.renderFilterForm(opts);

                }
            }
        });

        /**
         * Filter searched tags
         */
        this.parentCont.find("[data-filter-id]").on("click", function(evt) {
            evt.preventDefault();
            var id = $(this).data("filter-id");
            that.filterClass.removeFilterIfExists(id);
            delete that.columnValue[id];
            that.tagConfig = $.grep(that.tagConfig, function(data, index) {
                return data.column != id;
            });
            var params = that.filterClass.refreshFilters();
            if (that.compactView == false)
                that.updatePosition();
            that.scrollField = true;
            if (params) {
                if (!params.COLUMN_COUNT) {
                    delete that.tmplOpts.FILTERS;
                }
                that.ptScope.doAjax(that.prepareParams(params));
            }
        });
        /**
         * Used to render filter form on click of search tag
         */
        this.parentCont.find("[data-item-id=ct-badge-txt]").on(
            "click",
            function(e) {
                var colId = $(this).data("column");
                var searchType = $(this).data("searchtype");
                var xType = $(this).data("datatype");
                if (xType == "date" || xType == "float") {
                    if (that.compactView == true)
                        var toFind = "[data-icn-action='filter'] [data-colid=" + colId + "] [data-submenu=" + searchType + "][data-xtype=" + xType + "]";
                    else
                        var toFind = "[data-colid=" + colId + "][data-xtype=" + xType + "] [data-submenu=" + searchType + "] a";
                    if (searchType != 'previous-month') {
                        that.parentCont.find(toFind).trigger("click");
                        that.parentCont.find("input[name=amount_" + searchType + "]").focus();
                    }
                } else {
                    if (that.compactView == true)
                        var toFind = "[data-icn-action='filter'] [data-colid=" + colId + "] a";
                    else
                        var toFind = "[data-colid=" + colId + "][data-xtype=" + xType + "] a";
                    that.parentCont.find(toFind).trigger("click");
                    that.parentCont.find("input#stringContains").focus();
                }
                if (!($.isEmptyObject(that.columnValue))) {
                    if (searchType == "between") {
                        var dateFrom = that.columnValue[colId][0].value;
                        var dateTo = that.columnValue[colId][1].value;
                        that.parentCont.find("form div.input-group input[name='date_from']").val(dateFrom);
                        that.parentCont.find("form div.input-group input[name='date_to']").val(dateTo);
                    } else {
                        var text = that.columnValue[colId][0].value;
                        that.parentCont.find("form div.input-group .form-control").val(text);
                    }
                }
            });
        /**
         * Show/Hide Columns
         */
        this.parentCont.find("[data-item-id=showHideCol]").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var _this = $(this),
                li = _this.parents("li"),
                colID = li.data("colid"),
                colIndex = li.data("column-id");
            that.parentCont.find("[data-icn-action='show-hide-columns']").parents("div.dropdown").trigger('click');
            that.updateShowHideColumns(colID, colIndex, _this);
            return true;
        });
        /**
         * Context Button Click Overriding bootstrap click event beacuse it cause event bubbling
         */
        this.parentCont.find("[data-icn-action=\"context\"]").on(
            "click",
            function(e) {
                e.preventDefault();
                e.stopPropagation();
                $("body").find("#context_menu_container").hide();
                var scroll = that.parentCont.find(".table-responsive").hasScrollBar().horizontal;
                var parent = $(this).parent();
                identifier = $(this).parents("tr").find("[data-column='paging-action']").data("item-data");
                parent.attr("data-row-identifier", identifier);
                that.parentCont.find("[data-context=\"submenu\"]").remove();
                $menuList = $(that.context.getContextMenuHtml());
                $menuList.show();

                parent.find("div.ct-dropdown").append($menuList);

                that.parentCont.find("[data-context=\"submenu\"]").show();
                parent.find("[data-context=\"submenu\"] li").has("ul").on("mouseover", function() {
                    $(this).children("ul").show();
                }).on("mouseout", function() {
                    $(this).children("ul").hide();
                });
                if (scroll) {
                    var offsetLeft = that.parentCont.find(".table-responsive").width() - ($(window).width() - ($(this).offset().left + $(this).outerWidth()));
                } else {
                    var offsetLeft = $(this).offset().left;
                }
                var menuWidth = that.parentCont.find("[data-context='submenu']").width()
                var total = offsetLeft + menuWidth;
                if (total > that.parentCont.find(".table-responsive").width()) {
                    that.parentCont.find("[data-context='submenu'] li ul").addClass("ct-dropdown-left");
                    that.parentCont.find("[data-context='submenu']").removeClass("ct-dropdown-dynamic");

                }
                return false;
            });

        this.parentCont.find("[data-icn-action='show-hide-columns']").parents("div.dropdown").on(
            'show.bs.dropdown',
            function(e) {
                var menu = $("ul.dropdown-menu li", $(this));
                /*
                 * for(var key=0; key<that.headerArray.length; key++){ var cssClass =
                 * that.headerArray[key].cssClass; if(cssClass.search("hidden") != -1 &&
                 * that.parentCont.find("table thead
                 * th[data-column-linked='"+that.headerArray[key].COL_ID+"']").is(":visible") == false){
                 * $(menu[key]).removeClass("flaticon-checked"); } }
                 */
                for (var key = 0; key < menu.length; key++) {
                    var column_id = $(menu[1]).data('column-id');
                    var cssClass = that.headerArray[column_id].cssClass;
                    if (cssClass.search(" hidden ") != -1 && that.parentCont.find(
                            "[data-column-linked='" + that.headerArray[column_id].COL_ID + "']").is(
                            ":visible") == false) {
                        $(menu[key]).removeClass("flaticon-checked");
                    }
                }
                /*	*/
                /** starts applying scroll bar for no data in widget * */
                /*
                 * var listHeight = that.parentCont.find("[data-action='show-hide-menu']").height(); var
                 * tbodyHeight = that.parentCont.find("tbody").height(); if(listHeight > tbodyHeight){
                 * that.parentCont.find("[data-action='show-hide-menu']").height(tbodyHeight+(that.parentCont.find("thead").height()/4));
                 * that.parentCont.find("[data-action='show-hide-menu']").addClass("ct-scroll"); }
                 */
                /** starts applying scroll bar for no data in widget * */
                $(this).find("ul li").has("ul").on("mouseover", function() {
                    $(this).children("ul").show();
                }).on("mouseout", function() {
                    $(this).children("ul").hide();
                });
                var thWidth = $(this).offset().left - that.parentCont.offset().left; // that.parentCont.find("table
                // thead
                // th[data-column-linked]:first").width();
                var menuWidth = that.parentCont.find("[data-action='show-hide-menu']").width();
                if (menuWidth > thWidth)
                    $(this).parents("[data-column-linked]").find("[data-action='show-hide-menu']")
                    .addClass("show_hide_menu"); // that.parentCont.find("th[data-column-linked]:first
                // ul[data-action='show-hide-menu']").css("left","0");

            });
        this.parentCont.find("[data-icn-action='filter']").parents("div.dropdown").on('show.bs.dropdown', function(e) {
            $(this).find("ul li").has("ul").on("mouseover", function() {
                var windowWidth = that.parentCont.width();
                var prevOffset = $(this).offset();
                var prevWidth = $(this).width();
                var presentOffset = prevOffset.left + prevWidth;
                var presentWidth = $(this).children('ul.dropdown-menu').width();
                var reqWidth = presentOffset + presentWidth;
                if (reqWidth > windowWidth) {
                    $(this).children('ul.dropdown-menu').css({
                        left: "auto",
                        right: "100%"
                    }).show();
                    if (prevOffset.left < presentWidth) {
                        $(this).children('ul.dropdown-menu').css({
                            left: "auto",
                            right: "auto"
                        }).show();
                    }
                } else {
                    $(this).children('ul.dropdown-menu').css({
                        left: "100%",
                        right: "100%"
                    }).show();
                }
            }).on("mouseout", function() {
                $(this).children("ul").hide();
            });
        });
        /**
         * Context Click
         */
        if (this.ptScope.listViewMD.FLD_CONTEXT_ACTION_IND == "Y") {
            var menuList = that.context.getContextMenuHtml();
            if (!cbx.isEmpty(menuList)) {
                var menuRenderType = that.context.getMenuRenderType();
                if (menuRenderType != 'APP') {
                    var contextContainer = $("body").find("#context_menu_container");
                    if (contextContainer.length <= 0) {
                        $("body").append($("<div />").attr("id", "context_menu_container").addClass("dropdown ct-dropdown"));
                    }
                    contextContainer = $("body").find("#context_menu_container");
                    this.parentCont.find("[data-grid-records]").on("contextmenu", function(e) {
                        that.parentCont.find("ul[data-context=\"submenu\"]").hide();
                        e.preventDefault();
                        contextContainer.html($(menuList));

                        /*
                         * Event for Group Context Menu Click
                         */
                        if (that.ptScope.listViewMD.FLD_VIEW_TYPE == "GROUP") {
                            that.rowData = that.records[this.rowIndex - 1];
                            that.colId = that.actionParams.colID;
                            that.colValue = that.rowData[that.colId];
                            that.ptScope.renderer.ptScope.viewConf.raiseEvent(CWEC.GP_CONT_MENU_CLICK, that.colId, that.colValue, that.rowData);
                        }

                        $("body").find("#context_menu_container").show();
                        /**
                         * Prepares and sets row identifier Which will easier to get specific row data
                         */
                        var element = $(this),
                            tagname = element.prop("tagName"),
                            identifier = "";
                        if (tagname == "TD") {
                            identifier = element.data("item-data");
                        } else if (tagname == "TR") {
                            identifier = element.children().eq(0).data("item-data");
                        }
                        contextContainer.data("row-identifier", identifier);

                        /**
                         * Update position of Context menu
                         */
                        that.utility.setContextMenu(e, contextContainer);
                        contextContainer.children().show();
                        /**
                         * Show/Hide sub menus
                         */
                        contextContainer.find("li").has("ul").on("mouseover", function() {
                            $(this).children("ul").show();
                        }).on("mouseout", function() {
                            $(this).children("ul").hide();
                        });

                        contextContainer.find("li > a").on("click", function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            var id = $(this).data("context-id"),
                                id = $.trim(id),
                                identifier = $
                                .trim($("#context_menu_container").data("row-identifier"));
                            that.context.triggerEvent(identifier, id, that.eventHandler);
                            contextContainer.children().hide();
                        });
                        var ulElement = $($("#context_menu_container").find("ul"));
                        var contextLength = 0;
                        for (var i = 0; i < ulElement.length; i++) {
                            contextLength += $(ulElement[i]).width();
                        }
                        var ulFirstPos = $("#context_menu_container").find("ul:first").offset().left;

                        var total = ulFirstPos + contextLength;

                        if (total > $(window).width()) {
                            $("#context_menu_container").find("ul:not(:first)").addClass("ct-dropdown-left");
                        }

                        return false;
                    });
                }
            }
        };

        /**
         * 
         */
        $("body").on("click", function() {
            $(this).find("#context_menu_container").children().hide();
            that.parentCont.find("[data-context=\"submenu\"]").remove();
            that.parentCont.find('[data-toggle="tooltip"]').tooltip();
        });

    },
    /**
     * Render the form input for filters
     */
    renderFilterForm: function(opts) {
        var that = this;
        var obj = {};
        this.opts = opts;
        obj["Contains"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_contains");
        obj["LessThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_DT_LT");
        obj["GreaterThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_DT_GT");
        obj["equals"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_EQUALS");
        obj["btnSearch"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_SEARCH");
        obj["btnCancel"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_CANCEL");
        obj["placeHolderEquals"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_STR_CONST_EQUALS");
        obj["lblGreaterThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_GREATER_THAN");
        obj["lblLessThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_LESS_THAN");
        obj["field_Name"] = that.headerArray[that.headerArray.map(function(e) {
            return e.COL_ID;
        }).indexOf(opts.column)].LIST_DATA;
        var filterParams = that.filterClass.getTemplateParams(opts.searchType);
        $.extend(filterParams, obj);
        var tpl = new ct.lib.tmplLayer(that.filterClass.getTmplObject(opts.xType), filterParams)
        tpl.getTemplate(that.applyFilterTemplate, that);

    },
    /**
     * Validation for input value of type numeric
     */
    validateFromValue: function(value) {
        var Vtype = CFVR.getVtype('AMOUNT');
        if (Vtype && !(Vtype.globalRe.test(value))) {
            return false;
        }
        return true;
    },
    formatDateFromInput: function(value) {
        var prefFormat = canvas.datePreferences.getParsedDateFormat();
        var selecredDate = moment(value, prefFormat);
        return selecredDate.format(prefFormat);
    },
    /**
     * Action buttons for Filter forms
     * 
     * @opts: should pass, columnID, search type and data type
     */
    filterFormActions: function(opts) {
        var that = this;

        /*
         * filter form cancel handler
         */
        this.parentCont.find("[data-filter-form] [data-action='cancel']").on("click", function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var container = that.parentCont.find("[data-filterformcontainer]");
            container.hide();
        });

        /**
         * filter form submit handler
         */
        this.parentCont
            .find("[data-filter-form] [data-action='submit']")
            .on(
                "click",
                function(evt) {
                    evt.preventDefault();
                    var formValue = that.parentCont.find("[data-filter-form]").serializeArray();
                    var cfg = {
                        "datatype": opts.xType,
                        "searchtype": opts.searchType,
                        "column": opts.column,
                        "formData": formValue
                    };
                    if (opts.xType == "date" && (opts.searchType == "on" || opts.searchType == "before" || opts.searchType == "after")) {
                        formValue[0].value = that.formatDateFromInput(formValue[0].value);
                    } else if (opts.xType == "date" && opts.searchType == "between") {
                        formValue[0].value = that.formatDateFromInput(formValue[0].value);
                        formValue[1].value = that.formatDateFromInput(formValue[1].value);
                    }
                    var params = that.filterClass.getAjaxParams(cfg);
                    that.tagConfig = $.grep(that.tagConfig, function(data, index) {
                        return data.column != opts.column;
                    });
                    that.tagConfig.push(opts);
                    if (params && (opts.xType == "float" ? that.validateFlag : true)) {
                        if (that.compactView == false)
                            that.updatePosition();
                        that.scrollField = true;
                        that.updateAddParams("start", 1, true);
                        that.updateAddParams("currentPage", 1, true);
                        that.ptScope.doAjax(that.prepareParams(params), "", that.compactView);
                        that.parentCont.find("[data-filter-form] [data-action='cancel']").trigger(
                            "click");
                        that.columnValue[opts.column] = formValue;
                    } else
                        that.setInvalidList(opts);

                });
        /**
         * Filter submit, this event catches the Enter key
         */
        this.parentCont.find("[data-filter-form]").unbind('submit').bind("submit", function(evt) {
            evt.preventDefault();
            that.parentCont.find("[data-filter-form] [data-action='submit']").trigger("click");
            return false;
        });
        this.parentCont.find("input").on("focus", function(e) {
            var comp = $(this).parent();
            comp.removeClass('has-error');
            comp.find("span[type=Error_Msg]").removeClass('show').addClass('hidden');
            comp.find("span[type=Error_Msg]").removeAttr('data-original-title');
        });
        /**
         * Validation numbers,string only
         */
        this.parentCont.find("input[vtype='numeric']").on("keypress", function(e) {
            var Vtype = CFVR.getVtype('AMOUNT');
            var key = e.which;
            var value = $(this).val();
            if (key == 8 || key == 0)
                return true;
            if (key == 13) {
                if (that.validateFromValue(value)) {
                    that.validateFlag = true;
                    that.parentCont.find("[data-filter-form] [data-action='submit']").trigger("click");
                    return true;
                } else {
                    that.validateFlag = false;
                    that.parentCont.find("[data-filter-form] [data-action='submit']").trigger("click");
                    return false;
                }
            }
            if (Vtype && !(Vtype.mask.test(String.fromCharCode(e.which)))) {
                return false;
            }
            return true;
        });
        /**
         * validation for number field.
         */
        this.parentCont.find("input[vtype='numeric']").on("blur", function(e) {
            var value = $(this).val();
            if (that.validateFromValue(value)) {
                that.validateFlag = true;
            } else {

                that.validateFlag = false;

            }

        });
    }

});