/**
 * Copyright 2015. Intellect Design Arena Limited
 */
/**
 * TODO: Currently using view resource bundle for widget display name, required differentiation to be done
 * 		 Custom Tools display and handler
 * 		 Form Tools (Edit) handler
 * 		 On save of view, add the default view and saved view names to the switch view sub menu list
 * 		 On remove view, remove the view name from the switch view sub menu list
 * 		 Portlet Note 
 */
cbx.ns('cbx.lib');
/**
 * @class "cbx.lib.JQTBSportlet"
 * @extends "cbx.core.Component"
 * @description This class is responsible for creating portlets based on the configuration done. The portlet has header, body and footer.
 * 				Portlet header has set of app tools and the portlet title.
 * 				Portlet body has the view. 
 * 				Portlet footer has set of positive and negative BBAR buttons. 
 * @example
 * 			var portletObj= CLCR.getCmp({			
 *								'COMP_TYPE' : 'PORTLET'
 *							});
 *			
 */
cbx.lib.JQTBSportlet = Class(cbx.core.Component, {
    portletHeaderDiv: '',
    portletFooterDiv: '',
    appDiv: '',
    dateFilters: {},
    /** @constructor */
    initialize: function() {
        /**
         * @member  {Object} this
         * @memberof "cbx.lib.JQTBSportlet"
         * @description Contains the metadata of widget and view i.e the data configured in WIDGET_DEFINITION, VIEW_DEFINITION, WIDGET_DEFINITION_TOOL_PREF, VIEW_DEFINITION_TOOL_PREF,
         * WIDGET_DEFINITION_TBAR, WIDGET_DEFINITION_BBAR. The data required to build and render portlet 
         */
        var me = this;
        this.widgetId = me.WIDGET_ID;
        this.viewMd = me.md;
        /** Call massagePortletMD to massage the data*/
        this.massagePortletMD();
        /** Call checkCache to check if portlet is in app dock*/
        this.checkCache();
        /**
         * Check if initially portlet not to be rendered
         * Make ajax call to the portlet container template to get the portlet structure ready by using an object of ct.lib.tmplLayer
         * On success call creatItems method
         */
        if (this.CLOSED_IND === 'N' || !iportal.workspace.metadata.isWidgetCatalogRequired()) {
            var tmpPortletLayer = new ct.lib.tmplLayer('portletContainerTemplate.cttpl', this.viewMd);
            tmpPortletLayer.getTemplate(this.createItems, this);
        } else {
            /**
             * Initially portlet is closed, so place it in app dock
             * Create a config having widget id and widget title that to be sent to the app dock
             * Call App Dock and add this widget as icon in it
             */
            var title = '';
            var itemId = $(this.elem).data('widgetid');
            if (this.viewMd.md.VIEW_MD) {
                title = CRB.getBundleValue(this.viewMd.md.VIEW_MD.FLD_BUNDLE_KEY, this.viewMd.md.VIEW_MD.VIEW_DISPLAY_NM) ? CRB.getBundleValue(this.viewMd.md.VIEW_MD.FLD_BUNDLE_KEY, this.viewMd.md.VIEW_MD.VIEW_DISPLAY_NM) : this.viewMd.md.VIEW_MD.VIEW_DISPLAY_NM;
            } else {
                title = this.viewMd.WGT_TITLE;
            }
            var itemConfig = {
                ITEM_ID: itemId,
                ITEM_TITLE: title
            };
            var appObj = iportal.workspace.metadata.getAppDock();
            appObj.addAppItem([itemConfig]);
        }
        /** Auto call on remove event of the portlet container element */
        this.elem.on("remove", function() {
            me.destroy();
        });
    },
    /**
     * @member {Method} alterReqParams
     * @memberof "cbx.lib.JQTBSportlet"
     * @returns date filter applied
     */
    alterReqParams: function() {
        return this.dateFilters;
    },
    /**
     * @member  {Method} checkCache
     * @memberof "cbx.lib.JQTBSportlet"
     * @description To check if the portlet/widget is closed and placed in app dock while returning back from the Master(Home) screen
     */
    checkCache: function() {
        var cache = iportal.workspace.metadata.getCatalogCache();
        this.CLOSED_IND = 'N';
        for (var i = 0; i < cache.length; i++) {
            if (cache[i].WORKSPACE_ID == iportal.workspace.metadata.getCurrentWorkspaceId() && cache[i].ITEM_ID == $(this.elem).data('widgetid')) {
                this.CLOSED_IND = 'Y';
            }
        }
    },
    find: function(id, value) {
        var field = $(this.elem).find('div[' + id + '="' + value + '"]')
        if (field.length > 0 && field[0].parentCt) {
            return [field[0].parentCt];
        }
        if (field.length > 0 && field[0]) {
            return $(field);
        } else {
            return null;
        }
    },
    /**
     * @member  {Method} createItems
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method on successfully compiling the template of portlet container
     * 				Append the portlet to the portlet container 
     * 				Get the header component of the current portlet
     * 				Get the portlet header content template for the metadata passed
     */
    createItems: function(portletTemplate, portletTmpClass) {
        if (!cbx.core.isEmpty(this.elem)) {
            $(this.elem).append(portletTemplate);
            this.appDiv = $(this.elem).find('[data-item-id=portlet]');
            /** Check if portlet is required */
            if (this.PORTLET_REQ) {
                /** If portlet required proceed to create portlet header */
                this.portletHeaderDiv = $(this.elem).find('[data-item-id=portlet-header]');
                if (!cbx.core.isEmpty(this.portletHeaderDiv)) {
                    var tmpHeaderLayer = new ct.lib.tmplLayer('portletHeaderTemplate.cttpl', this.viewMd);
                    tmpHeaderLayer.getTemplate(this.applyHeaderTemplate, this);
                }
            } else {
                /**
                 * If portlet is not required (portlet header)
                 * check if current app is multiapp, if yes call multiapp else render view within the portlet body
                 */
                if (this.CONTAINER_FLAG === 'N') {
                    this.renderPortletView();
                } else {
                    this.callMultiapp();
                }
            }
            this.addItem(this.elem[0]);
        }
    },
    /**
     * @member  {Method} callMultiapp
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method that calls the multiapp to proceed with the multi app layout 
     */
    callMultiapp: function() {
        var parentPortlet = this;
        if (this.parentPortlet) {
            parentPortlet = this.parentPortlet;
        }
        var config = {
            layout: this.md.md.MULTI_WIDGET_MD.LAYOUT,
            CHILD_WIDGETS: this.md.md.CHILD_WIDGETS,
            WIDGET_ID: this.WIDGET_ID,
            parentElem: $(this.elem).find('[data-item-id=portlet-body]').find('[data-item-id=portlet-main-content]'),
            parentPortlet: parentPortlet
        };
        new canvas.lib.multiapp(config);
    },
    /**
     * @member  {Method} applyHeaderTemplate
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method on successfully compiling the template of portlet header
     * 				Append the portlet header content to the portlet header div 
     * 				Call bootstrap tooltip to apply tool tips on app tools
     * 				Call setAppToolsHandlers to register the handlers for all the app tools
     * 				Call updatePortletHeaderFooter to enable or disable app tools and update the portlet title
     * 				If BBARs are configured, create portlet footer with BBARs
     */
    applyHeaderTemplate: function(headerTemplate, headerTmpClass) {
        if (!cbx.core.isEmpty(this.portletHeaderDiv)) {
            $(this.portletHeaderDiv).append(headerTemplate);
            $(this.elem).find('[data-toggle="tooltip"]').tooltip();
            this.setAppToolsHandlers();
        }
        if (this.CONTAINER_FLAG === 'N' || cbx.isEmpty(this.CONTAINER_FLAG)) {
            this.renderPortletView();
        } else {
            this.callMultiapp();
        }
        /*
         * To Enable Drag and drop instantiate the following class
         */
        if (this.dragdropObject == undefined) {
            this.dragDropObject = new canvas.lib.DraggableWidget(this);
        }
    },
    /**
     * @member {Method} preRenderView
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to pre-render a view
     */
    preRenderView: function() {
        if (this.viewMd.GLOBAL_DATE_FILTER) {
            this.renderGlobalDateFilter();
        }
        this.renderTBar();
    },
    /**
     * @member  {Method} renderPortletView
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to render view within portlet body
     */
    renderPortletView: function() {
        var that = this;
        that.preRenderView();
        setTimeout(function() {
            var renderEle = $(that.elem).find('[data-item-id=portlet-body]').find('[data-item-id=portlet-main-content]');
            var config = {
                md: that.viewMd,
                viewConf: that.viewConf,
                rb: that.rb,
                elem: renderEle,
                portlet: that
            };
            that.viewConf.renderView.apply(that.viewConf, [config]);
            that.showHideFooter();
        }, 1000);
    },
    /**
     * @member {Method} refreshView
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to refresh the view of a list widget 
     */
    refreshView: function(md) {
        var that = this;
        this.viewMd.md.VIEW_MD = md.VIEW_MD;
        this.viewMd.md.CONTEXT_MENU_LIST = md.CONTEXT_MENU_LIST;
        this.viewMd.md.VIEWS_LIST = md.VIEWS_LIST;
        this.viewMd.md.VIEW_ADDL_MD = md.VIEW_ADDL_MD;
        this.WIDGET_ID = md.WIDGET_ID;
        if (this.viewConf.parentPortlet && this.viewConf.parentPortlet.CONTAINER_FLAG == "Y") {
            this.viewConf.parentPortlet.md.md.CHILD_WIDGETS.filter(function(el) {
                if (el.WIDGET_ID == that.WIDGET_ID) {
                    el.VIEWS_LIST = md.VIEWS_LIST;
                }
            });
        }
        this.massagePortletMD();
        this.renderPortletView();
    },
    /**
     * @member {Method} updateMenuForPref
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to update menu for preferences
     */
    updateMenuForPref: function(dom) {
        console.log(dom);
        var viewId = this.renderer.md.getViewId();
        var viewsList = this.renderer.md.getViewsList();
        var ulDom = dom.parent().find("ul");
        ulDom.find("[data-action-id='switchViewDropdown'] ul").empty();
        ulDom.find("[data-item-id='portlet_updateTool']").parent().removeClass("hidden");
        ulDom.find("[data-item-id='portlet_removeTool']").parent().removeClass("hidden");
        ulDom.find("[data-item-id='portlet_switchTool']").parent().removeClass("hidden");
        ulDom.find('[data-item-id="portlet_revertTool"]').attr("data-view-id", viewId);
        ulDom.find('[data-item-id="portlet_removeTool"]').attr("data-view-id", viewId);
        ulDom.find('[data-item-id="portlet_updateTool"]').attr("data-view-id", viewId);
        var switchViewDom = ulDom.find("[data-action-id='switchViewDropdown'] ul");
        var li = "";
        var defaultClass = "";
        if (this.renderer.parentPortlet && this.renderer.parentPortlet.CONTAINER_FLAG == "Y" && this.renderer.parentPortlet.md.md.MULTI_WIDGET_MD.LAYOUT == "SWITCH") {
            for (var i = 0; i < this.renderer.parentPortlet.md.md.CHILD_WIDGETS.length; i++) {
                for (var j = 0; j < this.renderer.parentPortlet.md.md.CHILD_WIDGETS[i].VIEWS_LIST.length; j++) {
                    if (this.renderer.parentPortlet.md.md.CHILD_WIDGETS[i].VIEWS_LIST[j].DEFAULT_VIEW_IND == "Y") {
                        defaultClass = "flaticon-default";
                    } else {
                        defaultClass = "ct-not_sys_view_id";
                    }
                    li += "<li><span class=" + defaultClass + "><a data-id='submenu-switch-child' data-toggle='dropdown' href='javascript:void(0)' data-widget-id=" + this.renderer.parentPortlet.md.md.CHILD_WIDGETS[i].WIDGET_ID + " data-view-id=" + this.renderer.parentPortlet.md.md.CHILD_WIDGETS[i].VIEWS_LIST[j].VIEW_ID + ">" + this.renderer.parentPortlet.md.md.CHILD_WIDGETS[i].VIEWS_LIST[j].VIEW_DISPLAY_NM + "</a></span></li>";
                }
            }
        } else {
            for (var j = 0; j < viewsList.length; j++) {
                if (this.renderer.md.getSystemViewId() == viewsList[j].VIEW_ID) {
                    defaultClass = "flaticon-default";
                } else {
                    defaultClass = "ct-not_sys_view_id";
                }
                li += "<li><span class=" + defaultClass + "><a data-id='submenu-switch-child' data-toggle='dropdown' href='javascript:void(0)' data-widget-id=" + this.widgetId + " data-view-id=" + viewsList[j].VIEW_ID + ">" + viewsList[j].VIEW_DISPLAY_NM + "</a></span></li>";
            }
        }
        switchViewDom.append(li);
    },
    /**
     * @member  {Method} renderGlobalDateFilter
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to render Global Date Filter within portlet body
     */
    renderGlobalDateFilter: function() {
        var that = this;
        var renderEle = $(this.elem).find('[data-item-id=portlet-body]').find('[data-item-id=portlet-global-date]');
        var config = {
            md: this.viewMd,
            elem: renderEle,
            portlet: that
        };
        this.renderGlobalDate.apply(this.viewConf, [config]);
    },
    /**
     * @member  {Method} renderTBar
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to render TBar within portlet body
     */
    renderTBar: function() {
        var that = this;
        var renderEle = $(this.elem).find('[data-item-id=portlet-body]').find('[data-item-id=portlet-tbar]');
        var config = {
            md: this.viewMd,
            elem: renderEle
        };
        this.viewConf.renderToolBar.apply(this.viewConf, [config]);
    },
    /**
     * @member {Method} applyDateFilter
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to filter data with respect to date
     */
    applyDateFilter: function(values, reload) {
        var fromDate, toDate;
        if ("Y" === values.FILTER_RADIO1 && values.FILTER_COMBO) {
            var dateDetails = values.FILTER_COMBO.split("|");
            fromDate = dateDetails[0];
            toDate = dateDetails[1];
        } else if ("Y" === values.FILTER_RADIO2) {
            fromDate = values.FILTER_FROMDATE;
            toDate = values.FILTER_TODATE;
        }
        var params = {};
        params["FILTER" + "_DATE" + "_FIELD"] = values.COLUMN_ID;
        params["FILTER" + "_DATE" + "_CONSTRAINT"] = "range";
        params["FILTER" + "_DATE" + "_VALUE_TXT"] = "";
        params["FILTER" + "_DATE" + "_VALUE_DATE"] = iportal.jsutil.convertDateValueToUserPreferedFmt(fromDate);
        params["FILTER" + "_DATE" + "_VALUE_DATE2"] = iportal.jsutil.convertDateValueToUserPreferedFmt(toDate);
        params["FILTER" + "_DATE" + "_VALUE_TIME"] = "";
        params["FILTER" + "_DATE" + "_VALUE_TIME2"] = "Select";
        params["COLUMN_VALUE"] = "_DATE";
        params["IS_DATE_FILTER_FORM"] = true;
        if (reload) {
            this.parentPortlet.dateFilters = params;
            this.clearDateFilter(false);
            this.parentPortlet.renderer.refresh();
        } else {
            this.parentPortlet.dateFilters = params;
        }
    },
    /**
     * @member {Method} clearDateFilter
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to clear date filter
     */
    clearDateFilter: function(reload) {
        if (reload) {
            this.parentPortlet.dateFilters = {};
            this.parentPortlet.renderer.refresh();
        }
    },
    /**
     * @member  {Method} hideHeader
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to hide the portlet header
     */
    hideHeader: function() {
        $(this.elem).find('[data-item-id=portlet-header]').removeClass('show').addClass('hidden');
    },
    /**
     * @member  {Method} hideFooter
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to be called in order to hide the portlet footer
     */
    hideFooter: function() {
        $(this.elem).find('[data-item-id=portlet-footer]').removeClass('show').addClass('hidden');
    },
    /**
     * @member  {Method} applyFooterTemplate
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method on successfully compiling the template of portlet footer
     * 				Append the portlet footer content to the portlet footer div 
     * 				Call setAppBBARHandlers to register the handlers for all the BBAR buttons in the portlet footer
     */
    applyFooterTemplate: function(footerTemplate, footerTmpClass) {
        if (!cbx.core.isEmpty(this.portletFooterDiv)) {
            $(this.portletFooterDiv).append(footerTemplate);
            this.setAppBBARHandlers();
        }
    },
    /**
     * @member {Method} updateMenuForChart
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API for update menu - chart
     */
    updateMenuForChart: function(dom) {
        dom.parent().next('ul').empty();
        var UlChild = ''
        var chartList = this.renderer.getChartTypes();
        var that = this;
        var UlChartChild = '';
        UlChild += '<a data-item-id="portlet_SWITCH_TO_GRID" href="javascript:void(0)">'
        UlChild += '<span class="ct-app__tool-chart flaticon-default_grid"></span> '
        UlChild += '<span class="ct-dropdown-menu-txt">Switch to Grid View</span></a>'
        UlChild += '<a data-item-id="portlet_SWITCH_TO_CHART" href="javascript:void(0)">'
        UlChild += '<span class="ct-app__tool-chart flaticon-barsgraphic"></span> '
        UlChild += '<span class="ct-dropdown-menu-txt">Switch to Chart View</span></a>'
        for (var i = 0; i < chartList.length; i++) {
            var dimension = chartList[i].slice(-2).toUpperCase();
            if ((dimension == '2D') || (dimension == '3D')) {
                var chartType = chartList[i].substring(0, chartList[i].length - 2);
            } else {
                var chartType = chartList[i];
                dimension = "";
            }
            UlChartChild += '<a data-item-id=portlet_' + chartList[i] + ' href="javascript:void(0)">';
            UlChartChild += '<span class="ct-app__tool-chart flaticon-bat-chart_up"></span>'
            UlChartChild += '<span data-item-id=' + chartList[i] + ' class="ct-dropdown-menu-txt">' + CRB.getFWBundleValue("TOOLTIP_" + chartType.toUpperCase()) + " " + dimension + '</span></a>';
        }
        dom.parent().next('ul').append(UlChild).append(UlChartChild);
        chartList.push('SWITCH_TO_CHART');
        chartList.push('SWITCH_TO_GRID');
        for (var i = 0; i < chartList.length; i++) {
            $(this.elem).find("[data-item-id=portlet_" + chartList[i] + "]").on('click', function(e) {
                var chartType = $(this).attr("data-item-id");
                chartType = chartType.replace("portlet_", "");
                if (chartType == "SWITCH_TO_GRID") {
                    that.renderer.disposeAvailable();
                    that.renderer.loadGrid();
                } else if (chartType == "SWITCH_TO_CHART") {
                    for (var i = 0; i < chartList.length; i++) {
                        if (chartList[i] == chartType) chartType = chartList[i];
                    }
                    that.renderer.constructor(that.renderer.config);
                } else {
                    that.renderer.disposeAvailable();
                    for (var i = 0; i < chartList.length; i++) {
                        if (chartList[i] == chartType) chartType = chartList[i];
                    }
                    that.renderer.config.md.md.VIEW_MD.FLD_CHART_TYPE = chartType;
                    that.renderer.switchChart(that.renderer.config);
                }
            });
        }
    },
    /**
     * @member  {Method} setAppBBARHandlers
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method to register the handlers for the BBAR buttons based on their system indicator
     * 				Get the view business data using getSelectedData() method of specific view
     * 				Call getHanlder method of CWSBHF global variable if SYSTEM_IND is 'Y' with params - current view reference and the view business data
     * 				Call raiseEvent() for this view  if SYSTEM_IND is 'N' with params - CWEC.BBUT_CLICK event and the view business data
     */
    setAppBBARHandlers: function() {
        var that = this;
        $(this.elem).find('a[system_btn_ind=Y]').unbind("click").bind('click', that, function(e) {
            var wgtViewData = '';
            var wgtViewModifiedData = '';
            if (that.renderer.getSelectedData) wgtViewData = that.renderer.getSelectedData();
            if (that.renderer.getModifiedData) wgtViewModifiedData = that.renderer.getModifiedData();
            var fn = CWSBHF.getHandler($(this).attr('data-item-id'));
            if (cbx.core.isFunction(fn)) {
                fn.apply(this, [that.renderer, wgtViewData, wgtViewModifiedData]);
            }
        });
        $(this.elem).find('a[system_btn_ind=N]').unbind("click").bind('click', that, function(e) {
            var wgtViewData = '';
            var wgtViewModifiedData = '';
            if (that.renderer.getSelectedData) wgtViewData = that.renderer.getSelectedData();
            if (that.renderer.getModifiedData) wgtViewModifiedData = that.renderer.getModifiedData();
            that.renderer.portlet.viewConf.raiseEvent(CWEC.BBUT_CLICK, $(this).attr('data-item-id'), wgtViewData, wgtViewModifiedData);
        });
    },
    /**
     * @member {Method} handleCustomToolsAction
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to handle custom tool actions
     */
    handleCustomToolsAction: function(customMD) {
        var config = {
            'customMD': customMD,
            'widgetMD': this.viewConf,
            'viewMD': this.viewMd.md.VIEW_MD
        }
        CACTH.executeHandler(customMD.MENU_ID, config);
    },
    /**
     * @member {Method} getCustomToolsMenu
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to get custom tools menu
     */
    getCustomToolsMenu: function(customMD, menuDOM) {
        var that = this;
        if (!cbx.isEmpty(customMD.child_nodes) && (customMD.child_nodes.length > 0)) {
            $(menuDOM).addClass('dropdown dropdown-submenu');
            $(menuDOM).find('a').addClass('dropdown-toggle').attr('aria-expanded', false);
            $(menuDOM).append('<ul  class="dropdown-menu pull-right ct-portlet_icon__dropdown" role="menu" ></ul>');
            var list = $(menuDOM).find('.dropdown-menu');
            for (var i = 0; i < customMD.child_nodes.length; i++) {
                var menuitem = customMD.child_nodes[i];
                var submenuDOM = "<li data-item-id=" + menuitem.CUSTOM_TOOLS_ID + " ><a href='javascript:void(0);'>" + menuitem.DISPLAY_NAME + "</a></li>";
                list.append(submenuDOM);
                this.getCustomToolsMenu(menuitem, $(list).find('[data-item-id=' + menuitem.CUSTOM_TOOLS_ID + ']'));
            }
            $(menuDOM).on('mouseover', function() {
                $(this).addClass('open');
            });
            $(menuDOM).on('mouseout', function() {
                $(this).removeClass('open');
            });
        } else {
            menuDOM.on('click', function() {
                that.handleCustomToolsAction(customMD);
            });
        }
    },
    /**
     * @member  {Method} setAppToolsHandlers
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method to register the handlers for all the app tools and make multi level dropdown possible
     */
    setAppToolsHandlers: function() {
        var that = this;
        var dialogBoxClass = CLCR.getCmp({
            'COMP_TYPE': 'APP',
            'VIEW_TYPE': 'MODAL_DIALOG'
        });
        var dialogConfig = {
            'title': 'Warning',
            'message': CRB.getFWBundleValue('APP_TOOL_UNSUPPORT'),
            'dialogType': 'ERROR'
        };
        var dialogObj = new dialogBoxClass(dialogConfig);
        /**
         * Handler for multi level dropdown menu of the app tools in app header
         * Setting the position of the third level dropdown menu
         */
        $(this.elem).find('ul.dropdown-menu [data-toggle=dropdown]').off('mouseover').on('mouseover', function(e) {
            e.stopPropagation();
            $(this).parent().addClass('open');
            var windowWidth = $(window).width();
            var prevOffset = $(this).offset();
            var prevWidth = $(this).width();
            var presentOffset = prevOffset.left + prevWidth;
            var presentWidth = $(this).parent().children("ul").width();
            var reqWidth = presentOffset + presentWidth;
            if (reqWidth > windowWidth) {
                $(this).parent().find('ul.dropdown-menu').css({
                    left: "auto",
                    right: "100%"
                });
                if (prevOffset.left < presentWidth) {
                    $(this).parent().find('ul.dropdown-menu').css({
                        left: "auto",
                        right: "auto"
                    });
                }
            } else {
                $(this).parent().find('ul.dropdown-menu').css({
                    left: "100%",
                    right: "100%"
                });
            }
            $(this).parent().on("mouseout", function(){
                $(this).removeClass('open');
            });
        });
        /** Handler for the Custom tool */
        $(this.elem).find('a[name="portlet_customTool"]').unbind("click").bind('click', function(e) {
            var toolID = $(this).data('item-id');
            var customMD = that.viewMd.CUSTOM_TOOLS_LIST[that.viewMd.CUSTOM_TOOLS_LIST.map(function(e) {
                return e.CUSTOM_TOOLS_ID;
            }).indexOf(toolID)];
            if (customMD.TOOL_TYPE == 'ROOT') {
                if (!cbx.isEmpty(customMD.child_nodes) && (customMD.child_nodes.length > 0)) {
                    var list = $(this).parent().find(".dropdown-menu");
                    $(list).empty();
                    for (var i = 0; i < customMD.child_nodes.length; i++) {
                        var menuitem = customMD.child_nodes[i];
                        var menuDOM = "<li data-item-id=" + menuitem.CUSTOM_TOOLS_ID + " ><a data-toggle='dropdown' href='javascript:void(0);'>" + menuitem.DISPLAY_NAME + "</a></li>";
                        list.append(menuDOM);
                        that.getCustomToolsMenu(menuitem, $(list).find('[data-item-id=' + menuitem.CUSTOM_TOOLS_ID + ']'));
                    }
                } else {
                    that.handleCustomToolsAction(customMD);
                }
            } else {
                that.handleCustomToolsAction(customMD);
            }
            var customMenuEvents = function(list) {
                list.children().on('mouseover', function() {});
                list.children().on('click', function() {});
            }
        });
        /** Handler for the Collapse/Expand app tool */
        $(this.elem).find('[data-item-id=portlet_collapseTool]').unbind("click").bind('click', that, function(e) {
            var $this = $(this);
            $(this).parent().find('div[role=tooltip]').remove();
            if ($this.hasClass('panel-collapsed')) {
                /** Portlet is collapsed so expand it */
                $this.closest('li').siblings().find('a[data-item-id=portlet_editTool]').hasClass('tbarForm-displayed') ? $this.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-tbar]').removeClass('hidden').addClass('show') : "";
                $this.removeClass('ct-app__tools-plus flaticon-expand_down').addClass('ct-app__tools-minus flaticon-expand_up');
                /**Call collapsePortletContent() method to expand the portlet*/
                that.collapsePortletContent($this);
                /**
                 * 	Event raise for widget expand
                 */
                that.renderer.viewConf.raiseEvent(CWEC.WGT_EXPAND, that);
            } else {
                /**
                 Portlet is expanded so collapse it
                 */
                $this.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-detail]').slideUp('slow');
                $this.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-body]').slideUp('slow');
                $this.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-footer]').slideUp('slow');
                $this.removeClass('ct-app__tools-minus flaticon-expand_up').addClass('ct-app__tools-plus flaticon-expand_down');
                $this.attr('data-original-title', "Expand");
                $this.addClass('panel-collapsed');
                /**
                 * 	Event raise for widget collapse
                 */
                that.renderer.viewConf.raiseEvent(CWEC.WGT_COLLAPSED, that);
            }
        });
        /** Handler for the maximize app tool */
        $(this.elem).find('[data-item-id=portlet_maxTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            var collapseEle = $(that.appDiv).find('[data-item-id=portlet_collapseTool]');
            /** Check if the portlet is collapsed, if yes call collapsePortletContent() method to expand the portlet */
            if (collapseEle.hasClass('panel-collapsed')) {
                that.collapsePortletContent(collapseEle);
            }
            var modalContent = $(this).closest('.panel').find('.panel-body').first().parent();
            /** Call portlet model window to render the portlet within it in order to display it maximized */
            var modal = CLCR.getCmp({
                "COMP_TYPE": "MODAL_WINDOW",
            });
            var config = {
                modalContent: modalContent,
                modalClass: 'ct-modal__max',
                fullscreenInd: true,
                viewScope: that
            };
            new modal(config);
            if (that.renderer.maximizeOpen) {
                that.renderer.maximizeOpen();
            };
        });
        /** Handler for the edit (form) app tool */
        $(this.elem).find('[data-item-id=portlet_editTool]').unbind("click").bind('click', that, function(e) {
            var $this = $(this);
            /** Check if the tbar is already displayed, if yes hide it */
            if ($this.hasClass('tbarForm-displayed')) {
                $this.closest('[data-item-id=portlet]').find('[data-item-type=SINGULAR]').find('[data-item-id=portlet-tbar]').removeClass('show').addClass('hidden');
                $this.closest('[data-item-id=portlet]').find('[data-item-type=SINGULAR]').find('[data-item-id=portlet-main-content]').removeClass('col-md-9').addClass('col-md-12');
                $this.removeClass('tbarForm-displayed');
            } else {
                /** Show tbar */
                $this.closest('[data-item-id=portlet]').find('[data-item-type=SINGULAR]').find('[data-item-id=portlet-tbar]').removeClass('hidden').addClass('show');
                $this.closest('[data-item-id=portlet]').find('[data-item-type=SINGULAR]').find('[data-item-id=portlet-main-content]').removeClass('col-md-12').addClass('col-md-9');
                $this.addClass('tbarForm-displayed');
            }
            /** Find the collapse/expand tool */
            var collapseEle = $(that.appDiv).find('[data-item-id=portlet_collapseTool]');
            /** Check if the portlet is collapsed, if yes call collapsePortletContent() method to expand the portlet */
            if (collapseEle && collapseEle.hasClass('panel-collapsed')) {
                that.collapsePortletContent(collapseEle);
            }
        });
        /** Handler for the chart app tool */
        $(this.elem).find('[data-item-id=portlet_chartTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.getChartTypes) {
                that.updateMenuForChart($(this));
            } else {
                dialogObj.show();
            }
        });
        $(this.elem).find('[data-item-id=portlet_preferencesTool]').on('click', function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer) {
                that.updateMenuForPref($(this)); //chart changes
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the save as app tool */
        $(this.elem).find('[data-item-id=portlet_saveAsTool]').unbind("click").bind('click', that, function(e) {
            if (that.renderer) {
                that.saveAsRevertRenderer = new canvas.lib.saveAsRevert({
                    scope: that.renderer
                });
                that.saveAsRevertRenderer.saveView();
                /** Enable update tool */
                $(this).closest('ul').find('[data-item-id=portlet_updateTool]').parent('li').removeClass('hidden').addClass('show');
                /** Enable switch view tool */
                $(this).closest('ul').find('[data-item-id=portlet_switchTool]').parent('li').removeClass('hidden').addClass('show');
                /** Enable remove tool */
                $(this).closest('ul').find('[data-item-id=portlet_removeTool]').parent('li').removeClass('hidden').addClass('show');
            } else {
                dialogObj.show();
            }
        });
        $(this.elem).find("[data-item-id='portlet_switchTool']").parent().find("ul").off('click').on('click', "li >span > a", function(e) {
            /*
             * Event handler for View Change
             */
            var records = that.viewConf.renderer.renderer.records ? that.viewConf.renderer.renderer.records : that.viewConf.renderer.renderer.listData.records;
            LOGGER.log("records..", records);
            that.viewConf.raiseEvent(CWEC.VIEW_CHANGE, records);
            e.preventDefault();
            that.viewId = $(e.target).data("view-id") || $(e.target).parent().data("view-id");
            var widgetId = $(e.target).data("widget-id") || $(e.target).parent().data("widget-id");
            var obj = {
                VIEW_ID: that.viewId,
                widgetId: widgetId
            };
            that.saveAsRevertRenderer = new canvas.lib.saveAsRevert({
                scope: that.renderer
            });
            that.saveAsRevertRenderer.widID = widgetId;
            obj.thatScope = that.saveAsRevertRenderer;
            that.saveAsRevertRenderer.afterSaveAsRevertParams(obj);
        });
        /** Handler for the revert app tool */
        $(this.elem).find('[data-item-id=portlet_revertTool]').unbind("click").bind('click', that, function(e) {
            that.viewId = $(e.target).attr("data-view-id");
            that.saveAsRevertRenderer = new canvas.lib.saveAsRevert({
                scope: that.renderer
            });
            var widgetId = that.saveAsRevertRenderer.getWidgetId();
            var obj = {
                VIEW_ID: that.viewId,
                widgetId: widgetId
            };
            obj.thatScope = that.saveAsRevertRenderer;
            that.saveAsRevertRenderer.afterSaveAsRevertParams(obj);
        });
        /** Handler for the update app tool */
        $(this.elem).find('[data-item-id=portlet_updateTool]').unbind("click").bind('click', that, function(e) {
            /*
             * Event handler for Preference Change
             */
            var records = that.viewConf.renderer.renderer.records ? that.viewConf.renderer.renderer.records : that.viewConf.renderer.renderer.listData.records;
            LOGGER.log("records..", records);
            that.viewConf.raiseEvent(CWEC.PREF_CHNG, records);
            that.viewId = $(e.target).attr("data-view-id");
            var viewType = "update";
            if (that.renderer && that.renderer.updateRemoveView) {
                that.saveAsRevertRenderer = new canvas.lib.saveAsRevert({
                    scope: that.renderer
                });
                that.saveAsRevertRenderer.updateRemoveView(that.viewId, viewType);
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the remove app tool */
        $(this.elem).find('[data-item-id=portlet_removeTool]').on('click', function(e) {
            var viewType = "remove";
            that.viewId = $(e.target).attr("data-view-id") || $(e.target).parent().attr("data-view-id");
            if (that.renderer) {
                that.saveAsRevertRenderer = new canvas.lib.saveAsRevert({
                    scope: that.renderer
                });
                that.saveAsRevertRenderer.updateRemoveView(that.viewId, viewType);
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the help app tool */
        $(this.elem).find('[data-item-id=portlet_helpTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            ct.app.helpHandler.execute(that.WIDGET_ID + '_Help.htm');
        });
        /** Handler for the export to excel app tool */
        $(this.elem).find('[data-item-id=portlet_excelTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.exportToExcel) {
                that.renderer.exportToExcel();
            } else if (that.md.isChartView()) {
                ct.app.exportHandler.execute(that, 'XLS');
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the export to pdf app tool */
        $(this.elem).find('[data-item-id=portlet_pdfTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.exportToPDF) {
                that.renderer.exportToPDF();
            } else if (that.md.isChartView()) {
                ct.app.exportHandler.execute(that, 'PDF');
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the export to csv app tool */
        $(this.elem).find('[data-item-id=portlet_csvTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.exportToCSV) {
                that.renderer.exportToCSV();
            } else if (that.md.isChartView()) {
                ct.app.exportHandler.execute(that, 'CSV');
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the export to rtf app tool */
        $(this.elem).find('[data-item-id=portlet_rtfTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.exportToRTF) {
                that.renderer.exportToRTF();
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the export to jpeg app tool */
        $(this.elem).find('[data-item-id=portlet_jpegTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.exportToJPEG) {
                that.renderer.exportToJPEG();
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the refresh app tool */
        $(this.elem).find('[data-item-id=portlet_refreshTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.refresh) {
                that.renderer.refresh();
            } else if (that.md.isChartView()) {
                that.renderer.reloadData();
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the print app tool */
        $(this.elem).find('[data-item-id=portlet_printTool]').unbind("click").bind('click', that, function(e) {
            $(this).parent().find('div[role=tooltip]').remove();
            if (that.renderer && that.renderer.print) {
                that.renderer.print();
            } else if (that.md.isChartView()) {
                ct.app.exportHandler.execute(that, 'PRINT');
            } else {
                dialogObj.show();
            }
        });
        /** Handler for the show as tool bar app tool */
        $(this.elem).find('[data-item-id=portlet_showAsToolBar]').unbind("click").bind('click', that, function(e) {
            $(this).parents('div.dropdown').removeClass('open');
            $(that.appDiv).find('[data-item-id=portlet_moreTool]').removeClass('show').addClass('hidden');
            $(that.appDiv).find('[data-item-id=portlet_toolBar]').removeClass('hidden').addClass('show');
        });
        /** Handler for the restore the tools from tool bar app tool */
        $(this.elem).find('[data-item-id=portlet_restoreTools]').unbind("click").bind('click', that, function(e) {
            $(that.appDiv).find('[data-item-id=portlet_moreTool]').removeClass('hidden').addClass('show');
            $(that.appDiv).find('[data-item-id=portlet_toolBar]').removeClass('show').addClass('hidden');
        });
        /** 
         * Handler for the close app tool
         * Remove the portlet and place it in he app dock
         */
        $(this.elem).find('[data-item-id=portlet_closeTool]').unbind("click").bind('click', that, function(e) {
            that.closePortlet(this);
        });
        that.showHideFooter();
    },
    closePortlet: function(dom) {
        var that = this;
        var itemID = $(dom).closest('[data-item-id=portlet]').parents('[data-widgetid]').data('widgetid');
        var title = '';
        if (that.viewMd.md.VIEW_MD) {
            title = CRB.getBundleValue(that.viewMd.md.VIEW_MD.FLD_BUNDLE_KEY, that.viewMd.md.VIEW_MD.VIEW_DISPLAY_NM) ? CRB.getBundleValue(that.viewMd.md.VIEW_MD.FLD_BUNDLE_KEY, that.viewMd.md.VIEW_MD.VIEW_DISPLAY_NM) : that.viewMd.md.VIEW_MD.VIEW_DISPLAY_NM;
        } else {
            title = that.viewMd.WGT_TITLE;
        }
        if (that.renderer && that.renderer.destroy) {
            that.renderer.destroy();
        }
        /*
         * 	Raises AppOnDestroy Event
         */
        that.viewConf.raiseEvent(CWEC.CTAPPONDESTROY);
        $(dom).closest('.panel').remove();
        var app = {
            ITEM_ID: itemID,
            ITEM_TITLE: title
        };
        var cache = {
            WORKSPACE_ID: iportal.workspace.metadata.getCurrentWorkspaceId(),
            ITEM_ID: itemID
        };
        iportal.workspace.metadata.addToCatalogCache(cache);
        var appObj = iportal.workspace.metadata.getAppDock();
        appObj.addAppItem([app]);
    },
    /**
     * @member {Method} showHideFooter
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to show/hide footer on mouse scroll / page scroll
     */
    showHideFooter: function() {
        var reqWindowHeight = $(window).height();
        var contentHeight = $("#CONTENT_DIV").height();
        if (reqWindowHeight > contentHeight) {
            $('[data-item-toggle=ct-show-hide-footer]').css("margin-bottom", "0px");
        } else {
            $('[data-item-toggle=ct-show-hide-footer]').css("margin-bottom", "-40px");
        }
    },
    /**
     * @member  {Method} collapsePortletContent
     * @memberof "cbx.lib.JQTBSportlet"
     * @description This method collapses the portlet TBAR content, body and footer. Also updates the collapse/Expand tool accordingly
     */
    collapsePortletContent: function(currToolElem) {
        currToolElem.removeClass('ct-app__tools-plus').addClass('ct-app__tools-minus flaticon-expand_up');
        currToolElem.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-detail]').slideDown('slow');
        currToolElem.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-body]').slideDown('slow');
        currToolElem.closest('div[data-item-id=portlet]').find('div[data-item-id=portlet-footer]').slideDown('slow');
        currToolElem.attr('data-original-title', "Collapse");
        currToolElem.removeClass('panel-collapsed');
    },
    /**
     * @member  {Method} massagePortletMD
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Massages the meta data in order to make the meta data compatible with the templates (PortletContainerTemplate, PortletHeaderTemplate)
     * 				Method to massage the metadata before passing it to the portlet templates.  
     */
    massagePortletMD: function() {
        this.viewMd['WGT_HEADER_IND'] = this.WGT_HEADER_IND;
        this.viewMd.HEADER_REQ = this.PORTLET_REQ === true ? (this.WGT_HEADER_IND === 'Y' ? true : false) : false;
        /** Set the detail portlet message indicator */
        this.viewMd.WGT_DETL_MSG_IND = this.PORTLET_REQ ? (this.CONTAINER_FLAG === 'N' ? (this.viewMd.md.VIEW_MD.FLD_DETAIL_MSG_IND === 'Y' ? true : false) : true) : false;
        this.viewMd.WGT_FOOTER_IND = this.PORTLET_REQ ? this.CONTAINER_FLAG === 'N' ? (cbx.isEmpty(this.viewMd.getBBarButtons()) ? false : true) : true : false;
        if (this.PORTLET_REQ) {
            /** Set the detail portlet message class and details */
            this.viewMd.WIDGET_DETL_MSG_CLASS = 'panel-msg ' + this.WIDGET_ID;
            /** Set the class for the portlet footer i.e combination of bootstrap classes and widget Id */
            this.viewMd.WIDGET_FOOTER_CLASS = 'panel-footer ' + this.WIDGET_ID;
        }
        this.viewMd['APPS_IN_A_ROW'] = this.APPS_IN_A_ROW;
        this.viewMd['BLOCK_POSITION'] = this.BLOCK_POSITION;
        this.viewMd['CLOSED_IND'] = this.CLOSED_IND;
        this.viewMd['CONTAINER_FLAG'] = this.CONTAINER_FLAG;
        this.viewMd['NO_OF_ROWS'] = this.NO_OF_ROWS;
        this.viewMd['POSITION'] = this.POSITION;
        this.viewMd['RESIZE_IND'] = this.RESIZE_IND;
        this.viewMd['WGT_TITLE'] = this.WGT_TITLE;
        this.viewMd['WIDGET_BUNDLE_KEY'] = this.WIDGET_BUNDLE_KEY;
        this.viewMd['WIDGET_ID'] = this.WIDGET_ID;
        this.viewMd['WIDGET_PXL_HT'] = this.WIDGET_PXL_HT;
        this.viewMd['WI_CHANNEL_ID'] = this.WI_CHANNEL_ID;
        this.viewMd['rb'] = this.rb;
        /** Set the portlet class i.e the combination of the bootstrap classes and the widget Id received */
        this.viewMd.WIDGET_CLASS = 'panel panel-default ' + this.viewMd.WIDGET_ID;
        /** Check if the portlet to be rendered as collapsed initially */
        if (this.CONTAINER_FLAG === 'N') {
            /**	In case of multiapp, INIT_COLLAPSED is set to the required value and is assigned here.. */
            if (!cbx.isEmpty(this.INIT_COLLAPSED)) {
                this.viewMd.md.VIEW_MD.FLD_INIT_COLLAPSED = this.INIT_COLLAPSED;
            }
            this.viewMd.COLLAPSED_IND = this.viewMd.md.VIEW_MD.FLD_INIT_COLLAPSED === 'Y' ? true : false;
        }
        /** Check if the header of the portlet to be created */
        if (this.viewMd.HEADER_REQ) {
            /** Set the class for the portlet header i.e the combination of bootstrap classes and the widget Id */
            this.viewMd.WIDGET_HEADER_CLASS = 'panel-heading ' + this.viewMd.WIDGET_ID;
            /** Set the class for getting the icon to be displayed prefixed to the portlet title */
            this.viewMd.WGT_HEADER_ICON = this.viewMd.WIDGET_ID + '_portletIcon';
            /** Set the class for the portlet title i.e the combination of bootstrap class and the widget Id */
            this.viewMd.WGT_HEADER_TITLE_CLASS = 'panel-title ' + this.viewMd.WIDGET_ID + '_portletTitle';
            /** Initially set the widget display name as the portlet title */
            this.viewMd.WGT_TITLE = cbx.isEmpty(CRB.getBundleValue(this.viewMd.WIDGET_BUNDLE_KEY, this.viewMd.WGT_TITLE)) ? this.viewMd.WGT_TITLE : CRB.getBundleValue(this.viewMd.WIDGET_BUNDLE_KEY, this.viewMd.WGT_TITLE);
            /** Check if the app tools (sub options in MORE tool) to be arranged linearly */
            var toolsLinearFlag = !cbx.isEmpty(iportal.systempreferences.getToolsAsLinearFlag()) ? iportal.systempreferences.getToolsAsLinearFlag() : "N";
            /** Set the app tools linear flag */
            this.viewMd.WGT_TOOLS_IS_LINEAR = toolsLinearFlag ? true : false;
            if (this.viewMd.md.VIEW_MD != undefined && this.viewMd.md.VIEW_MD.FLD_CUSTOM_TOOLS_LIST != undefined) {
                this.viewMd.CUSTOM_TOOLS_LIST = [];
                var viewCustomToolsList = this.viewMd.md.VIEW_MD.FLD_CUSTOM_TOOLS_LIST;
                for (var i = 0; i < viewCustomToolsList.length; i++) {
                    var customMD = eval(this.viewMd.md.VIEW_MD.FLD_CUSTOM_TOOLS_LIST[i])[0];
                    switch (customMD.CHANNEL_ID) {
                        case 'A':
                            {
                                customMD['cssClass'] = "";
                                break;
                            }
                        case 'M':
                            {
                                customMD['cssClass'] = "hidden-lg hidden-md hidden-sm";
                                break;
                            }
                        case 'D':
                            {
                                customMD['cssClass'] = "hidden-md hidden-sm hidden-xs";
                                break;
                            }
                        case 'T':
                            {
                                customMD['cssClass'] = "hidden-lg hidden-sm hidden-xs";
                                break;
                            }
                    }
                    this.viewMd.CUSTOM_TOOLS_LIST.push(customMD);
                }
            }
            /**Get and set the tools labels and tool tips from resource bundle*/
            var appToolsBundleKeys = ["SAVE_AS_APP_TOOL", "REVERT_APP_TOOL", "UPDATE_APP_TOOL", "SWITCH_VIEW_APP_TOOL", "REMOVE_APP_TOOL", "CLEAR_FILTERS_APP_TOOL", "TOOL_TIPS_REVERT_IN_MORE", "EXPORT_APP_TOOL", "TOOLTIP_CLOSE", "TOOLTIP_PIN", "TOOLTIP_EDIT"];
            if (this.getViewType() != 'MULTI_WIDGET') {
                var toolsList = this.viewMd.md.VIEW_MD.FLD_TOOLS_LIST.split(",");
                for (var i = 0; i < toolsList.length; i++) {
                    this.viewMd["TOOLTIP_" + toolsList[i].toUpperCase()] = CRB.getFWBundleValue("TOOLTIP_" + toolsList[i].toUpperCase());
                }
            }
            for (var index = 0; index < appToolsBundleKeys.length; index++) {
                this.viewMd[appToolsBundleKeys[index]] = CRB.getFWBundleValue(appToolsBundleKeys[index]);
            }
        } //End if
        /**Set TBAR class*/
        /**
         * BO:(Enabling "cbxexternalplugin") Why by default portlet shown as hidden, if say some reason, there is no place to re enable it
         * this.viewMd.WIDGET_TBAR_CLASS='panel panel-body hidden '+this.WIDGET_ID;  
         */
        this.viewMd.WIDGET_TBAR_CLASS = 'panel panel-body ' + this.WIDGET_ID;
        /**
         * EOF BO: FIX
         */
        /** Set the class for the portlet body i.e is the combination of bootstrap classes and widget Id */
        var CTMultiappPortletBodyClass = this.CONTAINER_FLAG === 'Y' ? 'ct-multiapp' : '';
        this.viewMd.WIDGET_BODY_CLASS = 'panel-body ' + CTMultiappPortletBodyClass + ' ' + this.viewMd.WIDGET_ID;
        this.viewMd.WIDGET_MAIN_CONTENT_CLASS = this.viewMd.WIDGET_BODY_CLASS;
        if (!cbx.isEmpty(this.viewMd.md.VIEW_MD)) {
            if (this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE == 'IFRAME' || this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE == 'ADS' || this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE == 'MAP' || this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE == 'CALENDAR' || this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE == 'CHART') {
                this.viewMd.WIDGET_MAIN_CONTENT_CLASS = this.viewMd.WIDGET_MAIN_CONTENT_CLASS + ' ct-no-padding';
            }
        }
        if (this.CONTAINER_FLAG != "Y") {
            if (!cbx.isEmpty(this.md.md.VIEW_MD.FLD_TBAR_BUTTONS)) {
                this.viewMd['TBAR_REQD'] = true;
            } else {
                this.viewMd['TBAR_REQD'] = false;
            }
        } else {
            this.viewMd['TBAR_REQD'] = false;
        }
        if (this.CONTAINER_FLAG != "Y") {
            this.viewMd['GLOBAL_DATE_FILTER'] = this.viewMd.md.VIEW_MD.FLD_GLOBAL_DATE_FILTER_IND === 'Y' ? true : false;
        } else {
            this.viewMd['GLOBAL_DATE_FILTER'] = false;
        }
        var grids = ['PAGING', 'GROUP', 'LIST', 'CLASSIC_GRID', 'ADVGROUP', 'PROPERTY']
        if (this.CONTAINER_FLAG == "Y") {
            this.viewMd['PREFERENCES_GRID'] = true;
        } else if (!cbx.isEmpty(this.viewMd.md.VIEW_MD)) {
            this.viewMd['PREFERENCES_GRID'] = grids.contains(this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE) ? true : false;
        }
        return this.viewMd;
    },
    /**
     * @member  {Method} applyDetailTemplate
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Method on successfully compiling the template of portlet detail		
     * 				Append the portlet detail content to the portlet detail message  div 
     * 				
     */
    applyDetailTemplate: function(detailTemplate, detailTmpClass) {
        if (!cbx.core.isEmpty(this.portletDetailMsgDiv)) {
            $(this.portletDetailMsgDiv).append(detailTemplate);
        }
    },
    /**
     * @member {Method} getViewType
     * @memberof "cbx.lib.JQTBSportlet"
     * @description API to get view type
     */
    getViewType: function() {
        if (!cbx.isEmpty(this.md.md.VIEW_MD)) {
            return this.md.md.VIEW_MD.FLD_VIEW_TYPE;
        } else if (this.md.CONTAINER_FLAG == 'Y') {
            return 'MULTI_WIDGET';
        } else {
            return "";
        }
    },
    /**
     * @member  {Method} updatePortletHeaderFooter
     * @memberof "cbx.lib.JQTBSportlet"
     * @description Update the portlet title with the current view displayed and enable or disable the app tools based on the configuration  
     */
    updatePortletHeaderFooter: function(config) {
        var viewDisplayName = CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, config.md.VIEW_MD.VIEW_DISPLAY_NM) ? CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, config.md.VIEW_MD.VIEW_DISPLAY_NM) : config.md.VIEW_MD.VIEW_DISPLAY_NM;
        /** Update the current view display name as the portlet title */
        $(this.appDiv).find('[data-item-id=portlet-title]').html("");
        $(this.appDiv).find('[data-item-id=portlet-title]').html(viewDisplayName);
        /** Clear the portlet header app tools */
        var toolList = ["portlet_collapseTool", "portlet_maxTool", "portlet_preferencesTool", "portlet_refreshTool", "portlet_helpTool", "portlet_pdfTool", "portlet_excelTool", "portlet_csvTool", "portlet_customTool", "portlet_editTool", "portlet_rtfTool", "portlet_jpegTool", "portlet_printTool", "portlet_chartTool", "portlet_showAsToolBar", "portlet_moreTool", "portlet_exportTool"];
        for (var index = 0; index < toolList.length; index++) {
            $(this.appDiv).find('[data-item-id=' + toolList[index] + ']').closest('li').removeClass('show').addClass('hidden');
        }
        /** Get the app tools configured for the current view */
        var toolsConf = (!cbx.isEmpty(config.md.VIEW_MD.FLD_TOOLS_LIST)) ? (config.md.VIEW_MD.FLD_TOOLS_LIST.match(/[,]/)) ? config.md.VIEW_MD.FLD_TOOLS_LIST.split(",") : [config.md.VIEW_MD.FLD_TOOLS_LIST] : [];
        var viewType = this.getViewType();
        if (cbx.isArray(toolsConf) && toolsConf.length > 0) {
            if (toolsConf && cbx.isArray(toolsConf)) {
                var moreToolsCount = 0;
                var exportToolsCount = 0;
                for (var i = 0; i < toolsConf.length; i++) {
                    var tool = toolsConf[i].toUpperCase();
                    switch (tool) {
                        case 'COLLAPSE':
                            { /** Enable collapse/expand app tool */
                                var collapseTool = $(this.appDiv).find('[data-item-id=portlet_collapseTool]')
                                collapseTool.closest('li').removeClass('hidden').addClass('show');
                                collapseTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                            }
                            break;
                        case 'MAXIMIZE':
                            { /** Enable maximize app tool */
                                var maxTool = $(this.appDiv).find('[data-item-id=portlet_maxTool]')
                                maxTool.closest('li').removeClass('hidden').addClass('show');
                                maxTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                            }
                            break;
                        case 'GEAR':
                            { /** Enable preference app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR') {
                                        var preferencesTool = $(this.appDiv).find('[data-item-id=portlet_preferencesTool]')
                                        preferencesTool.closest('li').removeClass('hidden').addClass('show');
                                        preferencesTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                    }
                                }
                            }
                            break;
                        case 'REFRESH':
                            { /** Enable refresh app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR') {
                                        var refreshTool = $(this.appDiv).find('[data-item-id=portlet_refreshTool]');
                                        refreshTool.closest('li').removeClass('hidden').addClass('show');
                                        refreshTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        refreshTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                    }
                                }
                            }
                            break;
                        case 'HELP':
                            { /** Enable help app tool */
                                var helpTool = $(this.appDiv).find('[data-item-id=portlet_helpTool]');
                                helpTool.closest('li').removeClass('hidden').addClass('show');
                                helpTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                helpTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                moreToolsCount++;
                            }
                            break;
                        case 'PDF':
                            { /** Enable pdf app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR') {
                                        var pdfTool = $(this.appDiv).find('[data-item-id=portlet_pdfTool]');
                                        pdfTool.closest('li').removeClass('hidden').addClass('show');
                                        pdfTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        pdfTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                        exportToolsCount++;
                                    }
                                }
                            }
                            break;
                        case 'EXCEL':
                            { /** Enable export to excel app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR' && viewType != 'FORM') {
                                        var excelTool = $(this.appDiv).find('[data-item-id=portlet_excelTool]');
                                        excelTool.closest('li').removeClass('hidden').addClass('show');
                                        excelTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        excelTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                        exportToolsCount++;
                                    }
                                }
                            }
                            break;
                        case 'CSV':
                            { /** Enable export to csv app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR' && viewType != 'FORM') {
                                        var csvTool = $(this.appDiv).find('[data-item-id=portlet_csvTool]');
                                        csvTool.closest('li').removeClass('hidden').addClass('show');
                                        csvTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool));
                                        csvTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                        exportToolsCount++;
                                    }
                                }
                            }
                            break;
                        case 'RTF':
                            { /** Enable export to rtf app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR' && viewType != 'FORM') {
                                        var rtfTool = $(this.appDiv).find('[data-item-id=portlet_rtfTool]')
                                        rtfTool.closest('li').removeClass('hidden').addClass('show');
                                        rtfTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        rtfTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                        exportToolsCount++;
                                    }
                                }
                            }
                            break;
                        case 'JPGEXPORT':
                            { /** Enable export to jpeg app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR' && viewType != 'FORM') {
                                        var jpegTool = $(this.appDiv).find('[data-item-id=portlet_jpegTool]');
                                        jpegTool.closest('li').removeClass('hidden').addClass('show');
                                        jpegTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        jpegTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                        exportToolsCount++;
                                    }
                                } else if (!cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {}
                            }
                            break;
                        case 'PRINT':
                            { /** Enable print app tool */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR') {
                                        var printTool = $(this.appDiv).find('[data-item-id=portlet_printTool]')
                                        printTool.closest('li').removeClass('hidden').addClass('show');
                                        printTool.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        printTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        moreToolsCount++;
                                    }
                                }
                            }
                            break;
                        case 'SWITCHCHART':
                            { /** Enable switch chart app tool for charts view */
                                if (!cbx.isEmpty(this.md.md.VIEW_MD) || !cbx.isEmpty(this.md.md.MULTI_WIDGET_MD)) {
                                    if (viewType != 'MAP' && viewType != 'CALENDAR') {
                                        var chartTool = $(this.appDiv).find('[data-item-id=portlet_chartTool]');
                                        chartTool.closest('li').removeClass('hidden').addClass('show');
                                        chartTool.attr('data-original-title', CRB.getFWBundleValue("TOOLTIP_" + tool))
                                        break;
                                    }
                                }
                            }
                            break;
                        case 'SHOWASTOOLBAR':
                            { /** Enable show as tool bar app tool */
                                var showAsToolBar = $(this.appDiv).find('[data-item-id=portlet_showAsToolBar]')
                                showAsToolBar.closest('li').removeClass('hidden').addClass('show');
                                showAsToolBar.find('.ct-dropdown-menu-txt').text(CRB.getFWBundleValue("TOOLTIP_" + tool))
                                moreToolsCount++;
                            }
                            break;
                    }
                }
            }
            if (moreToolsCount != 0) {
                /** Enable MORE app tool if any of its sub menu is configured */
                $(this.appDiv).find('[data-item-id=portlet_moreTool]').closest('li').removeClass('hidden').addClass('show');
            }
            if (exportToolsCount != 0) {
                /** Enable EXPORT sub menu of MORE app tool if any of its sub menu is configured */
                $(this.appDiv).find('[data-item-id=portlet_exportTool]').closest('li').removeClass('hidden').addClass('show');
            }
        }
        /** Check if close app tool is required for the current view type */
        iportal.workspace.metadata.isWidgetCatalogRequired() ? $(this.appDiv).find('[data-item-id=portlet_closeTool]').closest('li').removeClass('hidden').addClass('show') : $(this.appDiv).find('[data-item-id=portlet_closeTool]').closest('li').removeClass('show').addClass('hidden');
        /** Check if TBAR is configured */
        config.md.VIEW_MD.FLD_TBAR_BUTTONS == undefined ? "" : $(this.appDiv).find('[data-item-id=portlet_editTool]').closest('li').removeClass('hidden').addClass('show');
        /** Check if custom tools are configured */
        if (config.md.VIEW_MD.FLD_CUSTOM_TOOLS_LIST != undefined) {
            $(this.appDiv).find('[name=portlet_customTool]').closest('li').removeClass('hidden').addClass('show');
            var customTools = eval(config.md.VIEW_MD.FLD_CUSTOM_TOOLS_LIST)[0];
            this.viewMd["CUSTOM_APP_TOOL_TIP"] = CRB.getFWBundleValue(customTools.DISPLAY_NAME) ? CRB.getFWBundleValue(customTools.DISPLAY_NAME) : customTools.DISPLAY_NAME;
            this.viewMd["CUSTOM_TOOLS_ID"] = customTools.CUSTOM_TOOLS_ID;
        }
        /** Check if portlet advanced note is configured and then render the note above the footer */
        this.portletDetailMsgDiv = $(this.appDiv).find('[data-item-id=portlet-detail-message]');
        this.portletDetailMsgDiv.length === 0 ? "" : $(this.portletDetailMsgDiv).empty();
        if (config.md.VIEW_MD.FLD_DETAIL_MSG_IND == 'Y' && this.portletDetailMsgDiv.length != 0) {
            config.WIDGET_DETL_MSG_LBL = CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, config.md.VIEW_MD.FLD_DETAIL_MSG_LBL) ? CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, config.md.VIEW_MD.FLD_DETAIL_MSG_LBL) : config.md.VIEW_MD.FLD_DETAIL_MSG_LBL;
            this.portletDetailMsgDiv.html(config.WIDGET_DETL_MSG_LBL);
        }
        /** Check if BBAR buttons are configured and then */
        if (config.md.VIEW_MD.FLD_BBAR_BUTTONS != undefined) {
            if (config.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS.length != 0) {
                /** Set the class names and the display name from resource bundle for BBAR Positive buttons */
                var bbarBtn;
                for (var posInd = 0; posInd < config.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS.length; posInd++) {
                    bbarBtn = config.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS[posInd];
                    bbarBtn.BBAR_CLASS = "btn " + bbarBtn.FLD_BBAR_BTN_ID;
                    bbarBtn.FLD_BTN_DISPLAY_NM = CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, bbarBtn.FLD_BTN_DISPLAY_NM) ? CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, bbarBtn.FLD_BTN_DISPLAY_NM) : bbarBtn.FLD_BTN_DISPLAY_NM;
                }
                /** Get the alignment set for positive buttons */
                iportal.preferences.getPostiveBtnAlign() == 'RIGHT' ? config.RIGHT_BBAR_BUTTONS = config.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS : config.LEFT_BBAR_BUTTONS = config.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS;
            }
            if (config.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS.length != 0) {
                /** Set the class names and the display name from resource bundle for BBAR Negative buttons */
                for (var negInd = 0; negInd < config.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS.length; negInd++) {
                    bbarBtn = config.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS[negInd];
                    bbarBtn.BBAR_CLASS = "btn " + bbarBtn.FLD_BBAR_BTN_ID;
                    bbarBtn.FLD_BTN_DISPLAY_NM = CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, bbarBtn.FLD_BTN_DISPLAY_NM) ? CRB.getBundleValue(config.md.VIEW_MD.FLD_BUNDLE_KEY, bbarBtn.FLD_BTN_DISPLAY_NM) : bbarBtn.FLD_BTN_DISPLAY_NM;
                }
                /** Get the alignment set for negative buttons */
                iportal.preferences.getNegativeBtnAlign() == 'RIGHT' ? config.RIGHT_BBAR_BUTTONS = config.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS : config.LEFT_BBAR_BUTTONS = config.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS;
            }
        }
        /** Check if portlet footer is created and then render the buttons in the portlet footer */
        this.portletFooterDiv = $(this.appDiv).find('[data-item-id=portlet-footer]');
        this.portletFooterDiv.length === 0 ? "" : $(this.portletFooterDiv).empty();
        if (config.md.VIEW_MD.FLD_BBAR_BUTTONS != undefined && !cbx.core.isEmpty(config.md.VIEW_MD.FLD_BBAR_BUTTONS)) {
            var tmpFooterLayer = new ct.lib.tmplLayer('portletFooterTemplate.cttpl', config);
            tmpFooterLayer.getTemplate(this.applyFooterTemplate, this);
        }
    }
});
CLCR.registerCmp({
    'COMP_TYPE': 'PORTLET'
}, cbx.lib.JQTBSportlet);
