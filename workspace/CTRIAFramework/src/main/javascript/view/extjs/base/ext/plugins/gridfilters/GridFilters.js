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
Ext.namespace('Ext.ux.grid');

/**
 * @class Ext.ux.grid.GridFilters
 * @extends Ext.util.Observable
 * <p>GridFilter is a plugin (<code>ptype='gridfilters'</code>) for grids that
 * allow for a slightly more robust representation of filtering than what is
 * provided by the default store.</p>
 * <p>Filtering is adjusted by the user using the grid's column header menu
 * (this menu can be disabled through configuration). Through this menu users
 * can configure, enable, and disable filters for each column.</p>
 * <p><b><u>Features:</u></b></p>
 * <div class="mdetail-params"><ul>
 * <li><b>Filtering implementations</b> :
 * <div class="sub-desc">
 * Default filtering for Strings, Numeric Ranges, Date Ranges, Lists (which can
 * be backed by a Ext.data.Store), and Boolean. Additional custom filter types
 * and menus are easily created by extending Ext.ux.grid.filter.Filter.
 * </div></li>
 * <li><b>Graphical indicators</b> :
 * <div class="sub-desc">
 * Columns that are filtered have {@link #filterCls a configurable css class}
 * applied to the column headers.
 * </div></li>
 * <li><b>Paging</b> :
 * <div class="sub-desc">
 * If specified as a plugin to the grid's configured PagingToolbar, the current page
 * will be reset to page 1 whenever you update the filters.
 * </div></li>
 * <li><b>Automatic Reconfiguration</b> :
 * <div class="sub-desc">
 * Filters automatically reconfigure when the grid 'reconfigure' event fires.
 * </div></li>
 * <li><b>Stateful</b> :
 * Filter information will be persisted across page loads by specifying a
 * <code>stateId</code> in the Grid configuration.
 * <div class="sub-desc">
 * The filter collection binds to the
 * <code>{@link Ext.grid.GridPanel#beforestaterestore beforestaterestore}</code>
 * and <code>{@link Ext.grid.GridPanel#beforestatesave beforestatesave}</code>
 * events in order to be stateful.
 * </div></li>
 * <li><b>Grid Changes</b> :
 * <div class="sub-desc"><ul>
 * <li>A <code>filters</code> <i>property</i> is added to the grid pointing to
 * this plugin.</li>
 * <li>A <code>filterupdate</code> <i>event</i> is added to the grid and is
 * fired upon onStateChange completion.</li>
 * </ul></div></li>
 * <li><b>Server side code examples</b> :
 * <div class="sub-desc"><ul>
 * <li><a href="http://www.vinylfox.com/extjs/grid-filter-php-backend-code.php">PHP</a> - (Thanks VinylFox)</li>
 * <li><a href="http://extjs.com/forum/showthread.php?p=77326#post77326">Ruby on Rails</a> - (Thanks Zyclops)</li>
 * <li><a href="http://extjs.com/forum/showthread.php?p=176596#post176596">Ruby on Rails</a> - (Thanks Rotomaul)</li>
 * <li><a href="http://www.debatablybeta.com/posts/using-extjss-grid-filtering-with-django/">Python</a> - (Thanks Matt)</li>
 * <li><a href="http://mcantrell.wordpress.com/2008/08/22/extjs-grids-and-grails/">Grails</a> - (Thanks Mike)</li>
 * </ul></div></li>
 * </ul></div>
 * <p><b><u>Example usage:</u></b></p>
 * <pre><code>
var store = new Ext.data.GroupingStore({
    ...
});

var filters = new Ext.ux.grid.GridFilters({
    autoReload: false, //don&#39;t reload automatically
    local: true, //only filter locally
    // filters may be configured through the plugin,
    // or in the column definition within the column model configuration
    filters: [{
        type: 'numeric',
        dataIndex: 'id'
    }, {
        type: 'string',
        dataIndex: 'name'
    }, {
        type: 'numeric',
        dataIndex: 'price'
    }, {
        type: 'date',
        dataIndex: 'dateAdded'
    }, {
        type: 'list',
        dataIndex: 'size',
        options: ['extra small', 'small', 'medium', 'large', 'extra large'],
        phpMode: true
    }, {
        type: 'boolean',
        dataIndex: 'visible'
    }]
});
var cm = new Ext.grid.ColumnModel([{
    ...
}]);

var grid = new Ext.grid.GridPanel({
     ds: store,
     cm: cm,
     view: new Ext.grid.GroupingView(),
     plugins: [filters],
     height: 400,
     width: 700,
     bbar: new Ext.PagingToolbar({
         store: store,
         pageSize: 15,
         plugins: [filters] //reset page to page 1 if filters change
     })
 });

store.load({params: {start: 0, limit: 15}});

// a filters property is added to the grid
grid.filters
 * </code></pre>
 */
Ext.ux.grid.GridFilters = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Boolean} autoReload
     * Defaults to true, reloading the datasource when a filter change happens.
     * Set this to false to prevent the datastore from being reloaded if there
     * are changes to the filters.  See <code>{@link updateBuffer}</code>.
     */
    autoReload : true,
    /**
     * @cfg {Boolean} encode
     * Specify true for {@link #buildQuery} to use Ext.util.JSON.encode to
     * encode the filter query parameter sent with a remote request.
     * Defaults to false.
     */
    /**
     * @cfg {Array} filters
     * An Array of filters config objects. Refer to each filter type class for
     * configuration details specific to each filter type. Filters for Strings,
     * Numeric Ranges, Date Ranges, Lists, and Boolean are the standard filters
     * available.
     */
    /**
     * @cfg {String} filterCls
     * The css class to be applied to column headers with active filters.
     * Defaults to <tt>'ux-filterd-column'</tt>.
     */
    filterCls : 'ux-filtered-column',
    /**
     * @cfg {Boolean} local
     * <tt>true</tt> to use Ext.data.Store filter functions (local filtering)
     * instead of the default (<tt>false</tt>) server side filtering.
     */
    local : false,
    /**
     * @cfg {String} menuFilterText
     * defaults to <tt>'Filters'</tt>.
     */
    menuFilterText : CRB.getFWBundle()['LBL_FILTERS'],
    /**
     * @cfg {String} paramPrefix
     * The url parameter prefix for the filters.
     * Defaults to <tt>'filter'</tt>.
     */
    paramPrefix : 'filter',
    /**
     * @cfg {Boolean} showMenu
     * Defaults to true, including a filter submenu in the default header menu.
     */
    showMenu : true,
    /**
     * @cfg {String} stateId
     * Name of the value to be used to store state information.
     */
    stateId : undefined,
    /**
     * @cfg {Integer} updateBuffer
     * Number of milliseconds to defer store updates since the last filter change.
     */
    updateBuffer : 500,
    crb : CRB.getFWBundle(),
    permanentParams : undefined, 
    /** @private */
    constructor : function (config) {
        config = config || {};
        this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
        this.filters = new Ext.util.MixedCollection();
        this.filters.getKey = function (o) {
            return o ? o.dataIndex : null;
        };
        this.addFilters(config.filters);
        delete config.filters;
        Ext.apply(this, config);
    },

    /** @private */
    init : function (grid) {
        if (grid instanceof Ext.grid.GridPanel) {
            this.grid = grid;

            this.bindStore(this.grid.getStore(), true);
            // assumes no filters were passed in the constructor, so try and use ones from the colModel
            if(this.filters.getCount() == 0){
                this.addFilters(this.grid.getColumnModel());
            }

            this.grid.filters = this;

            this.grid.addEvents({'filterupdate': true});

            grid.on({
                scope: this,
                beforestaterestore: this.applyState,
                beforestatesave: this.saveState,
                beforedestroy: this.destroy,
                reconfigure: this.onReconfigure
            });

            if (grid.rendered){
                this.onRender();
            } else {
                grid.on({
                    scope: this,
                    single: true,
                    render: this.onRender
                });
            }

        } else if (grid instanceof Ext.PagingToolbar) {
            this.toolbar = grid;
        }
    },

    /**
     * @private
     * Handler for the grid's beforestaterestore event (fires before the state of the
     * grid is restored).
     * @param {Object} grid The grid object
     * @param {Object} state The hash of state values returned from the StateProvider.
     */
    applyState : function (grid, state) {
        var key, filter;
        this.applyingState = true;
		var store=grid.getStore();	
		if(store.baseParams["LOOKUP_FLAG"]==="true"){
		var count=grid.store.baseParams["COLUMN_COUNT"];
		store.baseParams["ResetStoreValues"]="true";
		store.baseParams["LOOKUP_TEXT"]=grid.store.baseParams["FILTER"+(count)+"_FIELD"];
		store.baseParams["LOOKUP_TYPE"]=grid.store.baseParams["FILTER"+(count)+"_TYPE"];
		store.baseParams["LOOKUP_VALUE_TXT"]=grid.store.baseParams["FILTER"+(count)+"_VALUE_TXT"];
		}
        this.clearFilters();
        if (state.filters) {
            for (key in state.filters) {
                filter = this.filters.get(key);
                if (filter) {
                    filter.setValue(state.filters[key]);
                    filter.setActive(true);
                }
            }
        }
        this.deferredUpdate.cancel();
        if (this.local) {
            this.reload();
        }
        delete this.applyingState;
        delete state.filters;
    },

    /**
     * Saves the state of all active filters
     * @param {Object} grid
     * @param {Object} state
     * @return {Boolean}
     */
    saveState : function (grid, state) {
        var filters = {};
        var params={};
        var i=0;
        that=this;
        filterFlag=true;
        this.filters.each(function (filter) {
            if (filter.active) {
            	var filterValObj=filter.getValue();
            	var filterVal=filter.getValue();
        		for(k in filterValObj){
        			filterVal=filterValObj[k];
        		}
            	if(filterVal!=null){
            		if(typeof(filterVal)=="string"){
            			filterVal= filterVal.trim();
            		}
            		if(!Ext.isEmpty(filterValObj) && !Ext.isEmpty(filterVal)){
            	i++;
                filters[filter.dataIndex] = filter.getValue();
            	if(filter.type=="string"){                         
							var store = grid.getStore();
							if(store.baseParams["LOOKUP_FLAG"]==="true"){
							if(!store.baseParams["CLEAR_LOOKUPFILTERS"])
								{
								var count=store.baseParams["COLUMN_COUNT"];
								delete store.baseParams['FILTER'+(count)+'_FIELD'];
								delete store.baseParams['FILTER'+(count)+'_CONSTRAINT'];
								delete store.baseParams['FILTER'+(count)+'_VALUE_TXT']; 
								delete store.baseParams["COLUMN_COUNT"];
								delete store.baseParams["FILTER"+(count)+"_TYPE"];
								delete store.baseParams["IS_FILTER_FORM"];
								store.baseParams["CLEAR_LOOKUPFILTERS"]="true";
								store.commitChanges();
								}
							}
                		var valObj=filter.getValue();
                		var kCounter=0;
                		for(k in valObj){
                			var val=valObj[k];
                    		params["FILTER"+i+"_FIELD"]=filter.dataIndex;
                    		params["FILTER"+i+"_CONSTRAINT"]="contains";
                           	params["FILTER"+i+"_VALUE_TXT"]=val;                       	
                		}
                	}
            	else if (filter.type=="list"  && filter.getValue().length>0){
            		var val=filter.getValue();
            		if(Ext.isArray(filter.getValue())){
            			val=filter.getValue().join(",");
            		}	
            		params["FILTER"+i+"_FIELD"]=filter.dataIndex;
           			params["FILTER"+i+"_CONSTRAINT"]="in";
                   	params["FILTER"+i+"_VALUE_TXT"]=val;
                	params["FILTER"+i+"_VALUE_DATE"]="";
                	params["FILTER"+i+"_VALUE_DATE2"]="";
                	params["FILTER"+i+"_VALUE_TIME"]=" Select";	
                	params["FILTER"+i+"_VALUE_TIME2"]=" Select";	
            	}
				else if (filter.type == "numeric" || filter.type == "float" || filter.type == "rate") {
            		var store = grid.getStore();
            		var valObj=filter.getValue();
            		var jCounter=0;
            		for(j in valObj){
            			if(jCounter>0)
            				i++;
            			var val=valObj[j];
            			var cons= (j=="lt"?"<":(j=="gt"?">":(j=="most"?"M":(j=="least"?"L": "="))));	//mapping the constraint supported by server
                			params["FILTER"+i+"_FIELD"]=filter.dataIndex;                			
                			params["FILTER"+i+"_CONSTRAINT"]=cons;  
                			params["FILTER"+i+"_VALUE_TXT"]=val;                		
                    	jCounter++;
            		}
            	}
             	else if (filter.type == "date") {
							var valObj = filter.getValue();
							 
							/*Change is done to make the previous month filter work after
							selection of on filter. "If" and "If-Else" conditions Interchanged*/
								
							if (valObj["lastmonth"] != null) {
								var date = iportal.jsutil.convertDateObjectToStandardFmt(valObj["lastmonth"]);
								var time = iportal.jsutil.convertDateObjectToStandardFmt(valObj["lastmonth"]);
								params["FILTER" + i + "_FIELD"] = filter.dataIndex;
								params["FILTER" + i + "_CONSTRAINT"] = "PREVIOUS_MONTH";
								params["FILTER" + i + "_VALUE_TXT"] = "";
								params["FILTER" + i + "_VALUE_DATE"] = date;
								params["FILTER" + i + "_VALUE_DATE2"] = "";
								params["FILTER" + i + "_VALUE_TIME"] = time;
								params["FILTER" + i + "_VALUE_TIME2"] = " Select";
							}
							 else if (valObj["on"] != null) {
								var date = iportal.jsutil.convertDateObjectToStandardFmt(valObj["on"]);
								var time = iportal.jsutil.convertDateObjectToStandardFmt(valObj["on"]);
								params["FILTER" + i + "_FIELD"] = filter.dataIndex;
								params["FILTER" + i + "_CONSTRAINT"] = "dtEquals";
								params["FILTER" + i + "_VALUE_TXT"] = "";
								params["FILTER" + i + "_VALUE_DATE"] = date;
								params["FILTER" + i + "_VALUE_DATE2"] = "";
								params["FILTER" + i + "_VALUE_TIME"] = time;
								params["FILTER" + i + "_VALUE_TIME2"] = " Select";
							}
							 else if (valObj["last_n_days"] != null) {

								var ndays = iportal.jsutil.convertDateObjectToStandardFmt(valObj["last_n_days"]);
								params["FILTER" + i + "_FIELD"] = filter.dataIndex;
								params["FILTER" + i + "_CONSTRAINT"] = "LAST_N_DAY";
								params["FILTER" + i + "_VALUE_TXT"] = "";
								params["FILTER" + i + "_VALUE_PERIOD"] = ndays;
								params["FILTER" + i + "_VALUE_DATE"] = "";
								params["FILTER" + i + "_VALUE_DATE2"] = "";
								params["FILTER" + i + "_VALUE_TIME"] = "";
								params["FILTER" + i + "_VALUE_TIME2"] = " Select";
							} else if (valObj["last_n_months"] != null) {

								var nmonths = iportal.jsutil.convertDateObjectToStandardFmt(valObj["last_n_months"]);
								params["FILTER" + i + "_FIELD"] = filter.dataIndex;
								params["FILTER" + i + "_CONSTRAINT"] = "LAST_N_MONTH";
								params["FILTER" + i + "_VALUE_TXT"] = "";
								params["FILTER" + i + "_VALUE_PERIOD"] = nmonths;
								params["FILTER" + i + "_VALUE_DATE"] = "";
								params["FILTER" + i + "_VALUE_DATE2"] = "";
								params["FILTER" + i + "_VALUE_TIME"] = "";
								params["FILTER" + i + "_VALUE_TIME2"] = " Select";
							}
            		else if(valObj["before"]!=null && valObj["after"]!=null){
            			var date1=iportal.jsutil.convertDateObjectToStandardFmt(valObj["before"]);
            			var date2=iportal.jsutil.convertDateObjectToStandardFmt(valObj["after"]);
            			var time=iportal.jsutil.convertDateObjectToStandardFmt(valObj["before"]);
            			if(valObj["before"].getTime() == valObj["after"].getTime())
            			{
            				//that.showErrMsg('LBL_DATE_SELECT');
            				filterFlag= false;
            				return;
            			}
            			if(valObj["before"].getTime() < valObj["after"].getTime())
            			{
            				//that.showErrMsg('LBL_DATE_SELECT');
            				filterFlag= false;
            				return;
            			}
	            		params["FILTER"+i+"_FIELD"]=filter.dataIndex;
	            		params["FILTER"+i+"_CONSTRAINT"]="range";
	                   	params["FILTER"+i+"_VALUE_TXT"]="";
	                	params["FILTER"+i+"_VALUE_DATE"]=date2;
	                	params["FILTER"+i+"_VALUE_DATE2"]=date1;
	                	params["FILTER"+i+"_VALUE_TIME"]=time;	
	                	params["FILTER"+i+"_VALUE_TIME2"]=" Select";	
            		}
            		else{
            			for(var j in valObj){
	            			var date=iportal.jsutil.convertDateObjectToStandardFmt(valObj[j]);
	            			var time=iportal.jsutil.convertDateObjectToStandardFmt(valObj[j]);
	            			var cons= (j=="before"?"lt":(j=="after"?"gt":"dtEquals"));
		            		params["FILTER"+i+"_FIELD"]=filter.dataIndex;
		            		params["FILTER"+i+"_CONSTRAINT"]=cons;
		                   	params["FILTER"+i+"_VALUE_TXT"]="";
		                	params["FILTER"+i+"_VALUE_DATE"]=date;
		                	params["FILTER"+i+"_VALUE_DATE2"]="";
		                	params["FILTER"+i+"_VALUE_TIME"]=time;	
		                	params["FILTER"+i+"_VALUE_TIME2"]=" Select";
	            		}
            		}
            	}
            	filterFlag= true;            	
            }
            		else{
            			filter.setActive(false);
            		}
            	}else{
            		filter.setActive(false);
            	}
            }
        });
        if(filterFlag){
			var store = grid.getStore();
			this.deleteOldFilters(store.baseParams);
			if(params["FILTER"+i+"_FIELD"]!=null){
				params["COLUMN_COUNT"]=i;
				params["IS_FILTER_FORM"]=true;
				Ext.apply(store.baseParams,params);
	    	}
			
			if(this.permanentParams !=undefined){
				Ext.apply(store.baseParams,this.permanentParams);
			}
			
    	}
        return;
        /**
         * This method is the custom method to save the permanent params for the particular filter
         */
    },permanentState: function(params){
    	
    	this.permanentParams = params;
    },clearFilterValues:function(){
    	 this.filters.each(function (filter) {
    		 filter.setValue('');
    	 });
    	
    },
    deleteOldFilters : function(params){
    	for(i in params){
    		if(i.indexOf("FILTER") == 0 && i.indexOf("FILTER_DATE") != 0)
   			{
    			delete params[i];
   			}
    	}
    	delete params["COLUMN_COUNT"];
    	delete params["IS_FILTER_FORM"];
    },
    showErrMsg : function(key){
		var ewin = new iportal.Dialog({
			   dialogType:'ERROR',
			   title: this.crb["LBL_ERROR"],
			   message: this.crb[key],
			   okHandler:function(ob){
						   	ewin.close();
						   }
		   });
		   ewin.show();
    },
    /**
     * @private
     * Handler called when the grid is rendered
     */
    onRender : function () {
        this.grid.getView().on('refresh', this.onRefresh, this);
        this.createMenu();
    },

    /**
     * @private
     * Handler called by the grid 'beforedestroy' event
     */
    destroy : function () {
        this.removeAll();
        this.purgeListeners();

        if(this.filterMenu){
            Ext.menu.MenuMgr.unregister(this.filterMenu);
            this.filterMenu.destroy();
             this.filterMenu = this.menu.menu = null;
        }
    },

    /**
     * Remove all filters, permanently destroying them.
     */
    removeAll : function () {
        if(this.filters){
            Ext.destroy.apply(Ext, this.filters.items);
            // remove all items from the collection
            this.filters.clear();
        }
    },


    /**
     * Changes the data store bound to this view and refreshes it.
     * @param {Store} store The store to bind to this view
     */
    bindStore : function(store, initial){
        if(!initial && this.store){
            if (this.local) {
                store.un('load', this.onLoad, this);
            } else {
                store.un('beforeload', this.onBeforeLoad, this);
            }
        }
        if(store){
            if (this.local) {
                store.on('load', this.onLoad, this);
            } else {
                store.on('beforeload', this.onBeforeLoad, this);
            }
        }
        this.store = store;
    },

    /**
     * @private
     * Handler called when the grid reconfigure event fires
     */
    onReconfigure : function () {
        this.bindStore(this.grid.getStore());
        this.store.clearFilter();
        this.removeAll();
        this.addFilters(this.grid.getColumnModel());
        this.updateColumnHeadings();
    },

    createMenu : function () {
    	
        var view = this.grid.getView(),
            hmenu = view.hmenu;

        if (this.showMenu && hmenu) {

            this.sep  = hmenu.addSeparator();
            this.filterMenu = new Ext.menu.Menu({
                id: this.grid.id + '-filters-menu'
            });
            this.menu = hmenu.add({
                checked: false,
                itemId: 'filters',
                text: this.menuFilterText,
                menu: this.filterMenu
            });

            this.menu.on({
                scope: this,
                checkchange: this.onCheckChange,
                beforecheckchange: this.onBeforeCheck
            });
            hmenu.on('beforeshow', this.onMenu, this);
            hmenu.on('beforehide', this.beforeHide, this); 
        }
        this.updateColumnHeadings();
    },
    beforeHide:function(){
    	if(this.menu.menu.isVisible){
    		var subMenuVisible=this.menu.menu.isVisible();
    		if(subMenuVisible){
    		return false;
    		}
    	}
    },
    /**
     * @private
     * Get the filter menu from the filters MixedCollection based on the clicked header
     */
    getMenuFilter : function () {
        var view = this.grid.getView();
        if (!view || view.hdCtxIndex === undefined) {
            return null;
        }
        return this.filters.get(
            view.cm.config[view.hdCtxIndex].dataIndex
        );
    },

    /**
     * @private
     * Handler called by the grid's hmenu beforeshow event
     */
    onMenu : function (filterMenu) {
        var filter = this.getMenuFilter();

        if (filter) {

            this.menu.menu = filter.menu;
            this.menu.setChecked(filter.active, false);
            // disable the menu if filter.disabled explicitly set to true
            this.menu.setDisabled(filter.disabled === true);
        }

        this.menu.setVisible(filter !== undefined);
        this.sep.setVisible(filter !== undefined);
    },

    /** @private */
    onCheckChange : function (item, value) {
    	this.getMenuFilter().setActive(value);
    	if(value == false)
	     this.getMenuFilter().setValue('');
    },

    /** @private */
    onBeforeCheck : function (check, value) {
        return !value || this.getMenuFilter().isActivatable();
    },

    /**
     * @private
     * Handler for all events on filters.
     * @param {String} event Event name
     * @param {Object} filter Standard signature of the event before the event is fired
     */
    onStateChange : function (event, filter) {
        if (event === 'serialize') {
            return;
        }

        if (filter == this.getMenuFilter()) {
            this.menu.setChecked(filter.active, false);
        }

        if ((this.autoReload || this.local) && !this.applyingState) {
            this.deferredUpdate.delay(this.updateBuffer);
        }
        this.updateColumnHeadings();

        if (!this.applyingState) {
            this.grid.saveState();
        }
        this.grid.fireEvent('filterupdate', this, filter);
    },

    /**
     * @private
     * Handler for store's beforeload event when configured for remote filtering
     * @param {Object} store
     * @param {Object} options
     */
    onBeforeLoad : function (store, options) {
        options.params = options.params || {};
        this.cleanParams(options.params);
        var params = this.buildQuery(this.getFilterData());
		if(store.baseParams["LOOKUP_FLAG"]==="true")
		{
		this.deleteLookupFilters(options,store,params,this.getFilterData());		
		}
        //Ext.apply(options.params, params);
    },
	deleteLookupFilters:function(options,store,params,filterData)
	{
		var columnCount=0;
		for(var i in options.params){
			if(i.indexOf('_FIELD')>-1){
				columnCount++;
			}
		}		
		// this code for second time any val passed from lookup it stores last filter value
		if(!store.baseParams["CLEAR_LOOKUPFILTERS"])
		{	var optObj=Ext.decode(params.filter);
			if(optObj)
			{				
			delete optObj[0].type;
			delete optObj[0].value;
			delete optObj[0].field;
			}
			params.filter=[];			
		}
				
		// this code for delete default parameter sitting in the  stores 
		if(filterData.length>0)
			{					
				if(columnCount>filterData.length)
				{
					delete options.params["FILTER"+(columnCount)+"_CONSTRAINT"];
					delete options.params["FILTER"+(columnCount)+"_FIELD"];
					delete options.params["FILTER"+(columnCount)+"_VALUE_TXT"];
					delete options.params["FILTER"+(columnCount)+"_TYPE"];			
					options.params["COLUMN_COUNT"]=filterData.length;
				}
			}
		
		// this code added for clear the filters while click clear filter
		if(filterData.length==0)
		{
			this.clearLookupParams(store, options,params);
		}
		
	},
    /**
     * @private
     * Handler for store's load event when configured for local filtering
     * @param {Object} store
     * @param {Object} options
     */
    onLoad : function (store, options) {
        //store.filterBy(this.getRecordFilter());
    },

    /**
     * @private
     * Handler called when the grid's view is refreshed
     */
    onRefresh : function () {
        this.updateColumnHeadings();
    },

    /**
     * Update the styles for the header row based on the active filters
     */
    updateColumnHeadings : function () {
        var view = this.grid.getView(),
            i, len, filter;
        if (view.mainHd) {
            for (i = 0, len = view.cm.config.length; i < len; i++) {
                filter = this.getFilter(view.cm.config[i].dataIndex);
                if(!Ext.isEmpty(view.getHeaderCell(i))){
                	Ext.fly(view.getHeaderCell(i))[filter && filter.active ? 'addClass' : 'removeClass'](this.filterCls);
                }
            }
        }
    },

    /** @private */
    reload : function () {
        if (this.local) {
            this.grid.store.clearFilter(true);
            this.grid.store.filterBy(this.getRecordFilter());
        } else {
            var start,
                store = this.grid.store;
            this.deferredUpdate.cancel();
            if (this.toolbar) {
                start = store.paramNames.start;
                if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[start]) {
                    store.lastOptions.params[start] = 0;
                }
            }
            
            if(this.grid.reload){
            	this.grid.reload();
            }else{
            	store.reload();
            }
        }
    },

    /**
     * Method factory that generates a record validator for the filters active at the time
     * of invokation.
     * @private
     */
    getRecordFilter : function () {
        var f = [], len, i;
        this.filters.each(function (filter) {
            if (filter.active) {
                f.push(filter);
            }
        });

        len = f.length;
        return function (record) {
            for (i = 0; i < len; i++) {
                if (!f[i].validateRecord(record)) {
                    return false;
                }
            }
            return true;
        };
    },

    /**
     * Adds a filter to the collection and observes it for state change.
     * @param {Object/Ext.ux.grid.filter.Filter} config A filter configuration or a filter object.
     * @return {Ext.ux.grid.filter.Filter} The existing or newly created filter object.
     */
    addFilter : function (config) {
        var Cls = this.getFilterClass(config.type),
            filter = config.menu ? config : (new Cls(config));
        this.filters.add(filter);

        Ext.util.Observable.capture(filter, this.onStateChange, this);
        return filter;
    },

    /**
     * Adds filters to the collection.
     * @param {Array/Ext.grid.ColumnModel} filters Either an Array of
     * filter configuration objects or an Ext.grid.ColumnModel.  The columns
     * of a passed Ext.grid.ColumnModel will be examined for a <code>filter</code>
     * property and, if present, will be used as the filter configuration object.
     */
    addFilters : function (filters) {
        if (filters) {
            var i, len, filter, cm = false, dI;
            if (filters instanceof Ext.grid.ColumnModel) {
                filters = filters.config;
                cm = true;
            }
            for (i = 0, len = filters.length; i < len; i++) {
                filter = false;
                if (cm) {
                    dI = filters[i].dataIndex;
                    filter = filters[i].filter || filters[i].filterable;
                    if (filter){
                        filter = (filter === true) ? {} : filter;
                        Ext.apply(filter, {dataIndex:dI});
                        filter.type = filter.type || this.store.fields.get(dI).type.type;
                    }
                } else {
                    filter = filters[i];
                }
                if (filter) {
                    this.addFilter(filter);
                }
            }
        }
    },

    /**
     * Returns a filter for the given dataIndex, if one exists.
     * @param {String} dataIndex The dataIndex of the desired filter object.
     * @return {Ext.ux.grid.filter.Filter}
     */
    getFilter : function (dataIndex) {
        return this.filters.get(dataIndex);
    },

    /**
     * Turns all filters off. This does not clear the configuration information
     * (see {@link #removeAll}).
     */
    clearFilters : function () {
    	this.filters.each(function (filter) {
    		if(filter.active){
    			filter.setActive(false);
    		}
        });
    },

    /**
     * Returns an Array of the currently active filters.
     * @return {Array} filters Array of the currently active filters.
     */
    getFilterData : function () {
        var filters = [], i, len;

        this.filters.each(function (f) {
            if (f.active) {
                var d = [].concat(f.serialize());
                for (i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: f.dataIndex,
                        data: d[i]
                    });
                }
            }
        });
        return filters;
    },

    /**
     * Function to take the active filters data and build it into a query.
     * The format of the query depends on the <code>{@link #encode}</code>
     * configuration:
     * <div class="mdetail-params"><ul>
     *
     * <li><b><tt>false</tt></b> : <i>Default</i>
     * <div class="sub-desc">
     * Flatten into query string of the form (assuming <code>{@link #paramPrefix}='filters'</code>:
     * <pre><code>
filters[0][field]="someDataIndex"&
filters[0][data][comparison]="someValue1"&
filters[0][data][type]="someValue2"&
filters[0][data][value]="someValue3"&
     * </code></pre>
     * </div></li>
     * <li><b><tt>true</tt></b> :
     * <div class="sub-desc">
     * JSON encode the filter data
     * <pre><code>
filters[0][field]="someDataIndex"&
filters[0][data][comparison]="someValue1"&
filters[0][data][type]="someValue2"&
filters[0][data][value]="someValue3"&
     * </code></pre>
     * </div></li>
     * </ul></div>
     * Override this method to customize the format of the filter query for remote requests.
     * @param {Array} filters A collection of objects representing active filters and their configuration.
     *    Each element will take the form of {field: dataIndex, data: filterConf}. dataIndex is not assured
     *    to be unique as any one filter may be a composite of more basic filters for the same dataIndex.
     * @return {Object} Query keys and values
     */
    buildQuery : function (filters) {
        var p = {}, i, f, root, dataPrefix, key, tmp,
            len = filters.length;

        if (!this.encode){
            for (i = 0; i < len; i++) {
                f = filters[i];
                root = [this.paramPrefix, '[', i, ']'].join('');
                p[root + '[field]'] = f.field;

                dataPrefix = root + '[data]';
                for (key in f.data) {
                    p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
                }
            }
        } else {
            tmp = [];
            for (i = 0; i < len; i++) {
                f = filters[i];
                tmp.push(Ext.apply(
                    {},
                    {field: f.field},
                    f.data
                ));
            }
            // only build if there is active filter
            if (tmp.length > 0){
                p[this.paramPrefix] = Ext.util.JSON.encode(tmp);
            }
        }
        return p;
    },

    /**
     * Removes filter related query parameters from the provided object.
     * @param {Object} p Query parameters that may contain filter related fields.
     */
    cleanParams : function (p) {
        // if encoding just delete the property
        if (this.encode) {
            delete p[this.paramPrefix];
        // otherwise scrub the object of filter data
        } else {
            var regex, key;
            regex = new RegExp('^' + this.paramPrefix + '\[[0-9]+\]');
            for (key in p) {
                if (regex.test(key)) {
                    delete p[key];
                }
            }
        }
    },

    /**
     * Function for locating filter classes, overwrite this with your favorite
     * loader to provide dynamic filter loading.
     * @param {String} type The type of filter to load ('Filter' is automatically
     * appended to the passed type; eg, 'string' becomes 'StringFilter').
     * @return {Class} The Ext.ux.grid.filter.Class
     */
    getFilterClass : function (type) {
        // map the supported Ext.data.Field type values into a supported filter
        switch(type) {
            case 'auto':
              type = 'string';
              break;
            case 'int':
            case 'float':
              type = 'numeric';
              break;
            case 'bool':
              type = 'boolean';
              break;
        }
        return Ext.ux.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}, 
	clearLookupParams : function (store, options, params){
		
		var lookUpArray=new Array();
		lookUpArray.push(options.params);
		lookUpArray.push(store.baseParams);	
		for ( var j = 0; j < lookUpArray.length; j++) {
			var lookupParams = lookUpArray[j];
			for (i in lookupParams) {
				if (i.indexOf('FILTER') === 0) {
					delete lookupParams[i]
				}
			}
		}
		
	}
});

// register ptype
Ext.preg('gridfilters', Ext.ux.grid.GridFilters);
