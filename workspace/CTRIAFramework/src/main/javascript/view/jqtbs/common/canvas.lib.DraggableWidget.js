/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/*
 * This file is added to Enable Drag dop functionality in JQTBS. @Author: Prabursm S
 * 
 */
canvas.namespace('canvas.lib');
/**
 * @class "cbx.lib.DragDrop"
 * @description This class is responsible for Drag and Drop. This class render all the widgets in the modal widow and
 *              enabling drag and drop (DnD).
 */
canvas.lib.DraggableWidget = Class({
    /**
     * @member {Object} this
     * @memberof "cbx.lib.Dragdrop"
     * @description Enabling and attaching Dragdrop event with each objects (Widgets)
     */
    constructor: function(config) {
        this.config = config;
        config.elem.find('div[data-item-id="portlet-header"] .panel-title').off("click").on("click", $.proxy(this.initDragDrop, this));
        config.elem.find('div[data-item-id="portlet-header"] .panel-title').on("dragstart", function() {
            console.log("Drag Start");
        });
    },
    /**
     * @member {Method} initDragDrop
     * @memberof "cbx.lib.Dragdrop"
     * @description It stops default behaviour of the browser and initializes DnD.
     */
    initDragDrop: function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.getWidgetsMetadata();
        this.setModalContent();
    },
    /**
     * @member {Method} getMetadataInfo
     * @memberof "cbx.lib.Dragdrop"
     * @description this function retrives required details from metadata for widget ID
     */
    getWidgetsMetadata: function() {
        var me = this;
        me.leftWidgets = [];
        me.centerWidgets = [];
        me.rightWidgets = [];
        // Get workspace Layout
        me.workspaceLayout = cbx.core.ws.metadata.getCurrentLayout().wsMD.WORKSPACE_LAYOUT;
        // Get All the Widgets from All Child Layouts
        me.workspaceLayoutWidgets = cbx.core.ws.metadata.getLayoutsForWS(cbx.core.ws.metadata.getCurrentWorkspaceId());
        /**
         * Get Widets from DOM
         */
        var widgetContainer = $("#widgetcontainer");
        me.currentSWLayout = widgetContainer.children().attr("item_id");
        // For Left side and stack widgets
        var blockContainer = widgetContainer.find(".content-left, .STACK-COLUMN");
        blockContainer = $(blockContainer);
        blockContainer.children('[data-widgetid]').each(function(index, currentWidget) {
            currentWidget = $(currentWidget);
            var layoutId = currentWidget.attr("data-layout-id");
            var widgetId = currentWidget.attr("data-widgetid");
            var layoutWidgetMD = me.getLayoutWidgetMD(layoutId, widgetId);
            me.leftWidgets.push({
                "widgetId": widgetId,
                "widgetTitle": layoutWidgetMD[0].WGT_TITLE,
                "isMultiWidget": layoutWidgetMD[0].CONTAINER_FLAG === 'Y' ? true : false,
                "layoutId": layoutId,
                "wigetBlock": layoutWidgetMD[0].BLOCK_POSITION,
                "widgetPosition": index + 1
            });
        });
        // For Right side
        blockContainer = widgetContainer.find(".content-right");
        blockContainer = $(blockContainer);
        blockContainer.children('[data-widgetid]').each(function(index, currentWidget) {
            currentWidget = $(currentWidget);
            var layoutId = currentWidget.attr("data-layout-id");
            var widgetId = currentWidget.attr("data-widgetid");
            var layoutWidgetMD = me.getLayoutWidgetMD(layoutId, widgetId);
            me.rightWidgets.push({
                "widgetId": widgetId,
                "widgetTitle": layoutWidgetMD[0].WGT_TITLE,
                "isMultiWidget": layoutWidgetMD[0].CONTAINER_FLAG === 'Y' ? true : false,
                "layoutId": layoutId,
                "wigetBlock": layoutWidgetMD[0].BLOCK_POSITION,
                "widgetPosition": index + 1
            });
        });
        // For Center side and stack widgets
        blockContainer = widgetContainer.find(".content-center");
        blockContainer = $(blockContainer);
        blockContainer.children('[data-widgetid]').each(function(index, currentWidget) {
            currentWidget = $(currentWidget);
            var layoutId = currentWidget.attr("data-layout-id");
            var widgetId = currentWidget.attr("data-widgetid");
            var layoutWidgetMD = me.getLayoutWidgetMD(layoutId, widgetId);
            me.centerWidgets.push({
                "widgetId": widgetId,
                "widgetTitle": layoutWidgetMD[0].WGT_TITLE,
                "isMultiWidget": layoutWidgetMD[0].CONTAINER_FLAG === 'Y' ? true : false,
                "layoutId": layoutId,
                "wigetBlock": layoutWidgetMD[0].BLOCK_POSITION,
                "widgetPosition": index + 1
            });
        });
    },
    /**
     * @member {Method} getWidgetMD
     * @memberof "cbx.lib.Dragdrop"
     * @description To Sort the metadata based on position
     */
    getLayoutWidgetMD: function(layoutId, WidgetId) {
        me = this;
        var layoutMD = $.grep(me.workspaceLayoutWidgets, function(e) {
            return e.LAYOUT_ID == layoutId;
        });
        var widgetMD = $.grep(layoutMD[0].CHILD_WIDGETS, function(e) {
            return e.WIDGET_ID == WidgetId;
        });
        return widgetMD;
    },
    /**
     * @member {Method} setWidgetMD
     * @memberof "cbx.lib.Dragdrop"
     * @description To Sort the metadata based on position
     */
    setLayoutWidgetMD: function(layoutId, WidgetId, property, value) {
        me = this;
        var layoutMD = $.grep(me.workspaceLayoutWidgets, function(e) {
            return e.LAYOUT_ID == layoutId;
        });
        var widgetMD = $.grep(layoutMD[0].CHILD_WIDGETS, function(e) {
            return e.WIDGET_ID == WidgetId;
        });
        widgetMD = widgetMD[0];
        widgetMD[property] = value;
    },
    /**
     * @member {Method} sortChildWidgetByPosition
     * @memberof "cbx.lib.Dragdrop"
     * @description To Sort the metadata based on position
     */
    sortChildWidgetByPosition: function() {
        for (var layoutIndex = 0; layoutIndex < this.workspaceLayoutWidgets.length; layoutIndex++) {
            // Sorting the Widgets In Metadata As per position
            this.workspaceLayoutWidgets[layoutIndex].CHILD_WIDGETS.sort(function(app1, app2) {
                return app1.POSITION.toString().localeCompare(app2.POSITION.toString());
            });
        }
    },
    /**
     * @member {Method} setModalContent
     * @memberof "cbx.lib.Dragdrop"
     * @description this function retrives the DOM structures and prepare the modal content.
     */
    setModalContent: function() {
        /* Registeing Handlebar heplers for if else statement */
        Handlebars.registerHelper('if_eq', function(a, b, opts) {
            if (a == b) return opts.fn(this);
            else return opts.inverse(this);
        });
        var templateUrl = "dragDropModalConfig.cttpl";
        var tpl = new ct.lib.tmplLayer(templateUrl, this);
        tpl.getTemplate(this.applyTemplate, this);
    },
    /**
     * @method applyTemplate
     * @memberof cbx.lib.Dragdrop"
     * @description This method gets the template, appends it to the modal window
     */
    applyTemplate: function(template) {
        var me = this;
        var modal = CLCR.getCmp({
            "COMP_TYPE": "MODAL_WINDOW"
        });
        var modalConfig = {
            modalContent: template,
            fullscreenInd: true
        };
        this.modalObj = new modal(modalConfig, function() {
            me.attachDragDropHandlers();
        });
    },
    /**
     * @member {Method} attachDragDropHandlers
     * @memberof "cbx.lib.Dragdrop"
     * @description this funtion attaches the DnD [Drag / drop] events to DOM elements.
     *              canvas.dragdrop.Sortable.create() function is available in DnD helper class which is internally
     *              attaches the DnD events with DOM.
     */
    attachDragDropHandlers: function() {
        var me = this;
        // Left block is common for all three layouts [Stack / 2-column / 3-column ]
        canvas.dragdrop.Sortable.create(document.querySelector('[data-item-id="leftWidgets"]'), {
            group: 'canvas-dragableGroup',
            animation: 500,
            ghostClass: "dragdrop-ghost", // Class name for the drop placeholder
            chosenClass: 'dragdrop-chosen', // Class name for the chosen item
            onEnd: this.onEnd
        });
        // Right block is applicable only for 2-column / 3-column layouts
        if (this.currentSWLayout === 'TWO-COLUMN' || this.currentSWLayout === 'THREE-COLUMN') {
            canvas.dragdrop.Sortable.create(document.querySelector('[data-item-id="rightWidgets"]'), {
                group: 'canvas-dragableGroup',
                animation: 500,
                ghostClass: "dragdrop-ghost", // Class name for the drop placeholder
                chosenClass: 'dragdrop-chosen', // Class name for the chosen item
            });
        }
        // Center block is applicable only for 3-column layout
        if (this.currentSWLayout === 'THREE-COLUMN') {
            canvas.dragdrop.Sortable.create(document.querySelector('[data-item-id="centerWidgets"]'), {
                group: 'canvas-dragableGroup',
                animation: 500,
                ghostClass: "dragdrop-ghost", // Class name for the drop placeholder
                chosenClass: 'dragdrop-chosen', // Class name for the chosen item
            });
        }
        // Do Ordering
        $('#FOOTER_DIV').find('[data-button-id=save]').off("click").on("click", function(event) {
            me.doWidgetOrdering();
        });
        // Cancel the changes
        $('#FOOTER_DIV').find('[data-button-id=cancel]').off("click").on("click", function(event) {
            me.modalObj.hideModal();
            console.log(event);
        });
    },
    /*
     */
    /**
     * @member {Method} doWidgetOrdering
     * @memberof "cbx.lib.Dragdrop"
     * @description this funtion re-order the dom elements as per user dragged order in the modal Window
     */
    doWidgetOrdering: function() {
        var me = this;
        var modalWidgets;
        var layoutId;
        var WidgetId;
        modalWidgets = $('#FOOTER_DIV').find('[data-item-id="leftWidgets"]').children();
        modalWidgets.each(function(index, currentWidget) {
            currentWidget = $(currentWidget);
            layoutId = currentWidget.attr("data-layout-id");
            WidgetId = currentWidget.attr("data-widget-id");
            me.setLayoutWidgetMD(layoutId, WidgetId, "BLOCK_POSITION", "LEFT");
            me.setLayoutWidgetMD(layoutId, WidgetId, "POSITION", index + 1);
            var newWidget = $('[data-widgetid="' + WidgetId + '"]');
            var containerClass = (me.currentSWLayout==="STACK") ? ".STACK-COLUMN" : ".content-left" ;
            canvas.dragdrop.moveTo(newWidget, containerClass);
        });
        modalWidgets = $('#FOOTER_DIV').find('[data-item-id="centerWidgets"]').children();
        modalWidgets.each(function(index, currentWidget) {
            currentWidget = $(currentWidget);
            layoutId = currentWidget.attr("data-layout-id");
            WidgetId = currentWidget.attr("data-widget-id");
            me.setLayoutWidgetMD(layoutId, WidgetId, "BLOCK_POSITION", "CENTER");
            me.setLayoutWidgetMD(layoutId, WidgetId, "POSITION", index + 1);
            var newWidget = $('[data-widgetid="' + WidgetId + '"]');
            canvas.dragdrop.moveTo(newWidget, ".content-center");
        });
        modalWidgets = $('#FOOTER_DIV').find('[data-item-id="rightWidgets"]').children();
        modalWidgets.each(function(index, currentWidget) {
            currentWidget = $(currentWidget);
            layoutId = currentWidget.attr("data-layout-id");
            WidgetId = currentWidget.attr("data-widget-id");
            me.setLayoutWidgetMD(layoutId, WidgetId, "BLOCK_POSITION", "RIGHT");
            me.setLayoutWidgetMD(layoutId, WidgetId, "POSITION", index + 1);
            var newWidget = $('[data-widgetid="' + WidgetId + '"]');
            canvas.dragdrop.moveTo(newWidget, ".content-right");
        });
        me.sortChildWidgetByPosition();
        me.modalObj.hideModal();
    },
    /**
     * DnD API's are starts from Here
     */
    /**
     * @member {Method} setData
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description this function set the data on drag start and it can be retrived on dragEnd
     */
    setData: function(dataTransfer, dragEl) {
        // dataTransfer.setData('Text', dragEl.textContent);
    },
    // dragging started
    /**
     * @member {Method} onStart
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description dragging started
     */
    onStart: function( /** Event */ evt) {
        evt.oldIndex; // element index within parent
        return false;
    },
    /**
     * @member {Method} onEnd
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description dragging ended
     */
    onEnd: function( /** Event */ evt) {
    	var container = $(event.target).parent()
//    	setting the  height if  the container block  is empty
    	if(container.children().length == 0){
    		container.css("height","100px");
    	}else{
    		container.css("height","");
    	}
//    	setting the  height if  another containers block  are empty
    	container.siblings().each(function(index,sibling){
    		sibling = $(sibling);
			if(sibling.children().length == 0){
				sibling.css("height","100px");
			}else{
				sibling.css("height","");
			}
		});
    	
    },
    /**
     * @member {Method} onAdd
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description Element is dropped into the list from another list
     */
    onAdd: function( /** Event */ evt) {
        var itemEl = evt.item; // dragged HTMLElement
        evt.from; // previous list
        // + indexes from onEnd
    },
    /**
     * @member {Method} onUpdate
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description Changed sorting within list
     */
    onUpdate: function( /** Event */ evt) {
        var itemEl = evt.item; // dragged HTMLElement
        // + indexes from onEnd
    },
    /**
     * @member {Method} onSort
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description Called by any change to the list (add / update / remove)
     */
    onSort: function( /** Event */ evt) {
        // same properties as onUpdate
    },
    /**
     * @member {Method} onRemove
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description Element is removed from the list into another list
     */
    onRemove: function( /** Event */ evt) {
        // same properties as onUpdate
    },
    /**
     * @member {Method} onFilter
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description Attempt to drag a filtered element
     */
    onFilter: function( /** Event */ evt) {
        var itemEl = evt.item; // HTMLElement receiving the `mousedown|tapstart` event.
    },
    /**
     * @member {Method} onMove
     * @memberof "cbx.lib.Dragdrop"
     * @scope private
     * @description Event when you move an item in the list or between lists
     */
    onMove: function(evt) {
        evt.dragged; // dragged HTMLElement
        evt.draggedRect; // TextRectangle {left, top, right ? bottom}
        evt.related; // HTMLElement on which have guided
        evt.relatedRect; // TextRectangle
    }
});