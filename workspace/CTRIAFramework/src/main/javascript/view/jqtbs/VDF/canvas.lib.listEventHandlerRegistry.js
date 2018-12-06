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
 * @className : canvas.lib.listEventHandlerRegistry
 * @description: This class is responsible to bind handlers for list header, body and footer related events
 */

canvas.lib.listEventHandlerRegistry = Class({
    filtersAll: [],
    headerDOM: {},

    /**
     * @method 		contextMenuInitialiser
     * @memberof 	"canvas.lib.listEventHandlerRegistry"
     * @description If context actions are configured in db, then 
     * 				listContext class is called and the list is prepared.
     */
    contextMenuInitialiser: function() {
        this.context = new canvas.lib.listContext({
            "contextMenu": this.listview.md.md.CONTEXT_MENU_LIST,
            "viewMD": this.listview.listViewMD.viewMD,
            "parent": this.listview
        });
    },
    bodyDOM: {},

    /**@method  "bindListHeaderHandlers"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Binds the event handlers to the header for handling the functions like Sort, Filter, Expand All, Select All 
     */
    bindListHeaderHandlers: function(refs) {
        LOGGER.log("Header Handlers initatied ! ", refs);
        var self = this;

        self.src = refs;
        self.ele = refs.headerDOM;
        this.headerDOM = refs.headerDOM;

        /**
         * Grid Sorting
         */

        self.ele.find("th").find("[data-action=\"column-sorter\"]").on("mousedown", function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self.updatePosition();
            var $this = $(this),
                colID = $this.data("column-linked"),
                direction = ($this.data("direction")) ? ($this.data("direction") == "ASC") ? "DESC" : "ASC" : "ASC";

            var obj = {
                "sort": colID,
                "dir": direction
            };
            self.src.scope.rendererData.clearData();
            if (self.src.scope.rendererData.viewType == 'ADVGROUP') {
                self.src.scope.params.initialParams.DATA_REQ_TYPE = "GRPDATA";
                self.src.scope.params.initialParams.GROUP_FILTERS = "";
            }
            self.src.scope.params.setParams(obj);
            self.src.scope.ajaxCall.setInitialParams();
            self.src.scope.ajaxCall.doAjax($.proxy(function(data) {
                $this.data("direction", direction);
                self.src.scope.listData.initializeData(data);
                self.src.scope.rendererData.renderListTableWrapper(false);
                var icon = (direction == "ASC") ? "flaticon-up-arrow" : "flaticon-down-arrow";
                $this.parents("tr").find("th").find("[data-action=\"column-sorter\"]").removeClass("flaticon-down-arrow").removeClass("flaticon-up-arrow").addClass("flaticon-up-down-arrow2")
                $this.removeClass("flaticon-up-down-arrow2").addClass(icon);
            }, $this));
        });

        refs.headerDOM.find("div[data-item-id=ct_header_comp] select[data-item-id=combolist]").on(
            'change',
            $.proxy(
                function(evt) {
                    var dataStore = this.listview.dataStore;
                    var selectedRows = dataStore.getSelectedData();
                    var tHeaderDOM = $(evt.currentTarget).parents("thead");
                    var tBodyDOM = tHeaderDOM.siblings("tbody");
                    for (var i = 0; i < selectedRows.length; i++) {
                        var currRow = tBodyDOM
                            .find("tr[data-item-id=" + selectedRows[i].rowIndex + "]");
                        var combolist = currRow.find("select[data-item-id=combolist]");
                        combolist.val($(evt.currentTarget).val().trim());
                        var colId = combolist.parent("td").attr("data-item-id").split("|");
                        selectedRows[i][colId[0]] = $(evt.currentTarget).val().trim();
                        var updatedInd = dataStore.updateModifiedData(selectedRows[i], colId[0]);
                        updatedInd ? currRow.addClass("list-row-updated") : currRow
                            .removeClass("list-row-updated");
                        currRow.find("input[data-item-id=ct_rowSelector]").prop("checked", false);
                    }
                    tHeaderDOM.find("input[data-item-id=ct_header_selectAll]").prop("checked", false);
                    tBodyDOM.find("tr").removeClass("list-row-active");
                    selectedRows.length == 0 ? $(evt.currentTarget).val("") : "";
                }, this));

        refs.headerDOM.find("[data-ct-input=\"rowselection-col\"]").find("[data-item-checker]").on("change", function(evt) {
            $this = $(this);
            var parent = $(evt.target),
                tHeaderDOM = $(evt.currentTarget).parents("thead"),
                tBodyDOM = tHeaderDOM.siblings("tbody");
            var setRecordsSelected = function(dataStore) {
                var selDeRecords = [];
                for (var i = 0; i < dataStore.records.length; i++) {
                    selDeRecords[i] = dataStore.getRow(i);
                }
                dataStore.updateSelectedData(selDeRecords, true, true);
                tBodyDOM.find("[data-item-checker]").prop("checked", true);
                tBodyDOM.find("[data-grid-records]").addClass("ct-row-active");
                $this[0].checked = true;
                $this.addClass('selectAll-active');
            };
            if (parent.hasClass('selectAll-active')) {
                parent.removeClass('selectAll-active');
                self.ele.find("[data-item-checker]").prop("checked", false);
                self.ele.find("[data-grid-records]").removeClass("ct-row-active");
            } else {

                var viewType = self.rendererData.listViewMD.getViewType();
                if (viewType == 'PAGING') {
                    if (tBodyDOM.has(".load-more")[0]) {
                        $this.attr('checked', false);
                        var yetToLoadWarnMsg = new canvas.Dialog({
                            dialogType: "USERDEFINED",
                            dialogStyle: "OK_CANCEL",
                            message: CRB.getFWBundleValue('LOAD_RECORDS'),
                            title: CRB.getFWBundleValue('LBL_CONFIRMATION'),
                            okHandler: function() {
                                var scope = self.rendererData;
                                var pageNo = scope.getParamValue("currentPage");
                                var limit = scope.listData.actualTotalCount - (scope.perPage * pageNo);
                                scope.params.updateAddParams("start", scope.utility.recordsFrom(pageNo + 1, scope.perPage) - 1);
                                scope.params.updateAddParams("limit", limit);
                                pageNo = Math.ceil(scope.listData.actualTotalCount / scope.perPage);
                                scope.params.updateAddParams("currentPage", pageNo);
                                scope.ajaxCall.setInitialParams();
                                scope.ajaxCall.doAjax($.proxy(function(data) {
                                    scope.listData.initializeData(data);
                                    scope.renderListTableWrapper(false);
                                    setRecordsSelected(scope.listData);
                                }), this);

                                yetToLoadWarnMsg.close();

                            },
                            cancelHandler: function() {
                                self.ele.find("[data-item-checker]").prop("checked", false);
                                yetToLoadWarnMsg.close();
                            }
                        });
                        yetToLoadWarnMsg.show();
                    } else {
                        setRecordsSelected(self.rendererData.listData);
                    }
                } else if (viewType == 'LIST') {
                    if (!(tBodyDOM.find(".load-more").hasClass('hidden'))) {
                        var yetToLoadWarnMsg = new canvas.Dialog({
                            dialogType: "USERDEFINED",
                            dialogStyle: "OK_CANCEL",
                            message: CRB.getFWBundleValue('NOT_LOADED_MSG'),
                            title: CRB.getFWBundleValue('LBL_CONFIRMATION'),
                            okHandler: function() {
                                parent.addClass('selectAll-active');
                                self.ele.find("[data-item-checker]").prop("checked", true);
                                self.ele.find("[data-grid-records]").addClass("ct-row-active");
                                yetToLoadWarnMsg.close();

                            },
                            cancelHandler: function() {
                                self.ele.find("[data-item-checker]").prop("checked", false);
                                yetToLoadWarnMsg.close();
                            }
                        });
                        yetToLoadWarnMsg.show();
                    } else {
                        setRecordsSelected(self.rendererData.listData);
                    }
                } else if (viewType == "ADVGROUP") {
                    if (tBodyDOM.find('[data-grouped-header]').filter('.group_collapsed').length > 0) {
                        var yetToLoadWarnMsg = new canvas.Dialog({
                            dialogType: "USERDEFINED",
                            dialogStyle: "OK_CANCEL",
                            message: CRB.getFWBundleValue('YET_TO_LOAD_MSG'),
                            title: CRB.getFWBundleValue('LBL_MESSAGE'),
                            okHandler: function() {
                                tHeaderDOM.find("[data-item-checker]").prop("checked", false);
                                yetToLoadWarnMsg.close();
                            },
                            cancelHandler: function() {
                                self.ele.find("[data-item-checker]").prop("checked", false);
                                yetToLoadWarnMsg.close();
                            }
                        });
                        yetToLoadWarnMsg.show();
                    } else {
                        setRecordsSelected(self.rendererData.listData);
                    }

                } else {
                    parent.addClass('selectAll-active');
                    self.ele.find("[data-item-checker]").prop("checked", true);
                    self.ele.find("[data-grid-records]").addClass("ct-row-active");

                }

            }

        });
        refs.headerDOM.find("[data-ct-input=\"rowexpand-All\"]").on(
            'click',
            $.proxy(function(evt) {
                evt.preventDefault();
                var tHeaderDOM = $(evt.currentTarget).parents("thead");
                var tBodyDOM = tHeaderDOM.siblings("tbody");
                var $this = $(this),
                    kids = tBodyDOM.find("[data-item-id=\"row-expander\"]");
                if (this.listViewMD.getViewType() == "PAGING" ? tBodyDOM.has("tr.load-more")[0] : false) {
                    var yetToLoadWarnMsg = new canvas.Dialog({
                        dialogType: "USERDEFINED",
                        dialogStyle: "OK_CANCEL",
                        message: CRB.getFWBundleValue('NOT_LOADED_MSG'),
                        title: CRB.getFWBundleValue('LBL_MESSAGE'),
                        okHandler: function() {
                            yetToLoadWarnMsg.close();
                        }
                    });
                    yetToLoadWarnMsg.show();
                } else if ((this.listViewMD.getViewType() == "ADVGROUP") && (tBodyDOM.find('[data-grouped-header]').filter('.group_collapsed').length > 0)) {
                    var yetToLoadWarnMsg = new canvas.Dialog({
                        dialogType: "USERDEFINED",
                        dialogStyle: "OK_CANCEL",
                        message: CRB.getFWBundleValue('YET_TO_LOAD_MSG'),
                        title: CRB.getFWBundleValue('LBL_MESSAGE'),
                        okHandler: function() {
                            yetToLoadWarnMsg.close();
                        }
                    });
                    yetToLoadWarnMsg.show();
                } else {

                    if ($this.data("mode") == undefined || $this.data("mode") == "expandAll") {
                        $this.data("mode", "collapseAll");
                        kids.filter(function(index) {
                            $(this).data("mode", "collapse");
                        });
                        self.ele.find("tr.ct-hidden-row").show();
                        //kids.find("span[data-item-id=row-expander]").addClass("ct-row-expander-collapse_icon")
                        //		.removeClass("ct-row-expander-expand_icon");
                        tHeaderDOM.find("[data-ct-input=\"rowexpand-All\"]").removeClass("ct-row-expand flaticon-add f_gr")
                            .addClass("ct-row-collapse flaticon-minus f_gr");
                        kids.trigger("click");
                    } else {
                        $this.data("mode", "expandAll");
                        kids.filter(function(index) {
                            $(this).data("mode", "expand");
                        });
                        self.ele.find("tr.ct-hidden-row").remove();
                        kids.removeClass("ct-row-collapse flaticon-minus f_gr").addClass("ct-row-expand flaticon-add f_gr");
                        tHeaderDOM.find("[data-ct-input=\"rowexpand-All\"]").removeClass("ct-row-collapse flaticon-minus f_gr")
                            .addClass("ct-row-expand flaticon-add f_gr");
                    }

                }

            }, this));

    },
    collapseExpand: function(rowIndex, $this) {
        var headCols = this.src.scope.rendererData.headerCols;
        var cols = this.src.scope.rendererData.totalRows[rowIndex];
        var colLength = cols.length;
        var hiddenColsLength = 0,
            hiddenCols = $this.parents('tr[data-row-id=' + rowIndex + ']').find('td').filter('.hidden'),
            hiddenColsLength_xs = $this.parents('tr[data-row-id=' + rowIndex + ']').find('td').filter('.hidden-xs').length,
            hiddenColsLength_sm = $this.parents('tr[data-row-id=' + rowIndex + ']').find('td').filter('.hidden-sm').length;

        hiddenColsLength = hiddenCols.length;
        if (this.listview.listViewMD.getViewType() == 'ADVGROUP') {
            var that = this;
            hiddenColsLength = hiddenColsLength - hiddenCols.filter(function() {
                return that.rendererData.fieldPosInGroup.map(function(e) {
                    return e.COL_ID;
                }).indexOf($(this).data('item-id').trim()) >= 0;
            }).length
        }

        var noDisplay_css;

        if (hiddenColsLength == 0) {
            if (hiddenColsLength_sm > 0) {
                noDisplay_css = "hidden-sm hidden-xs";
            } else if (hiddenColsLength_xs > 0) {
                noDisplay_css = "hidden-xs";
            }
        } else {
            noDisplay_css = "hidden";
        }

        var tmpRow = $("<tr/>").addClass("ct-hidden-row");
        if (this.listview.listViewMD.getViewType() == 'ADVGROUP') {
            var tmpTdSpacer = $("<td/>").attr("colspan", this.rendererData.fieldPosInGroup.length).addClass("ct-hidden-data");
            tmpRow.append(tmpTdSpacer);
        }
        var tmpTdcont = $("<td/>").attr("colspan", this.src.scope.rendererData.colCount + 2).addClass("ct-hidden-data");
        var contdiv = $("<div />").addClass("ct-hidden-row__content");
        var tmpTd = tmpTdcont.append(contdiv);
        var noDisplayInd = false;

        for (var i = 0; i < colLength; i++) {
            var div = $("<div />").addClass("recordSetContainer");
            var cssClass = cols[i].EXPAND_CLASS;
            div.addClass(cssClass);
            div.append($("<span />").addClass("list-column-label"));
            div.find("span.list-column-label").append($("<strong />").html(headCols[i].HEADER_VAL + " : "))
            div.append($("<span />").addClass("list-column-data").html(cols[i].VALUE));
            contdiv.append(div);
            noDisplayInd = (cssClass == 'visible') || noDisplayInd;
        }
        if (!noDisplayInd) {
            if (noDisplay_css.trim() == 'hidden')
                noDisplay_css = 'hidden-sm hidden-xs';
        }
        var NO_DATA_TO_DISP = CRB.getFWBundleValue('NO_DATA_TO_DISP');
        var div = $("<div />").addClass("recordSetContainer " + noDisplay_css);
        div.html(NO_DATA_TO_DISP);

        contdiv.append(div);
        tmpRow.append(tmpTd);
        tmpRow.insertAfter($this.parents("tr"));
        $this.removeClass("ct-row-expand flaticon-add").addClass("ct-row-collapse flaticon-minus");
        $this.data("mode", "expand");

    },
    updatePosition: function() {
        var tdObj = this.rendererData.listHeaderCont.find("tr th[data-column-linked]");
        var head = [];
        var arrayContent = [],
            headData_temp = $.extend(true, [], this.rendererData.headerCols);
        for (var i = 0; i < tdObj.length; i++) {
            var columnID = $(tdObj[i]).attr("data-column-linked");

            var obj = $.grep(this.rendererData.headerCols, function(data, index) {
                return data.COL_ID == columnID;
            });

            head.push(obj[0]);

            /*arrayObj[0]._position = i+1;
            arrayContent.push(arrayObj[0]);*/

        }

        for (var i = 0; i < headData_temp.length; i++) {

            if (head.map(function(e) {
                    return e.COL_ID;
                }).indexOf(headData_temp[i].COL_ID) == -1) {
                head.push(headData_temp[i]);
            }
        }
        this.rendererData.headerCols = head;
        /*this.headerArrayContent = arrayContent;
        var arrayLength = this.headerArrayContent.length;
        for(var i=0 ; i < this.dupHeaderArrayContent.length ; i++){
        	
        	if(this.headerArrayContent.map(function(e) { return e._id; }).indexOf(this.dupHeaderArrayContent[i]._id)==-1){
        		this.tempHeader={};
        		this.tempHeader._id = this.dupHeaderArrayContent[i]._id;
        		this.tempHeader._dataindex = this.dupHeaderArrayContent[i]._dataindex;
        		this.tempHeader._position = arrayLength + i + 1;
        		this.tempHeader._hidden =  this.dupHeaderArrayContent[i]._hidden;
        		this.headerArrayContent.push(this.tempHeader);
        	}
        }*/
    },
    /**@method  "bindListBodyHandlers"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Binds the event handlers to the body for handling the functions like Row Click, Cell Click, Row Expand, Row Select, DrillDown 
     */
    bindListBodyHandlers: function(refs) {

        this.bodyDOM = refs.bodyDOM;
        this.refreshHeader(refs.headerDOM);
        this.start = this.rendererData.getParamValue('start');
        this.end = this.rendererData.updatedRecords;
        var that = this;
        var tRows = refs.bodyDOM.find('[data-row-id]').filter(function() {
            return parseInt($(this).attr('data-row-id')) >= that.start;
        });
        /*
         * Event for Group Double Click
         */
        if (that.rendererData.viewType == 'ADVGROUP') {
            var parentInd = refs.parentInd;
            tRows = refs.bodyDOM.find('[data-grid-records][data-group-id = ' + parentInd + ']');

            refs.bodyDOM.on("dblclick", function(evt) {
                this.listview.viewConf.raiseEvent(CWEC.GP_DBL_CLICK, refs.scope.listData.records);
            });
        }
        that.contextActionHandler(refs, that);

        tRows.find("[data-item-id=ct_rowSelector]").on('click', $.proxy(function(evt) {
            var dataStore = this.listview.listData;
            var tBodyDOM = $(evt.currentTarget).parents("tbody");
            var rowInd = $(evt.currentTarget).parents("tr").attr("data-row-id");
            var selDeRecord = dataStore.getRow(rowInd);
            if ($(evt.currentTarget).prop("checked")) {
                dataStore.updateSelectedData(selDeRecord, true, false);
                $(evt.currentTarget).prop("checked", true);
                $(evt.currentTarget).parents("tr").addClass("ct-row-active");
            } else {
                dataStore.updateSelectedData(selDeRecord, false, false);
                $(evt.currentTarget).prop("checked", false);
                $(evt.currentTarget).parents("tr").removeClass("ct-row-active");
                tBodyDOM.siblings("thead").find("[data-item-id=ct_header_selectAll]").prop("checked", false);
            }
        }, this));

        /*refs.bodyDOM.find("select[data-item-id=combolist]").on('change', $.proxy(function (evt)
        {
        	evt.stopImmediatePropagation();
        	var dataStore = this.listview.dataStore;
        	var row = $(evt.currentTarget).parents("tr");
        	var rowId = row.attr("data-item-id");
        	var colID = $(evt.currentTarget).parent("td").attr("data-item-id").split("|");
        	var rowData = dataStore.getRow(rowId);
        	rowData[colID[0]] = $(evt.currentTarget).val().trim();
        	var updatedInd = dataStore.updateModifiedData(rowData, colID[0]);
        	updatedInd ? row.addClass("list-row-updated") : row.removeClass("list-row-updated");
        	this.listview.viewConf.raiseEvent(CWEC.DATA_MOD, colID[0], rowData[colID[0]], dataStore.modifiedData);
        }, this));*/

        var self = this;

        self.src = refs;
        self.ele = refs.bodyDOM;
        /**
         * Row Collapse / Expand
         */
        var onCollapseExpand = function(e) {
            e.preventDefault();
            var $this = $(this);
            var rowIndex = parseInt($this.data("rowindex"));

            var isExpand = $this.parents("tr").next().hasClass("ct-hidden-row");
            if (isExpand) {
                if ($this.data("mode") == "expand") {
                    $this.removeClass("ct-row-collapse flaticon-minus")
                        .addClass("ct-row-expand flaticon-add");
                    $this.parents("tr").next().remove();
                    $this.data("mode", "collapse");
                } else {
                    $this.removeClass("ct-row-expand flaticon-add")
                        .addClass("ct-row-collapse flaticon-minus");
                    $this.parents("tr").next().show();
                    $this.data("mode", "expand");
                }
            } else {
                self.collapseExpand(rowIndex, $this);
            }

        };
        tRows.find("[data-item-id=\"row-expander\"]").on('click', onCollapseExpand);

        var selectionType = this.rendererData.viewMD.FLD_SELECTION_TYPE;
        var dataStore = this.listview.listData;

        if (selectionType === "CELLSINGLE" ||
            selectionType === "CELLMULTI") {
            var DELAY = 200,
                clicks = 0,
                timer = null;
            tRows.find("[data-grid-record]").on("click", function(e, spanObj, contextclicks) {
                    e.stopPropagation();

                    $this = $(this);
                    var parent,
                        parentRow = $this.parent("tr");
                    if (spanObj) {
                        parent = spanObj;
                        clicks = contextclicks;
                    } else {
                        parent = $(e.target);
                    }
                    if (!$(parent).attr("data-item-data")) {
                        parent = parent.parents("[data-item-data]");
                    }
                    var colData = dataStore.getColData(parent),
                        colID = dataStore.getColID(),
                        colValue = dataStore.getColValue(),
                        rowData = dataStore.getRow(parentRow.data("rowindex"));
                    clicks++;
                    if (clicks === 1) {
                        timer = setTimeout(function() {
                            if ($this.hasClass("ct-cell-active")) {
                                $this.removeClass("ct-cell-active");
                                dataStore.updateSelectedData("cell", {
                                    "key": colID,
                                    "value": colValue
                                });
                            } else {
                                /* Remove existing selection */
                                if (selectionType == "CELLSINGLE") {
                                    self.ele.find("td.ct-cell-active").removeClass("ct-cell-active");
                                    // Save selected cell @return as and array
                                    dataStore.selectedData.push(rowData);
                                } else {
                                    // Save selected cell @return array with objects
                                    dataStore.selectedData.push(rowData);
                                }
                                $this.addClass("ct-cell-active");
                                self.listview.viewConf.raiseEvent(CWEC.CELL_CLICK, colID, colValue, rowData);
                                self.listview.viewConf.raiseEvent(CWEC.SINGLE_CLICK, colID, colValue, rowData);
                            }
                            clicks = 0;
                        }, DELAY);
                    } else {
                        clearTimeout(timer); //prevent single-click action
                        if ($this.hasClass("ct-cell-active")) {
                            $this.removeClass("ct-cell-active");
                        } else {
                            /* Remove existing selection */
                            if (selectionType == "CELLSINGLE") {
                                self.ele.find("td.ct-cell-active").removeClass("ct-cell-active");
                            }
                            $this.addClass("ct-cell-active");
                            self.listview.viewConf.raiseEvent(CWEC.CELL_DBLCLICK, colID, colValue, rowData);
                        }
                        clicks = 0; //after action performed, reset counter
                    }
                })
                .on("dblclick", function(e) {
                    e.preventDefault(); //cancel default double-click event
                });
        } else if (selectionType === "ROWSINGLE" ||
            selectionType === "ROWMULTI" ||
            selectionType === "SINGLE" ||
            selectionType === "MULTIPLE") {
            var DELAY = 200,
                clicks = 0,
                timer = null;
            tRows.find("[data-grid-record]").on("click", function(e, spanObj, contextclicks) {
                $this = $(this);
                var parent,
                    parentRow = $this.parent("tr");
                if (spanObj) {
                    parent = spanObj;
                    clicks = contextclicks;
                } else {
                    parent = $(e.target);
                }
                if (!$(parent).attr("data-item-data")) {
                    parent = parent.parents("[data-item-data]");
                }
                var colData = dataStore.getColData(parent),
                    colID = dataStore.getColID(),
                    colValue = dataStore.getColValue(),
                    rowData = dataStore.getRow(parentRow.data("rowindex"));
                clicks++;
                if (clicks === 1) {
                    timer = setTimeout(function() {
                        if (parentRow.hasClass("ct-row-active")) {
                            parentRow.find("input[data-item-checker]").prop("checked", false);
                            parentRow.removeClass("ct-row-active");
                            dataStore.updateSelectedData(rowData);
                        } else {
                            /* Remove existing selection */
                            if (selectionType == "ROWSINGLE" || selectionType === "SINGLE") {
                                self.ele.find("input[data-item-checker]").prop("checked", false);
                                self.ele.find("tr.ct-row-active").not($this).removeClass("ct-row-active");
                                dataStore.selectedData.push(rowData);
                            } else {
                                // Save selected cell @return array with objects
                                dataStore.selectedData.push(rowData);
                            }
                            parentRow.find("input[data-item-checker]").prop("checked", true);
                            parentRow.addClass("ct-row-active");
                            if (!$(e.target).attr("data-boolcheck")) {
                                self.listview.viewConf.raiseEvent(CWEC.ROW_CLICK, colID, colValue, rowData);
                            }
                        }
                        clicks = 0;
                    }, DELAY);
                } else {
                    clearTimeout(timer);
                    if (parentRow.hasClass("ct-row-active")) {
                        parentRow.find("input[data-item-checker]").prop("checked", false);
                        parentRow.removeClass("ct-row-active");
                    } else {
                        /* Remove existing selection */
                        if (selectionType == "ROWSINGLE" || selectionType === "SINGLE") {
                            self.ele.find("input[data-item-checker]").prop("checked", false);
                            self.ele.find("tr.ct-row-active").not($this).removeClass("ct-row-active");
                        }
                        parentRow.find("input[data-item-checker]").prop("checked", true);
                        parentRow.addClass("ct-row-active");
                        self.listview.viewConf.raiseEvent(CWEC.ROW_DBLCLICK, colID, colValue, rowData);
                    }
                    clicks = 0;
                }
            });
        }
        /**
         * Drilldown Event Handler
         */
        tRows.find("a[data-drilldown='true']").on("click", function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $this = $(this);
            var parent = $(evt.target);
            if (!$(evt.target).attr("data-item-data")) {
                parent = parent.parents("[data-item-data]");
            }
            var parentRow = parent.parent("tr");
            var colData = dataStore.getColData(parent),
                colID = dataStore.getColID(),
                colValue,
                rowData = dataStore.getRow(parentRow.data("rowindex"));
            rowData[colID] = colValue;
            self.listview.viewConf.raiseEvent(CWEC.DRILL_DOWN, colID, colValue, dataStore.modifiedData);
        });

        tRows.find("input[data-item-checker='true']").on("change", function(evt) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            $this = $(this);
            var parent = $(evt.target);
            if (!$(evt.target).attr("data-item-data")) {
                parent = parent.parents("[data-item-data]");
            }
            var parentRow = parent.parent("tr");
            var colData = dataStore.getColData(parent),
                colID = dataStore.getColID(),
                colValue,
                rowData = dataStore.getRow(parentRow.data("rowindex"));
            if ($this.is(":checked")) {
                colValue = "true";
            } else {
                colValue = "false";
            }
            rowData[colID] = colValue;
            dataStore.modifiedData.push(rowData);
            self.listview.viewConf.raiseEvent(CWEC.DATA_MOD, colID, colValue, dataStore.modifiedData);

        });
        this.compactViewValidation();
        refs.headerDOM.find("th[data-attr=\"listColumnsDrag\"][data-colorder='true']").canvasColumnSortable();

    },
    compactViewValidation: function() {
        var scrollDetected = false,
            scrollDisabled = false;
        var id;
        var that = this;
        var parent = this.rendererData.tableWrapperCont;
        var totalContainerWidth = parent.width();
        var displayedContainerWidth = parent.find('[data-item-id=tableref]').width();
        var panLeft = parent.siblings("[data-item-id = ct_ListNavigation__" + this.rendererData.viewID + "].ct_panLeft");
        var panRight = parent.siblings("[data-item-id = ct_ListNavigation__" + this.rendererData.viewID + "].ct_panRight");
        var totalContainerLeft = parent.offset().left;
        var displayedContainerLeft = parent.find('[data-item-id=tableref]').offset().left;
        if (displayedContainerWidth > totalContainerWidth) {
            if (displayedContainerLeft == totalContainerLeft) {
                //hide left arrow
                //show right arrow
                panLeft.addClass('hidden');
                panRight.removeClass('hidden');
            } else if (displayedContainerLeft == (totalContainerLeft - displayedContainerWidth + totalContainerWidth)) {
                //hide right arrow
                //show left arrow
                panRight.addClass('hidden');
                panLeft.removeClass('hidden');
            } else {
                //show left arrow
                //show right arrow
                panLeft.removeClass('hidden');
                panRight.removeClass('hidden');
            }
            that.horizontalScrollDisplay();
        } else {
            //hide left and right arrow
            panLeft.addClass('hidden');
            panRight.addClass('hidden');
        }
        $(window).on("resize", function() {
            var totalContainerWidth = parent.width();
            var displayedContainerWidth = parent.find('[data-item-id=tableref]').width();
            var totalContainerLeft = parent.offset().left;
            var displayedContainerLeft = parent.find('[data-item-id=tableref]').offset().left;
            if (displayedContainerWidth > totalContainerWidth) {
                if (displayedContainerLeft == totalContainerLeft) {
                    //hide left arrow
                    //show right arrow
                    panLeft.addClass('hidden');
                    panRight.removeClass('hidden');
                } else if (displayedContainerLeft == (totalContainerLeft - displayedContainerWidth + totalContainerWidth)) {
                    //hide right arrow
                    //show left arrow
                    panRight.addClass('hidden');
                    panLeft.removeClass('hidden');
                } else {
                    //show left arrow
                    //show right arrow
                    panLeft.removeClass('hidden');
                    panRight.removeClass('hidden');
                }
                that.horizontalScrollDisplay();
            } else {
                //hide left and right arrow
                panLeft.addClass('hidden');
                panRight.addClass('hidden');
            }
        });

    },
    horizontalScrollDisplay: function() {

        var scrollHandle = 0,
            scrollStep = 2,
            parent = this.rendererData.tableWrapperCont;
        var that = this;

        //Start the scrolling process
        $("[data-item-id = ct_ListNavigation__" + that.rendererData.viewID + "]").on("mouseenter", function() {
            var data = $(this).data('scrollModifier'),
                direction = parseInt(data, 10);
            startScrolling(direction, scrollStep);
            $(this).addClass('active');

        });

        //Kill the scrolling
        $("[data-item-id = ct_ListNavigation__" + that.rendererData.viewID + "]").on("mouseleave", function() {
            stopScrolling();
            var totalContainerWidth = parent.width();
            var displayedContainerWidth = parent.find('[data-item-id=tableref]').width();
            var panLeft = parent.siblings("[data-item-id = ct_ListNavigation__" + that.rendererData.viewID + "].ct_panLeft");
            var panRight = parent.siblings("[data-item-id = ct_ListNavigation__" + that.rendererData.viewID + "].ct_panRight");
            var totalContainerLeft = parent.offset().left;
            var displayedContainerLeft = parent.find('[data-item-id=tableref]').offset().left;
            if (displayedContainerLeft == totalContainerLeft) {
                //hide left arrow
                //show right arrow
                panLeft.addClass('hidden');
                panRight.removeClass('hidden');
            } else if (displayedContainerLeft <= (totalContainerLeft - displayedContainerWidth + totalContainerWidth)) {
                //hide right arrow
                //show left arrow
                panRight.addClass('hidden');
                panLeft.removeClass('hidden');
            } else {
                //show left arrow
                //show right arrow
                panLeft.removeClass('hidden');
                panRight.removeClass('hidden');
            }
            $(this).removeClass('active');
        });

        //Actual handling of the scrolling
        function startScrolling(modifier, step) {
            if (scrollHandle === 0) {
                scrollHandle = setInterval(function() {
                    var newOffset = parent.scrollLeft() + (scrollStep * modifier);

                    parent.scrollLeft(newOffset);
                }, 10);
            }
        }

        function stopScrolling() {
            clearInterval(scrollHandle);
            scrollHandle = 0;
        }

    },
    /**@method  "bindListFilterHandlers"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Binds the event handlers to the filter badge in the Filter Container
     */
    bindListFilterHandlers: function(refs) {

        tbar = refs.scope.rendererData.listtbar;
        var that = this;
        this.listview.renderer.saveAsFilters();
        this.listview.renderer.createSortInfo();
        var filterBadge = tbar.find('[data-filterbadgecontainer]');
        /**
         * Code belongs to column filtering
         */
        tbar.find("[data-menus]").find("[data-submenu]").on("click", function(evt) {
            var $this = $(this),
                searchType = $this.data("submenu"),
                xtype = $this.data("xtype"),
                columnID = $this.data("colid");

            //that.tmplObj.setParams(searchType,"true");

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
                that.rendererData.tagConfig.push(opts);
                var params = that.rendererData.filterClass.getAjaxParams(cfg);
                that.rendererData.viewType != 'ADVGROUP' ?
                    that.rendererData.params.primaryfilterParams = params :
                    that.rendererData.params.setGroupFilterParams(params);
                if (params) {
                    that.rendererData.clearData();
                    if (that.rendererData.viewType == 'ADVGROUP') {
                        that.rendererData.params.initialParams.DATA_REQ_TYPE = "GRPDATA";
                        that.rendererData.params.initialParams.GROUP_FILTERS = "";
                    }
                    that.listview.ajaxCall.setInitialParams();
                    that.listview.ajaxCall.doAjax(function(data) {
                        that.listview.listData.initializeData(data);
                        that.rendererData.renderListTableWrapper(false);
                    }, this);
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
                that.rendererData.tagConfig.push(opts);
                var params = self.rendererData.filterClass.getAjaxParams(cfg);
                that.rendererData.viewType != 'ADVGROUP' ?
                    that.rendererData.params.primaryfilterParams = params :
                    that.rendererData.params.setGroupFilterParams(params);
                if (params) {
                    that.rendererData.clearData();
                    if (that.rendererData.viewType == 'ADVGROUP') {
                        that.rendererData.params.initialParams.DATA_REQ_TYPE = "GRPDATA";
                        that.rendererData.params.initialParams.GROUP_FILTERS = "";
                    }
                    that.listview.ajaxCall.setInitialParams();
                    that.listview.ajaxCall.doAjax(function(data) {
                        that.listview.listData.initializeData(data);
                        that.rendererData.renderListTableWrapper(false);
                    }, this);
                }
            } else {

                var opts = {
                    "xType": xtype,
                    "searchType": searchType,
                    "column": columnID
                };
                that.renderFilterForm(opts);

                /*				var datePickers = tbar.find("[data-enableCalender='true']");
                				if(datePrefFormat.search('YY')>-1)
                					datePrefFormat=datePrefFormat.replace("YY", "yyyy");
                				else if(datePrefFormat.search('Y')>-1)
                						datePrefFormat=datePrefFormat.replace("Y", "yy");
                				
                				if(datePickers.length > 0){
                					datePickers.datepicker({
                						autoclose: true,
                						format: datePrefFormat
                					});
                				}*/

            }

        });
        /**
         * Filter Form Enable, if its no sub menu
         */
        tbar.find("[data-menu]").on("click", function(evt) {
            $this = $(this);

            var xtype = $this.data("xtype"),
                columnID = $this.data("colid");
            var opts = {
                "xType": xtype,
                "column": columnID,
                "searchType": "contains"
            };
            that.renderFilterForm(opts);

        });
        tbar.find("[data-item-id=list_clearFilterTool]").on("click", function() {
            that.rendererData.listview.clearFilter();
        });
        tbar.find("[data-icn-action='filter']").parents("div.dropdown").on('show.bs.dropdown', function(e) {
            $(this).find("ul li").has("ul").on("mouseover", function() {
                var windowWidth = tbar.width();
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
            $('.dropdown-submenu>ul>li').on("click", function() {

                $('.dropdown').removeClass('open');
            });
        });
        that.rendererData.listHeaderCont.find("th[data-groupdrag='listGroupDrag/']").canvasDragDrop({ // remove '/'
            droppableElement: filterBadge,
            onDrop: function(obj) {
                var colID = obj.data("lbl");
                if (colID == "CONTEXT") return false;
                //var text = that.utility.getTextByColumnID(obj.find("[data-lbl]").text());
                var text = that.rendererData.headerCols[that.rendererData.headerCols.map(function(e) {
                    return e.COL_ID;
                }).indexOf(colID)].HEADER_VAL;
                var tmpl = '<div class="ct-badge__each ct-badge__each-tm">';
                tmpl += '<a href="javascript:void(0)" class="ct-badge__txt">' + text + '</a>';
                tmpl += '<a href="javascript:void(0)" data-filter-id="{{this.ID}}" class="ct-badge__action">x</a>';
                tmpl += '</div>';
                if (cbx.isEmpty(that.rendererData.params.initialParams.GROUPS)) {
                    that.rendererData.params.initialParams.GROUPS = {};
                    that.rendererData.params.initialParams.GROUPS.COLUMN_IDS = [];
                    that.rendererData.params.initialParams.GROUPS.COLUMN_IDS.push(colID);
                } else {
                    that.rendererData.params.initialParams.GROUPS.COLUMN_IDS.push(colID);
                }
                that.rendererData.clearData();
                that.rendererData.params.initialParams.DATA_REQ_TYPE = "GRPDATA";
                that.rendererData.ajaxCall.setInitialParams();
                that.rendererData.ajaxCall.doAjax(function(data) {
                    that.rendererData.listData.initializeData(data);
                    that.rendererData.renderListTableWrapper(true);
                }, that)
                return tmpl;
            }
        });
        /**
         * Filter searched tags
         */
        filterBadge.find('.ct-filterbadge').find(".ct-badge__action").off('click').on("click", function(evt) {
            evt.preventDefault();
            var id = $(this).data("filter-id");
            that.rendererData.filterClass.removeFilterIfExists(id);
            delete that.rendererData.columnValue[id];
            that.rendererData.tagConfig = $.grep(that.rendererData.tagConfig, function(data, index) {
                return data.column != id;
            });
            var params = that.rendererData.filterClass.refreshFilters();
            //if(that.compactView == false)
            //	that.updatePosition();
            //that.scrollField = true;
            //if(params){
            //	if(!params.COLUMN_COUNT){
            //		delete that.tmplObj.tmplOpts.FILTERS;
            //	}
            //}
            that.rendererData.viewType != 'ADVGROUP' ?
                that.rendererData.params.primaryfilterParams = params :
                that.rendererData.params.setGroupFilterParams(params);
            that.rendererData.clearData();
            if (that.rendererData.viewType == 'ADVGROUP') {
                that.rendererData.params.initialParams.DATA_REQ_TYPE = "GRPDATA";
                delete that.rendererData.params.initialParams.GROUP_FILTERS;
            }
            that.listview.ajaxCall.setInitialParams();
            that.listview.ajaxCall.doAjax(function(data) {
                that.listview.listData.initializeData(data);
                that.rendererData.renderListTableWrapper(false);
            }, that);
            //that.ptScope.doAjax(that.prepareParams(params));
            //}
        });
        filterBadge.find('.ct-groupbadge').find(".ct-badge__action").off('click').on("click", function(evt) {
            evt.preventDefault();
            var colID = $(this).data('group-id');
            if (that.rendererData.fieldPosInGroup.map(function(e) {
                    return e.COL_ID;
                }).indexOf(colID) >= 0) {
                var yetToLoadWarnMsg = new canvas.Dialog({
                    dialogType: "USERDEFINED",
                    dialogStyle: "OK_CANCEL",
                    message: CRB.getFWBundleValue('MANDATORY_GROUPS_MSG'),
                    title: CRB.getFWBundleValue('LBL_MESSAGE'),
                    okHandler: function() {
                        yetToLoadWarnMsg.close();
                    }
                });
                yetToLoadWarnMsg.show();
            }
        });
        filterBadge.find('.ct-filterbadge').find(".ct-badge__txt").off('click').on("click", function(e) {
            var colId = $(this).data("column");
            var searchType = $(this).data("searchtype");
            var xType = $(this).data("datatype");
            if (xType == "date" || xType == "float") {
                if (searchType != 'previous-month') {
                    tbar.find("[data-colid=" + colId + "][data-xtype=" + xType + "][data-submenu=" + searchType + "]").trigger("click");
                    tbar.find("input[name=amount_" + searchType + "]").focus();
                }
            } else {
                tbar.find("[data-colid=" + colId + "][data-xtype=" + xType + "][data-menu]").trigger("click");
                tbar.find("input#stringContains").focus();
            }
            if (!($.isEmptyObject(that.rendererData.columnValue))) {
                if (searchType == "between") {
                    var dateFrom = that.rendererData.columnValue[colId][0].value;
                    var dateTo = that.rendererData.columnValue[colId][1].value;
                    tbar.find("form div.input-group input[name='date_from']").val(dateFrom);
                    tbar.find("form div.input-group input[name='date_to']").val(dateTo);
                } else {
                    var text = that.rendererData.columnValue[colId][0].value;
                    tbar.find("form div.input-group .form-control").val(text);
                }
            }
        });
    },

    /**
     * @method 		renderFilterForm
     * @memberof 	"canvas.lib.listEventHandlerRegistry"
     * @description Renders filter form when called.
     */
    renderFilterForm: function(opts) {
        var that = this.rendererData;
        tbar = that.listtbar;
        var obj = {};
        obj["Contains"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_contains");
        obj["LessThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_LT");
        obj["GreaterThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_DT_GT");
        obj["equals"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_EQUALS");
        obj["btnSearch"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_SEARCH");
        obj["btnCancel"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_CANCEL");
        obj["field_Name"] = that.headerCols[that.headerCols.map(function(e) {
            return e.COL_ID;
        }).indexOf(opts.column)].HEADER_VAL;
        obj["placeHolderEquals"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_STR_CONST_EQUALS");
        obj["lblGreaterThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_GREATER_THAN");
        obj["lblLessThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_LESS_THAN");
        var filterParams = that.filterClass.getTemplateParams(opts.searchType);
        $.extend(filterParams, obj);
        filterParams["xType"] = that.getTmplObject(opts.xType);
        var tplLayer = new ct.lib.tmplLayer("listFilters.cttpl", filterParams);
        tplLayer.getTemplate(function(template) {
            tbar.find("form[data-filter-form]").html(template);
            this.applyFilterOpts(opts);
            this.filterFormActions(opts);
        }, this);

    },
    applyFilterOpts: function(opts) {
        var that = this.rendererData;
        tbar = that.listtbar;
        var container = tbar.find("[data-filterformcontainer]");
        if (opts.xType == "float" || opts.xType == "string") {
            if (!container.is(":visible")) {
                container.show("slow", function() {
                    tbar.find("[data-filterformcontainer]").find("input").focus();
                });
            } else {
                container.hide();
                container.show("slow", function() {
                    tbar.find("[data-filterformcontainer] input").focus();
                });
            }
        } else {
            if (!container.is(":visible")) {
                container.show();
            }
            var datePrefFormat = that.datePrefFormat;
            var datePickers = tbar.find("[data-enableCalender='true']");
            if (datePrefFormat.search('YY') > -1)
                datePrefFormat = datePrefFormat.replace("YY", "yyyy");
            else if (datePrefFormat.search('Y') > -1)
                datePrefFormat = datePrefFormat.replace("Y", "yy");

            if (datePickers.length > 0) {
                datePickers.datetimepicker({

                    format: datePrefFormat.toUpperCase()
                });
            }
        }
    },
    /**@method  "filterFormActions"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Action buttons for Filter forms
     * @opts: should pass, columnID, search type and data type
     */

    filterFormActions: function(opts) {
        var that = this;
        var listBodyCont = this.rendererData.listBodyCont;
        tbar = that.rendererData.listtbar;

        /**
         * filter form cancel handler 
         */
        tbar.find("form[data-filter-form]").find("[data-action='cancel']").on("click", function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var container = tbar.find("[data-filterformcontainer]");
            container.hide();
        });

        /**
         * filter form submit handler 
         */
        tbar.find("form[data-filter-form]").find("[data-action='submit']").on("click", function(evt) {
            evt.preventDefault();
            var formValue = tbar.find("form[data-filter-form]").serializeArray();
            var cfg = {
                "datatype": opts.xType,
                "searchtype": opts.searchType,
                "column": opts.column,
                "formData": formValue
            };
            if (opts.xType == "date" && (opts.searchType == "on" || opts.searchType == "before" || opts.searchType == "after")) {
                formValue[0].value = that.rendererData.formatDateFromInput(formValue[0].value);
            } else if (opts.xType == "date" && opts.searchType == "between") {
                formValue[0].value = that.rendererData.formatDateFromInput(formValue[0].value);
                formValue[1].value = that.rendererData.formatDateFromInput(formValue[1].value);
            }
            var params = that.rendererData.filterClass.getAjaxParams(cfg);
            that.rendererData.tagConfig = $.grep(that.rendererData.tagConfig, function(data, index) {
                return data.column != opts.column;
            });
            that.rendererData.tagConfig.push(opts);
            if (params && (opts.xType == "float" ? that.rendererData.validateFlag : true)) {
                if (that.rendererData.viewType != 'ADVGROUP') {
                    //that.updatePosition();
                    that.rendererData.params.primaryfilterParams = params;
                    that.rendererData.clearData();
                    that.rendererData.ajaxCall.setInitialParams();
                    that.rendererData.ajaxCall.doAjax(function(data) {
                        that.rendererData.listData.initializeData(data);
                        that.rendererData.renderListTableWrapper(false);
                    }, this);
                    that.rendererData.columnValue[opts.column] = formValue;
                    tbar.find("form[data-filter-form] [data-action='cancel']").trigger("click");
                } else {
                    //that.updatePosition();
                    that.rendererData.params.setGroupFilterParams(params);
                    that.rendererData.clearData();
                    if (that.rendererData.viewType == 'ADVGROUP') {
                        that.rendererData.params.initialParams.DATA_REQ_TYPE = "GRPDATA";
                        that.rendererData.params.initialParams.GROUP_FILTERS = "";
                    }
                    that.rendererData.ajaxCall.setInitialParams();
                    that.rendererData.ajaxCall.doAjax(function(data) {
                        that.rendererData.listData.initializeData(data);
                        that.rendererData.renderListTableWrapper(false);
                    }, this);
                    that.rendererData.columnValue[opts.column] = formValue;
                    tbar.find("form[data-filter-form] [data-action='cancel']").trigger("click");
                }

            } else that.setInvalidList(opts);

        });
        /**
         * Filter submit, this event catches the Enter key
         */
        tbar.find("[data-filter-form]").off('submit').on("submit", function(evt) {
            evt.preventDefault();
            tbar.find("[data-filter-form] [data-action='submit']").trigger("click");
            return false;
        });

        /**
         * Validation numbers,string only
         */
        tbar.find("input[vtype='numeric']").on("keypress", function(e) {
            var Vtype = CFVR.getVtype('AMOUNT');
            var key = e.which;
            var value = $(this).val();
            if (key == 8 || key == 0) return true;
            if (key == 13) {
                if (that.rendererData.validateFromValue(value)) {
                    that.rendererData.validateFlag = true;
                    tbar.find("form[data-filter-form] [data-action='submit']").trigger("click");
                    return true;
                } else {
                    that.rendererData.validateFlag = false;
                    tbar.find("form[data-filter-form] [data-action='submit']").trigger("click");
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
        tbar.find("input[vtype='numeric']").on("blur", function(e) {
            var value = $(this).val();
            if (that.rendererData.validateFromValue(value)) {
                that.rendererData.validateFlag = true;
            } else {

                that.rendererData.validateFlag = false;

            }

        });
    },

    /**@method  "contextActionHandler"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Handles all types of context actions.
     * 				Also takes care of the position of rendering the context action.
     */
    contextActionHandler: function(refs, that) {
        var initialise_context_flag = true;

        var menuList = that.context.getContextMenuHtml();

        if (!cbx.isEmpty(menuList)) {

            var contextContainer = refs.bodyDOM.find("[data-item-id=paging_context_menu_container]");
            if (contextContainer.length <= 0) {
                refs.bodyDOM.append($("<div />").attr("data-item-id", "paging_context_menu_container").attr("data-context-paging", "true").addClass("dropdown ct-dropdown"));
            }
            contextContainer = refs.bodyDOM.find("[data-item-id=paging_context_menu_container]");

            var metadata = that.context.viewMD;

            if (metadata.FLD_CONTEXT_ACTION_IND == 'Y' && metadata.FLD_CONTEXT_COLUMN == 'N') {
                refs.bodyDOM.find('[data-grid-records]').find('[data-grid-record]').on("contextmenu", function(e) {
                    contextAction(e);
                    /*
                     * Event for Group Context Menu Click
                     */
                    if (that.listViewMD.metadata.getViewType() == "ADVGROUP") {
                        that.rowData = that.rendererData.records[colIndex - 1];
                        that.colId = $(this).data('item-id');
                        that.colValue = that.rowData[that.colId];
                        that.listview.viewConf.raiseEvent(CWEC.GP_CONT_MENU_CLICK, that.colId, that.colValue, that.rowData);
                    }
                });
                refs.bodyDOM.find('[data-grid-records]').find('[data-grid-record]').on("click", function(e) {
                    refs.bodyDOM.find("[data-item-id=paging_context_menu_container]").hide();
                });
            }

            var hide_context_action = function() {
                if (initialise_context_flag) {
                    refs.bodyDOM.find("[data-item-id=paging_context_menu_container]").hide();
                } else {
                    initialise_context_flag = true;
                }
            }

            refs.bodyDOM.find('[data-grid-records]').find('[data-item-id=CONTEXT]').find('[data-item-action]').on("click", function(e) {
                var parent_row = $(this).closest('tr');
                /**
                 * 	Get the row id and row element
                 */
                var rowId = parent_row.data('row-id');
                var rowEle = parent_row;

                /**
                 * Prepares and sets row identifier
                 * Which will easier to get specific row data
                 */
                identifier = $(this).attr('data-item-value');
                contextContainer.data("identifier", identifier);

                var config = {
                    record: {
                        "data": rowEle
                    }, // If rowid is required instead of rowele, use rowId.
                    menuObj: contextContainer,
                    scope: refs.scope
                };

                that.clickInsideContextHandler(e, this, config);
            });

            refs.bodyDOM.find('[data-grid-records]').find('[data-icon-action=context]').on("click", function(e) {
                initialise_context_flag = false;
                contextAction(e);
                hide_context_action();
                e.stopPropagation();
            });

            refs.bodyDOM.on("click", function() {
                hide_context_action();
            });

            var contextAction = function(e) {
                e.preventDefault();
                $(that.ele).find("ul[data-context=\"submenu\"]").hide();
                contextContainer.html($(menuList));
                refs.bodyDOM.find("[data-item-id=paging_context_menu_container]").show();

                /**
                 * 	Get the row id and row element
                 */
                var rowId = $(this).data('row-id');
                var rowEle = $(this);

                /**
                 * Prepares and sets row identifier
                 * Which will easier to get specific row data
                 */
                identifier = $(this).attr('data-item-value');
                contextContainer.data("identifier", identifier);

                /**
                 * Update position of Context menu
                 */
                setContextMenu(e, contextContainer);
                contextContainer.children().show();
                /**
                 * Show/Hide sub menus
                 */
                contextContainer.find("li").has("ul").on("mouseover", function() {
                    $(this).children("ul").show();
                }).on("mouseout", function() {
                    $(this).children("ul").hide();
                });

                var config = {
                    record: {
                        "data": rowEle
                    }, // If rowid is required instead of rowele, use rowId.
                    menuObj: contextContainer,
                    scope: refs.scope
                };

                contextContainer.find("li > a").on("click", function(e) {
                    that.clickInsideContextHandler(e, this, config);
                });
                return false;
            }

            var setContextMenu = function(e, contextContainer) {
                var mouseX = e.clientX,
                    mouseY = e.clientY,
                    boundsX = $(window).width(),
                    boundsY = $(window).height(),
                    menuWidth = contextContainer.find('.dropdown-menu').outerWidth(),
                    menuHeight = contextContainer.find('.dropdown-menu').outerHeight(),
                    top, left;
                if (mouseY + menuHeight > boundsY) top = mouseY - menuHeight + $(window).scrollTop();
                else top = mouseY + $(window).scrollTop();
                if ((mouseX + menuWidth > boundsX) && ((mouseX - menuWidth) > 0)) {
                    // Right side alignment fix
                    contextContainer.find("li ul").css({
                        "right": "100%",
                        "left": "initial"
                    });
                    left = mouseX - menuWidth + $(window).scrollLeft();
                } else {
                    // Left side alignment fix
                    contextContainer.find("li ul").css({
                        "left": "100%",
                        "right": "initial"
                    });
                    left = mouseX + $(window).scrollLeft();
                }
                parentOffset = contextContainer.offsetParent().offset();
                left = left - parentOffset.left;
                top = top - parentOffset.top;
                contextContainer.css({
                    "left": left + "px",
                    "top": top + "px",
                    "position": "absolute"
                });
            }
        }
    },

    /**@method  "clickInsideContextHandler"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Initiates the event handlers for 
     * 				writing the events to be fired when a context action is clicked.
     */
    clickInsideContextHandler: function(e, that, config) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if ($(that).parent().children('ul').length == 0) {
            var id = $(that).data("context-id");
            id = $.trim(id);
            var value = $(that).html();
            $("div[data-context-paging='true']").find("ul.dropdown-menu").remove();
            CMHR.executeHandler(id, config);
            LOGGER.log("Context action selected: ", value);
        }
    },
    bindListGroupHandlers: function(config) {
        var listBodyCont = config.bodyDOM;
        var that = this;
        listBodyCont.find("tr[data-grouped-header='true']").off('click').on('click', function() {
            var gr_index = parseInt($(this).data('group-index')),
                parent_grId = $(this).data('col-id'),
                parent_rowInd = $(this).data('row-index'),
                dataType = $(this).data('type'),
                value = $(this).find('[data-header-data] [data-header-data]').text();
            var searchType = "";
            switch (dataType) {
                case "date":
                    searchType = "on";
                    break;
                case "float":
                    searchType = "equals";
                    break;
                case "string":
                    searchType = "equals";
                    break;
                default:
                    searchType = "equals";
                    break;
            }
            var opts = {
                "xType": dataType,
                "searchtype": searchType,
                "column": parent_grId
            };
            var formValue = [];
            formValue.push({
                name: dataType + " " + opts.searchType,
                value: value
            });
            var filterOpts = {
                "datatype": opts.xType,
                "searchtype": opts.searchType,
                "column": opts.column,
                "formData": formValue
            };
            var params = that.rendererData.filterClass.getAjaxParams(filterOpts);
            /*that.rendererData.tagConfig = $.grep(that.rendererData.tagConfig,function(data,index){
            	return data.column != opts.column;
            });
            that.rendererData.tagConfig.push(opts);*/

            //delete params.IS_FILTER_FORM;
            //params.GROUP_FILTERS[opts.column]=value;
            that.rendererData.renderer.row_ind = parent_rowInd;
            if (($(this).next().data('group-index') <= gr_index || cbx.isEmpty($(this).next().data('group-index'))) && ($(this).hasClass('group_collapsed'))) {

                if (params) {
                    //that.updatePosition();

                    if (gr_index < (that.rendererData.fieldPosInGroup.length - 1)) {
                        /*params = {};
                        params.DATA_REQ_TYPE =	"GRPDATA";
                        that.rendererData.params.primaryfilterParams = params;
                        //that.rendererData.clearData();
                        that.rendererData.ajaxCall.setInitialParams();
                        that.rendererData.ajaxCall.doAjax(function(data){
                        	that.rendererData.listData.initializeData(data);*/
                        var isLeaf = gr_index + 1 == that.rendererData.fieldPosInGroup.length - 1 ? true : false;
                        that.rendererData.renderGroupedRows({
                            "parentGroupId": parent_grId,
                            "parentRowInd": parent_rowInd,
                            "grpInd": gr_index + 1,
                            "isLeaf": isLeaf
                        });
                        //},that);
                    } else {
                        var groupFilters = that.getGroupFilters(parent_rowInd);
                        that.rendererData.params.initialParams['DATA_REQ_TYPE'] = "CHILDDATA"; //CHILDDATA
                        that.rendererData.params.initialParams['GROUP_FILTERS'] = groupFilters;
                        //that.rendererData.clearData();
                        that.rendererData.params.primaryfilterParams = that.rendererData.params.getGroupFilterParams();
                        that.rendererData.ajaxCall.setInitialParams();
                        that.rendererData.ajaxCall.doAjax(function(data) {
                            that.rendererData.listData.initializeData(data);
                            that.rendererData.renderBody();
                        }, that);
                    }
                    that.rendererData.columnValue[opts.column] = formValue;

                    /* Adjust the header spacing */
                    /*if(config.headerDOM.find('[data-item-header] th').filter('.spacer').length < (gr_index+1)){
                    	config.headerDOM.find('[data-item-header]').prepend("<th class='spacer' data-group-index ="+(gr_index+1)+" colspan='1'></th>")
                    }*/

                }
                /* Icon state and grouped row state changed */
                $(this).find('[data-header-data] .ct-app__tools').removeClass('flaticon-expand').addClass('flaticon-collapse');
                $(this).addClass('group_expanded').removeClass('group_collapsed');
            } else {
                if ($(this).hasClass('is_leaf')) {
                    if ($(this).nextAll('tr[ data-grouped-header="true"]').length > 0) {
                        $(this).nextUntil('tr[ data-grouped-header="true"]').remove();
                    } else {
                        $(this).nextAll('tr[data-grid-records]').remove();
                    }

                } else {
                    var strLen = parent_rowInd.toString().length;
                    var children = $(this).nextAll('tr[data-grouped-header="true"]').filter(function() {
                        var rowInd = $(this).data('row-index').toString().split("");

                        return parent_rowInd == parseInt(rowInd.splice(0, strLen).join(""));
                    }, this);
                    children.filter(".group_expanded").trigger('click');
                    children.remove();
                }

                /* Icon state and grouped row state changed */

                $(this).find('[data-header-data] .ct-app__tools').removeClass('flaticon-collapse').addClass('flaticon-expand');
                $(this).removeClass('group_expanded').addClass('group_collapsed');

                /* Adjust the header spacing */
                /*if($(this).parent().find('tr[data-group-index ='+gr_index+']').filter('.group_expanded').length <= 0){
                	config.headerDOM.find('[data-item-header]').find('th.spacer').filter(function(){
                			return parseInt($(this).attr('data-group-index')) >= gr_index;
                	},this).remove();
                }
                */
            }

        });
    },
    getGroupFilters: function(parent_rowInd) {
        parent_rowInd = parent_rowInd.toString().split("");
        var groupFilters = {},
            datarecords = this.rendererData.groupedRecords;
        for (var i = 0; i < parent_rowInd.length; i++) {
            var record = datarecords[parseInt(parent_rowInd[i])].GRP_HEADER.split("::::");
            var colID = record[0];
            var colValue = record[1];
            groupFilters[colID] = colValue;
            datarecords = datarecords[parseInt(parent_rowInd[i])].CHILD;
        }
        return JSON.stringify(groupFilters);
    },
    bindListFooterHandlers: function(config) {

    },
    /**
     * @method 		checkLoadMore
     * @memberof 	"canvas.lib.listEventHandlerRegistry"
     * @description Checks if Load more is required for the particular grid, else it removes it.
     */
    checkLoadMore: function(that) {
        if (((that.totalRows.length >= that.recordsCount) || (cbx.isEmpty(that.records))) && (that.viewType == 'PAGING')) {
            that.listBodyCont.find("[data-item-id=load-more]").remove();
        }
        if (that.viewType == 'LIST') {
            this.enablePaginator(that);
        }
    },

    /**
     * @method 		enablePaginator
     * @memberof 	"canvas.lib.listEventHandlerRegistry"
     * @description In case of Live grid, this method checks if there are any records present 
     * 				before/after this page. If no, it disables the respective previous/next buttons 
     * 				to stop the traversal.
     */
    enablePaginator: function(that) {
        if (that.params.actionParams.currentPage * that.perPage >= that.recordsCount) {
            that.listBodyCont.find("[data-item-id=load-more]").addClass("hidden");
            that.listBodyCont.find("[data-item-id=load_next]").addClass("hidden");
        } else {
            that.listBodyCont.find("[data-item-id=load-more]").removeClass("hidden");
            that.listBodyCont.find("[data-item-id=load_next]").removeClass("hidden");
        }
        if (that.params.actionParams.currentPage == 1) {
            that.listBodyCont.find("[data-item-id=load_prev_parent]").addClass("hidden");
        } else {
            that.listBodyCont.find("[data-item-id=load-more]").removeClass("hidden");
            that.listBodyCont.find("[data-item-id=load_prev_parent]").removeClass("hidden");
        }
    },
    /**
     * @method 		defaultEventHandler
     * @memberof 	"canvas.lib.listEventHandlerRegistry"
     * @description Event to handle the click on the load more record.
     * 				(Load more for paging and previous and next in case of live grid.
     */
    defaultEventHandler: function(that) {
        that.listBodyCont.find("[data-item-id=load-more]").find("[data-item-id=load_more] span").off('click').on('click', function(evt) {
            $this = $(this);
            var pageNo = that.getParamValue("currentPage");
            if ((that.perPage * pageNo) < that.listData.actualTotalCount) {
                //$this.parents().find("tr.load-more").removeClass("hidden");
                that.params.updateAddParams("start", that.utility.recordsFrom(pageNo + 1, that.perPage) - 1);
                that.ajaxCall.setInitialParams();
                that.ajaxCall.doAjax(that.renderLoadMoreData, that);
                pageNo++;
                //that.updatedRecords=(that.perPage * pageNo)>that.recordsCount?that.recordsCount:(that.perPage * pageNo);
                //that.listFooterCont.find("td div span[data-item-id=ct_pagingFoot_to]").html(that.updatedRecords);
                $this.parentsUntil('tr[data-item-id=load-more]').parent().remove();
                that.params.updateAddParams("currentPage", pageNo);
            } else {
                $this.parentsUntil('tr[data-item-id=load-more]').parent().remove();
            }
        });
        that.listBodyCont.find("[data-item-id=load-more]").find("[data-item-id=load_next]").off('click').on('click', function(evt) {
            $this = $(this);
            var pageNo = that.getParamValue("currentPage");
            if ((that.perPage * pageNo) < that.listData.actualTotalCount) {
                var prevRecords = $this.parentsUntil('[data-item-id=ct_listBody]').parent()[0];
                //$(prevRecords).empty();
                that.clearData();
                that.params.updateAddParams("start", that.utility.recordsFrom(pageNo + 1, that.perPage) - 1);
                that.ajaxCall.setInitialParams();
                that.ajaxCall.doAjax(that.renderLoadMoreData, that);
                pageNo++;
                that.params.updateAddParams("currentPage", pageNo);
            }
        });
        that.listBodyCont.find("[data-item-id=load-more]").find("[data-item-id=load_prev]").off('click').on('click', function(evt) {
            $this = $(this);
            var pageNo = that.getParamValue("currentPage");
            if (pageNo > 1) {
                var prevRecords = $this.parentsUntil('[data-item-id=ct_listBody]').parent()[0];
                //$(prevRecords).empty();
                that.clearData();
                that.params.updateAddParams("start", that.utility.recordsFrom(pageNo - 1, that.perPage) - 1);
                that.ajaxCall.setInitialParams();
                that.ajaxCall.doAjax(that.renderLoadMoreData, that);
                pageNo--;
                that.params.updateAddParams("currentPage", pageNo);
            }
        });
    },

    /**@method  "refreshHeader"
     * @memberof "canvas.lib.listEventHandlerRegistry"
     * @description Sets the header icons to the initial stage when list body is refreshed
     */
    refreshHeader: function(headerDOM) {
        headerDOM.find("th [data-ct-input=\"rowexpand-All\"]").data("mode", "expandAll").removeClass("ct-row-collapse flaticon-minus").addClass("ct-row-expand flaticon-add");
        headerDOM.find("input[data-item-checker]").prop("checked", false);
    },

    /**
     * Thows error message if value does not satisfy validation criteria for filter inputs
     */
    setInvalidList: function(opts) {
        var that = this.rendererData;
        tbar = that.listtbar;
        if (opts.xType == "date" && opts.searchType == "between") {
            tbar.find("#datepicker").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "last-n-days") {
            tbar.find(".input-dateon-error").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "last-n-months") {
            tbar.find(".input-dateon-error").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "float" && opts.searchType == "equals" || opts.searchType == "lesser" || opts.searchType == "greater") {
            tbar.find(".input-submenu-error").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_AMOUNT"));
        } else if (opts.xType == "string") {
            tbar.find(".input-string-validate").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_FIELD"));
        } else if (opts.xType == "date" && opts.searchType == "on") {
            tbar.find(".input-dateon-error").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "before") {
            tbar.find(".input-dateon-error").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        } else if (opts.xType == "date" && opts.searchType == "after") {
            tbar.find(".input-dateon-error").addClass('has-error');
            tbar.find("span[type='Error_Msg'].ct-form__err").removeClass('hidden').addClass('show').tooltip();
            tbar.find("span[type=Error_Msg]").attr('data-original-title', iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "ERR_INVALID_DATE"));
        }
    }
});
