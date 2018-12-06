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
/**
 * ===============================================================================================
 * CHANGE CODE 		AUTHOR 				DESCRIPTION 									   DATE
 *  JQTBS01 		ArunKumar Sekar 	Creating initial Event Handlers					20-02-2015
 * ===============================================================================================
 */
cbx.ns("canvas.lib");
/**
 * @className : canvas.lib.listEventHandlers
 * @description: Handles list view filters. <BR>
 * 
 */

canvas.lib.listEventHandlers = function(config) {

    this.scope = config.scope;
    this.md = config.MD;
    this.parentCt = this.scope.elem;
    this.tblHeader = config.header;
    LOGGER.log("List Event Handler Initiated", this.parentCt);
    var $tbl = this.parentCt.find("table");

    /**
     * returns the selectionType
     */
    this.getEventSelectionType = function() {
        return this.scope.listViewMD.FLD_SELECTION_TYPE;
    };
    /**
     * create and returns event helper object
     */
    this.getEventHelper = function(element) {
        return new eventHelpers(element);
    };

    var me = this;
    var eventHelpers = function($this) {

        this.data = null;

        this.getParams = function() {
            if (!$this) return false;
            try {
                this.data = $this.data("item-data").split("|");
            } catch (e) { /* Do nothing */ }
        };
        this.setData = function(value) {
            this.data = $.trim(value).split("|");
        };
        this.initialize = function(tdEle) {
                this.data = tdEle.data("item-data").split("|");
            },

            this.getColID = function() {
                return this.data[0];
            };

        this.getIndex = function() {
            return parseInt(this.data[1]);
        };

        this.getColValue = function() {
            var index = this.getIndex();
            return me.md[index][this.getColID()];
        };

        this.getRow = function() {
            var index = this.getIndex();
            var row = cbx.clone(me.md[index]);
            row.rowIndex = index
            return row;
        };
        this.updateSelectedData = function(type, obj, addItem) {
            var colID = obj.key,
                colValue = obj.value;
            if (type == "row") {
                if (!cbx.isEmpty(me.scope.selectedData)) {
                    if (cbx.isArray(me.scope.selectedData)) {
                        var len = me.scope.selectedData.length;
                        for (var i = 0; i < len; i++) {
                            if (cbx.isObject(me.scope.selectedData[i])) {
                                if (me.scope.selectedData[i][colID] == colValue) {
                                    me.scope.selectedData.removeAt(i);
                                    break;
                                }
                            }
                        }
                    } else me.scope.selectedData = {};
                }
            } else if (type == "cell") {
                if (addItem == true) {
                    if (!cbx.isEmpty(me.scope.selectedData)) {
                        var len = me.scope.selectedData[0].length,
                            dataObj = me.scope.selectedData[0];
                        var exists = false;
                        for (var key in dataObj) {
                            if (dataObj.hasOwnProperty(colID)) {
                                dataObj[colID].push(colValue);
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            dataObj[colID] = [colValue];
                        }
                    } else {
                        var obj = {};
                        obj[colID] = [colValue];
                        me.scope.selectedData.push(obj);
                    }
                    return true;
                } else {
                    var len = me.scope.selectedData[0].length,
                        dataObj = me.scope.selectedData[0];
                    for (var key in dataObj) {
                        if (dataObj.hasOwnProperty(colID)) {
                            if (dataObj[colID].length > 1) {
                                dataObj[colID].removeAt(dataObj[colID].getIndexOf(colValue));
                                break;
                            } else {
                                delete dataObj[colID];
                                break;
                            }
                        }
                    }
                    return;
                }
            }
        };
        this.getParams();
    };

    /* Context app starts */

    var layoutId = iportal.workspace.metadata.getLayoutManager().currentConfig.LAYOUT_ID;

    var defaultWidgetInd = this.scope.renderer.ptScope.parentPortlet.DEFAULT_WIDGET_IND;

    if (defaultWidgetInd === "Y") {
        var DELAY = 200,
            clicks = 0,
            timer = null;

        if (!$('.ct-listview.ct-listview-tm tbody').children().hasClass('ct-row-active')) {
            var parent = $tbl.find("tbody tr[data-grid-records]:first-child td:first-child");
            if (!$(parent).attr("data-item-data")) {
                parent = parent.parents("[data-item-data]");
            }
            var data = new eventHelpers(parent),
                colID = data.getColID(),
                colValue = data.getColValue(),
                rowData = data.getRow();
            me.scope.selectedData = rowData;
            $(parent.parent()).addClass("ct-row-active");
            me.scope.viewConf.raiseEvent(CWEC.SINGLE_CLICK, rowData, colID, colValue);
        }

        $tbl.find("tbody tr[data-grid-records]").on("click", function(e, spanObj, contextclicks) {
            $this = $(this);
            var parent;
            if (spanObj) {
                parent = spanObj;
                clicks = contextclicks;
            } else {
                parent = $(e.target);
            }
            if (!$(parent).attr("data-item-data")) {
                parent = parent.parents("[data-item-data]");
            }
            var data = new eventHelpers(parent),
                colID = data.getColID(),
                colValue = data.getColValue(),
                rowData = data.getRow();
            clicks++;
            if (clicks === 1) {
                timer = setTimeout(function() {
                    if (!($this.hasClass("ct-row-active"))) {
                        /* Remove existing selection */
                        $tbl.find("tbody tr.ct-row-active").not($this).removeClass("ct-row-active");
                        me.scope.selectedData = rowData;
                        $this.addClass("ct-row-active");
                        me.scope.viewConf.raiseEvent(CWEC.SINGLE_CLICK, rowData, colID, colValue);
                    }
                    clicks = 0;
                }, DELAY);
            } else {
                clearTimeout(timer);
                if (!($this.hasClass("ct-row-active"))) {} else {
                    /* Remove existing selection */
                    $tbl.find("tbody tr.ct-row-active").not($this).removeClass("ct-row-active");
                    $this.addClass("ct-row-active");
                    me.scope.viewConf.raiseEvent(CWEC.SINGLE_CLICK, rowData, colID, colValue);
                }
                clicks = 0;
            }
        });
    }

    /* Context app ends */

    var selectionType = this.getEventSelectionType();
    if (selectionType === "CELLSINGLE" ||
        selectionType === "CELLMULTI") {
        var DELAY = 200,
            clicks = 0,
            timer = null;
        $tbl.find("tbody tr[data-grid-records] td").on("click", function(e) {
                e.stopPropagation();

                $this = $(this);
                var data = new eventHelpers($this),
                    colID = data.getColID(),
                    colValue = data.getColValue(),
                    rowData = data.getRow();
                clicks++;
                if (clicks === 1) {
                    timer = setTimeout(function() {
                        if ($this.hasClass("ct-cell-active")) {
                            $this.removeClass("ct-cell-active");
                            data.updateSelectedData("cell", {
                                "key": colID,
                                "value": colValue
                            });
                        } else {
                            /* Remove existing selection */
                            if (selectionType == "CELLSINGLE") {
                                $tbl.find("tbody td.ct-cell-active").removeClass("ct-cell-active");
                                // Save selected cell @return as and array
                                me.scope.selectedData = {
                                    colID: colValue
                                };
                            } else {
                                // Save selected cell @return array with objects
                                //me.scope.selectedData.push(rowData);
                                data.updateSelectedData("cell", {
                                    "key": colID,
                                    "value": colValue
                                }, true);
                            }
                            $this.addClass("ct-cell-active");
                            me.scope.viewConf.raiseEvent(CWEC.CELL_CLICK, colID, colValue, rowData);
                            me.scope.viewConf.raiseEvent(CWEC.SINGLE_CLICK, colID, colValue, rowData);
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
                            $tbl.find("tbody td.ct-cell-active").removeClass("ct-cell-active");
                        }
                        $this.addClass("ct-cell-active");
                        me.scope.viewConf.raiseEvent(CWEC.CELL_DBLCLICK, colID, colValue, rowData);
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
        $tbl.find("tbody tr[data-grid-records]").on("click", function(e, spanObj, contextclicks) {
            $this = $(this);
            var parent;
            if (spanObj) {
                parent = spanObj;
                clicks = contextclicks;
            } else {
                parent = $(e.target);
            }
            if (!$(parent).attr("data-item-data")) {
                parent = parent.parents("[data-item-data]");
            }
            var data = new eventHelpers(parent),
                colID = data.getColID(),
                colValue = data.getColValue(),
                rowData = data.getRow();
            clicks++;
            if (clicks === 1) {
                timer = setTimeout(function() {
                    if ($this.hasClass("ct-row-active")) {
                        $this.find("input[data-item-checker]").prop("checked", false);
                        $this.removeClass("ct-row-active");
                        data.updateSelectedData("row", {
                            "key": colID,
                            "value": colValue
                        });
                    } else {
                        /* Remove existing selection */
                        if (selectionType == "ROWSINGLE" || selectionType === "SINGLE") {
                            $tbl.find("tbody input[data-item-checker]").prop("checked", false);
                            $tbl.find("tbody tr.ct-row-active").not($this).removeClass("ct-row-active");
                            me.scope.selectedData = rowData;
                        } else {
                            // Save selected cell @return array with objects
                            me.scope.selectedData.push(rowData);
                        }
                        $this.find("input[data-item-checker]").prop("checked", true);
                        $this.addClass("ct-row-active");
                        if (!$(e.target).attr("data-boolcheck")) {
                            me.scope.viewConf.raiseEvent(CWEC.ROW_CLICK, colID, colValue, rowData);
                        }
                    }
                    clicks = 0;
                }, DELAY);
            } else {
                clearTimeout(timer);
                if ($this.hasClass("ct-row-active")) {
                    $this.find("input[data-item-checker]").prop("checked", false);
                    $this.removeClass("ct-row-active");
                } else {
                    /* Remove existing selection */
                    if (selectionType == "ROWSINGLE" || selectionType === "SINGLE") {
                        $tbl.find("tbody input[data-item-checker]").prop("checked", false);
                        $tbl.find("tbody tr.ct-row-active").not($this).removeClass("ct-row-active");
                    }
                    $this.find("input[data-item-checker]").prop("checked", true);
                    $this.addClass("ct-row-active");
                    me.scope.viewConf.raiseEvent(CWEC.ROW_DBLCLICK, colID, colValue, rowData);
                }
                clicks = 0;
            }
        });
        $tbl.find("thead").find("[data-item-checker]").on("change", function(e, spanObj, contextclicks) {
            var $this = $(this);
            var rows = $tbl.find("tbody tr[data-grid-records]");
            var tBodyDOM = $tbl.find("tbody");

            var setRecordsSelected = function(rows) {
                var selDeRecords = [];
                for (var i = 0; i < rows.length; i++) {
                    var data = new eventHelpers($(rows[i]).find('[data-item-data]')),
                        colID = data.getColID(),
                        colValue = data.getColValue(),
                        rowData = data.getRow();
                    me.scope.selectedData.push(rowData);
                }
                //dataStore.updateSelectedData(selDeRecords,true,true);
                tBodyDOM.find("[data-item-checker]").prop("checked", true);
                rows.addClass("ct-row-active");
                $this[0].checked = true;
                $this.addClass('selectAll-active');
            };
            if ($this.hasClass("selectAll-active")) {
                $this.prop("checked", false);
                $this.removeClass("selectAll-active");
                rows.removeClass("ct-row-active");
                tBodyDOM.find("[data-item-checker]").prop("checked", false);
            } else {
                if ((me.scope.listViewMD.FLD_VIEW_TYPE == 'CLASSIC_GRID')) {
                    if (me.md.length <= me.scope.perPage) {
                        setRecordsSelected(rows);
                    } else {
                        var yetToLoadWarnMsg = new canvas.Dialog({
                            dialogType: "USERDEFINED",
                            dialogStyle: "OK",
                            message: CRB.getFWBundleValue('NOT_LOADED_MSG'),
                            title: CRB.getFWBundleValue('LBL_CONFIRMATION'),
                            okHandler: function() {
                                $this.prop("checked", false);
                                yetToLoadWarnMsg.close();

                            }
                        });
                        yetToLoadWarnMsg.show();
                    }
                } else if (me.scope.listViewMD.FLD_VIEW_TYPE == 'GROUP') {
                    if (tBodyDOM.find('[data-grouped-header]').find('.flaticon-expand').length > 0) {
                        var yetToLoadWarnMsg = new canvas.Dialog({
                            dialogType: "USERDEFINED",
                            dialogStyle: "OK",
                            message: CRB.getFWBundleValue('YET_TO_LOAD_MSG'),
                            title: CRB.getFWBundleValue('LBL_MESSAGE'),
                            okHandler: function() {
                                $this.prop("checked", false);
                                yetToLoadWarnMsg.close();
                            }
                        });
                        yetToLoadWarnMsg.show();
                    } else {
                        setRecordsSelected(rows);
                    }
                } else {
                    setRecordsSelected(rows);

                }

            }

        });
    }

    /**
     * Drilldown Event Handler
     */
    $tbl.find("tbody a[data-drilldown='true']").on("click", function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $this = $(this);
        var parent = $(evt.target);
        if (!$(evt.target).attr("data-item-data")) {
            parent = parent.parents("[data-item-data]");
        }
        var data = new eventHelpers(parent),
            colID = data.getColID(),
            colValue = data.getColValue(),
            rowData = data.getRow();
        me.scope.viewConf.raiseEvent(CWEC.DRILL_DOWN, colID, colValue, rowData);
    });

    /**
     *  Double click handler for group
     */

    /**
     * Data modified event handler
     */
    var viewType = me.scope.listViewMD.FLD_VIEW_TYPE;
    if (viewType === "GROUP") {
        $tbl.find("tbody").on("dblclick", function(evt) {
            me.scope.viewConf.raiseEvent(CWEC.GP_DBL_CLICK, me.md);
            LOGGER.log("data", me.md);
        });
    }

    $tbl.find("tbody tr[data-grid-records] input[data-boolcheck='true']").on("change", function(evt) {
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        $this = $(this);
        var parent = $(evt.target);
        if (!$(evt.target).attr("data-item-data")) {
            parent = parent.parents("[data-item-data]");
        }
        var data = new eventHelpers(parent),
            colID = data.getColID(),
            colValue = data.getColValue(),
            rowData = data.getRow();
        if ($this.is(":checked")) {
            colValue = "true";
        } else {
            colValue = "false";
        }
        rowData[colID] = colValue;

        me.scope.modifiedData.push(rowData);
        me.scope.viewConf.raiseEvent(CWEC.DATA_MOD, colID, colValue, me.scope.modifiedData);

    });

    $tbl.find("tbody tr[data-grid-records] select[data-item-id='combolist']").on("change", function(evt) {
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();
        $this = $(this);
        var parent = $(evt.target);
        if (!cbx.isEmpty($(evt.target).val())) {
            parent = parent.parents("[data-item-data]");
        }
        var data = new eventHelpers(parent),
            colID = data.getColID(),
            colValue = data.getColValue(),
            rowData = data.getRow();

        colValue = $(evt.target).val().trim();
        rowData[colID] = colValue;
        me.scope.modifiedData.push(rowData);

        me.scope.viewConf.raiseEvent(CWEC.DATA_MOD, colID, colValue, me.scope.modifiedData);
    });

};
