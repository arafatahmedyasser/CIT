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
cbx.namespace('iportal.listview');

Ext.override(Ext.ux.grid.livegrid.GridView, {
	/**
	 * Overriding the default destroy method by deleting colMenu and hmenu properties completely
	 */
	destroy : function (){
		if (this.hmenu && this.hmenu.getComponent("filters") == null) {
			Ext.menu.MenuMgr.unregister(this.hmenu);
			this.hmenu.destroy();
			delete this.hmenu;
		}
		if (this.colMenu) {
			Ext.menu.MenuMgr.unregister(this.colMenu);
			this.colMenu.destroy();
			delete this.colMenu;
		}
		if (this.hmenu) {
			Ext.menu.MenuMgr.unregister(this.hmenu);
			this.hmenu.destroy();
			delete this.hmenu;
		}

		this.initData(null, null);
		this.purgeListeners();
		Ext.fly(this.innerHd).un("click", this.handleHdDown, this);

		if (this.grid.store) {
			this.grid.store.destroy();
		}

		if (this.grid.enableColumnMove) {
			Ext.destroy(this.columnDrag.el, this.columnDrag.proxy.ghost, this.columnDrag.proxy.el, this.columnDrop.el,
						this.columnDrop.proxyTop, this.columnDrop.proxyBottom, this.columnDrag.dragData.ddel,
						this.columnDrag.dragData.header);
			if (this.columnDrag.proxy.anim) {
				Ext.destroy(this.columnDrag.proxy.anim);
			}
			delete this.columnDrag.proxy.ghost;
			delete this.columnDrag.dragData.ddel;
			delete this.columnDrag.dragData.header;
			this.columnDrag.destroy();
			delete Ext.dd.DDM.locationCache[this.columnDrag.id];
			delete this.columnDrag._domRef;

			delete this.columnDrop.proxyTop;
			delete this.columnDrop.proxyBottom;
			this.columnDrop.destroy();
			delete Ext.dd.DDM.locationCache["gridHeader" + this.grid.getGridEl().id];
			delete this.columnDrop._domRef;
			delete Ext.dd.DDM.ids[this.columnDrop.ddGroup];
		}

		if (this.splitZone) {
			this.splitZone.destroy();
			delete this.splitZone._domRef;
			delete Ext.dd.DDM.ids["gridSplitters" + this.grid.getGridEl().id];
		}

		Ext.fly(this.innerHd).removeAllListeners();
		Ext.removeNode(this.innerHd);
		delete this.innerHd;

		Ext.fly(this.mainHd).removeAllListeners();
		Ext.removeNode(this.mainHd);

		delete this.mainHd;

		Ext.destroy(this.el, this.mainWrap, this.mainHd, this.scroller, this.mainBody, this.focusEl, this.resizeMarker,
					this.resizeProxy, this.activeHdBtn, this.dragZone, this.splitZone, this._flyweight);

		delete this.grid.container;

		if (this.dragZone) {
			this.dragZone.destroy();
		}

		Ext.dd.DDM.currentTarget = null;
		delete Ext.dd.DDM.locationCache[this.grid.getGridEl().id];

		Ext.EventManager.removeResizeListener(this.onWindowResize, this);
	},
	/**
	 * Method is indended to return the total columns and width used for all the columns marked as fixed within the
	 * view.
	 */
	getFixedColumnStats : function (){
		var totalWidth = 0;
		var totalColumns = 0;
		for ( var index = 0; index < this.cm.columns.length; index++) {
			if (!Ext.isEmpty(this.cm.columns[index]) && this.cm.columns[index].fixed) {
				totalWidth += this.cm.columns[index].width;
				totalColumns++;
			}
		}
		return {
			totalWidth : totalWidth,
			totalColumns : totalColumns
		};
	},
	/**
	 * 
	 */
	handleHdMenuClickDefault: function(item) {
    	
        var colModel = this.cm,
            itemId   = item.getItemId(),
            index    = colModel.getIndexById(itemId.substr(4));
        var colTypeCount = 0;
        if (!Ext.isEmpty(this.cm.columns)) {
			for ( var temp = 0; temp < this.cm.columns.length; temp++) {
				if (!Ext.isEmpty(this.cm.columns[temp])) {
				if(this.cm.columns[temp].xtype == "actioncolumn" ||this.cm.columns[temp].dataIndex == 'checker' ||this.cm.columns[temp].xtype == "contextcolumn" ||this.cm.columns[temp].xtype =="iportalcheck" )
						colTypeCount++;														
				}						
			 }						
		}
        if (index != -1) {
            if (item.checked && colModel.getColumnsBy(this.isHideableColumn, this).length <= colTypeCount+1) {
                this.onDenyColumnHide();
                return false;
            }
            colModel.setHidden(index, item.checked);
        }
    },
	/**
	 * 
	 */
	autoExpand : function (preventUpdate){
		try {
			var g = this.grid, cm = this.cm;

			if (!this.userResized && g.autoExpandColumn) {
				var tw = g.tw || cm.getTotalWidth(false);
				if (g.tw == null) {
					g.tw = tw;
				}
				var aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
				/**
				 * Resetting the width of all the columns to average width to have equal size columns
				 */
				var totalWidth = tw > aw ? tw : aw;
				var totalColumns = this.cm.getColumnCount(true);
				/**
				 * Code for excludig all the columns with fixed width aout of the auto expand logic.
				 */
				var fixedColumn = this.getFixedColumnStats();
				totalColumns = totalColumns - fixedColumn.totalColumns;
				totalWidth = totalWidth - fixedColumn.totalWidth;
				var avgWidth = totalWidth / totalColumns;
				g.autoExpandMax = avgWidth - 1
				if (!Ext.isEmpty(this.cm.columns)) {
					for ( var index = 0; index < this.cm.columns.length; index++) {
						if (!Ext.isEmpty(this.cm.columns[index])) {
							if (this.cm.columns[index].hidden === false) {
								cm.setColumnWidth(index, Math.floor(avgWidth), false);
							}
						}
					}
				}
				if (tw < aw) {
					var ci = cm.getIndexById(g.autoExpandColumn);
					var currentWidth = cm.getColumnWidth(ci);
					var cw = Math.min(Math.max(((aw - tw) + currentWidth), g.autoExpandMin), g.autoExpandMax);
					if (cw != currentWidth) {
						cm.setColumnWidth(ci, cw, true);
						if (preventUpdate !== true) {
							this.updateColumnWidth(ci, cw);
						}
					}
				}
			}
			else{
				this.updateHeaders(); 
				this.updateHeaderSortState();
			}
		} 
		catch (e) {
			LOGGER.error("While auto Expanding the view : list ::" +e);
		}
	},
	/**
	 * 
	 */
	layout : function() {
		if (!this.mainBody) {
			return
		}
		var E = this.grid;
		var G = E.getGridEl(), I = this.cm, B = E.autoExpandColumn, A = this;
		var C = G.getSize(true);
		var H = C.width;
		if (!E.hideHeaders && H < 20 || C.height < 20) {
			return
		}
		if (E.autoHeight) {
			this.scroller.dom.style.overflow = "visible";
			if (Ext.isWebKit) {
				this.scroller.dom.style.position = "static"
			}
		} else {
			this.el.setSize(C.width, C.height);
			var F = this.mainHd.getHeight();
			var D = C.height - (F);
			this.scroller.setSize(H, D);
			if (this.innerHd) {
				this.innerHd.style.width = (H) + "px";
			}
		}
		this.liveScroller.dom.style.top = this.hdHeight + "px";
		if (this.forceFit) {
			if (this.lastViewWidth != H) {
				this.fitColumns(false, false);
				this.lastViewWidth = H
			}
		} else {
			var that=this;
			setTimeout(function (){
				that.autoExpand();	
			},3);
		}
		this.adjustVisibleRows();
		this.adjustBufferInset();
		this.onLayout(H, D);
	},
	/**
	 * 
	 */
	getIndexById: function(id){
		var columns= this.cm.grpColumns;
		var childCols;
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].id == id) {
            
                return i;
            }
            childCols=columns[i].childs;
            if(childCols && childCols.length>0){
            	for(var k=0,kLen=childCols.length; k<kLen; k++){
            		if(childCols[k].id==id){
            			return i;
            		}
            	}
            }
        }
        return -1;		
	},
	
	/**
	 * 
	 */
    getGroupedCellIndex : function(el) {
        if (el) {
            var match = el.className.match(this.colRe);
            
            if (match && match[1]) {
            		return this.getIndexById(match[1]);
            }
        }
        return false;
    },
    /**
	 * <p>
	 * Return the index of the grid column which contains the passed HTMLElement.
	 * </p>
	 * See also {@link #findRowIndex}
	 * 
	 * @param {HTMLElement} el The target element
	 * @return {Number} The column index, or <b>false</b> if the target element is not within a row of this GridView.
	 */
    findGroupedCellIndex : function(el, requiredCls) {
    
        var cell = this.findCell(el),
            hasCls;
        if (cell) {
            hasCls = this.fly(cell).hasClass(requiredCls);
            if (!requiredCls || hasCls) {
                return this.getGroupedCellIndex(cell);
            }
        }
        return false;
    },
    /**
     * 
     */
	ensureVisible : function(K, C, B) {
		if (typeof K != "number") {
			K = K.rowIndex
		}
		if (K < 0 || K >= this.ds.totalLength) {
			return
		}
		C = (C !== undefined ? C : 0);
		var H = K - this.rowIndex;
		if (this.rowClipped
				&& K == this.rowIndex + this.visibleRows - 1) {
			this.adjustScrollerPos(this.rowHeight)
		} else {
			if (K >= this.rowIndex + this.visibleRows) {
				this
						.adjustScrollerPos(((K - (this.rowIndex + this.visibleRows)) + 1)
								* this.rowHeight)
			} else {
				if (K <= this.rowIndex) {
					this
							.adjustScrollerPos((H)
									* this.rowHeight)
				}
			}
		}
		var G = this.getRow(K), D;
		if (!G) {
			return
		}
		if (!(B === false && C === 0)) {
			while (this.cm.isHidden(C)) {
				C++
			}
			D = this.getCell(K, C)
		}
		var J = this.scroller.dom;
		if (B !== false) {
			var I = parseInt(D.offsetLeft, 10);
			var F = I + D.offsetWidth;
			var E = parseInt(J.scrollLeft, 10);
			var A = E + J.clientWidth;
			if (I < E) {
				J.scrollLeft = I
			} else {
				if (F > A) {
					J.scrollLeft = F - J.clientWidth
				}
			}
		}
		/**
		 * If more columns available (or) the Grid width is greater means, while click the row in the last column, the
		 * grid data moved left (ie) the grid data not sync with scrollbar. Reason : ensureVisible() method return
		 * greater value. Solution : comment the 'J.scrollLeft' value and return only the the x, y position.
		 */
		return D ? Ext.fly(D).getXY() : [		                                 
				/* J.scrollLeft + */ this.el.getX(),
				Ext.fly(G).getY() ];				
		},
	    /**
		 * @private Called when a header cell is clicked - shows the menu if the click happened over a trigger button
		 */
		handleHdDown : function(e, target) {
			if(Ext.isEmpty(this.isResponsiveGrid)|| !this.isResponsiveGrid)	{
				this.superclass().handleHdDown.call(this,e, target);
				return;
			}
			if (Ext.fly(target).hasClass('x-grid3-hd-btn')) {
				e.stopEvent();
				var colModel  = this.expandcm,
				header    = this.findHeaderCell(target),
				index     = this.getCellIndex(header),
                menu      = this.colMenu,
                menuCls   = this.headerMenuOpenCls;
				this.hdCtxIndex = index;
				Ext.fly(header).addClass(menuCls);
				menu.on('hide', function() {
					Ext.fly(header).removeClass(menuCls);
				}, this, { single:true });
				menu.show(target, 'tl-bl?');
			}
		},

	/**
	 * @private Click handler for the shared column dropdown menu, called on beforeshow. Builds the menu which displays
	 *          the list of columns for the user to show or hide.
	 */
	beforeColMenuShow : function() {
		if(Ext.isEmpty(this.isResponsiveGrid)||!this.isResponsiveGrid)
			{
			this.superclass().beforeColMenuShow.call(this);
			return;
			}
		
	
	    var colModel = this.expandcm,
	        colCount = colModel.getColumnCount(),
	        colMenu  = this.colMenu,
	        i,
	        sortable;
	
	    colMenu.removeAll();
	    var that=this;
	    var thatGridFilter=this.grid.gridFilter;
	    var columns;
	    for (i = 0; i < colCount; i++) {
	        if (colModel.config[i].hideable !== false) {
	        	sortable  = colModel.isSortable(i);
	      /*
			 * columns=new Ext.menu.Item({ text : colModel.getColumnHeader(i), itemId : 'resp-col-' +
			 * colModel.getColumnId(i), disabled : colModel.config[i].hideable === false, hideOnClick: false, menu:[],
			 * iconCls: 'x-cols-icon'}); for(var j=0;j<this.hmenu.items.getCount();j++){
			 * 
			 * var item=this.hmenu.items.get(j); columns.menu.add(item);
			 * columns.menu.on('itemclick',that.handleHdMenuClick,that); }
			 * 
			 * 
			 * colMenu.add(columns);
			 */
	           colMenu.add(new Ext.menu.Item({
	                text       : colModel.getColumnHeader(i),
	                itemId     : 'resp-col-' + colModel.getColumnId(i),
	                disabled   : colModel.config[i].hideable === false,
	                hideOnClick: false,
	                iconCls: 'x-cols-icon',
	                menu:{
	                	items:[{
	                			itemId:'asc',  
	                			text: this.sortAscText,
	                			disabled:!sortable,
	                			cls: 'xg-hmenu-sort-asc'
	                				},
	                	       {
	                			itemId:'desc',
	                			text: this.sortDescText, 
	                			disabled:!sortable,
	                			cls: 'xg-hmenu-sort-desc'
	                				},
	                			{
	                					checked : false,
	                					itemId : 'filters',
	                					text : thatGridFilter.menuFilterText,
	                					// menu:[]
	                					menu : thatGridFilter.filters.get(i).menu,
	                					listeners:{
	                						'checkchange':thatGridFilter.onCheckChange.createDelegate(thatGridFilter),
	                						'beforecheckchange':thatGridFilter.onBeforeCheck.createDelegate(thatGridFilter),
	                						'beforeshow':thatGridFilter.onMenu.createDelegate(thatGridFilter),
	                						'beforehide':thatGridFilter.beforeHide.createDelegate(thatGridFilter)
	                			}
	                		}],
	                				
	                      listeners:{
	                            	'itemclick':that.handleHdMenuClick.createDelegate(that)
	                            },
	                     itemMenuIndex:i
	                	      
	                }
	                
	            }));
	        }
	    }
	},
	
	/**
	 * @private Attached as the 'itemclick' handler to the header menu and the column show/hide submenu (if available).
	 *          Performs sorting if the sorter buttons were clicked, otherwise hides/shows the column that was clicked.
	 */
	handleHdMenuClick : function(item) {
		
		if(Ext.isEmpty(this.isResponsiveGrid)||!this.isResponsiveGrid)
		{
			this.superclass().handleHdMenuClick.call(this,item);
			return;
		}
		var itemMenuIndex;
		if(Ext.isEmpty(item.parentMenu)||Ext.isEmpty(item.parentMenu.itemMenuIndex)) {
			itemMenuIndex=this.hdCtxIndex;
		}
		else {
			itemMenuIndex=item.parentMenu.itemMenuIndex;	
		}
		
	    var store     = this.ds,
	    dataIndex = this.expandcm.getDataIndex(itemMenuIndex);
	    switch (item.getItemId()) {
	        case 'asc':
	            store.sort(dataIndex, 'ASC');
	            break;
	        case 'desc':
	            store.sort(dataIndex, 'DESC');
	            break;
	    }
	    return true;
	},
	
	/**
	 * 
	 */   
	beforeColMenuShowGroup:function()
	{
		var colMenu  = this.colMenu;
		var colModel;
		var cm;
		colModel= this.expandcm.grpColumns;
		cm=this.expandcm; 
		colMenu.removeAll();
		var thatGridFilter=this.grid.gridFilter;
		var that=this;
		for(var i=0; i<colModel.length;i++){
			sortable  = cm.isSortable(i);
			if(colModel[i].id == 'checker'){
				 continue;
			}
			if(colModel[i].childs){
			if(this.childMenu){
				this.childMenu.destroy();
			}
			this.childMenu = new Ext.menu.Menu({id:colModel[i].id + '-hcols-menu'});
			var parentHidden;
			var colChildModel = colModel[i].childs;
			for(var j=0; j< colChildModel.length;j++){
				this.childMenu.add(new Ext.menu.Item({
				text    : cm.getColumnById(colChildModel[j].id).header, 
				itemId  : 'resp-col-' + colChildModel[j].id,
				iconCls	: 'x-cols-icon',
				menu 	: {
					items:[{
            			itemId:'asc',  
            			text: this.sortAscText,
            			disabled:!sortable,
            			cls: 'xg-hmenu-sort-asc'
				    },{
            			itemId:'desc',
            			text: this.sortDescText, 
            			disabled:!sortable,
            			cls: 'xg-hmenu-sort-desc'
				    },{
    					checked : false,
    					itemId : 'filters',
    					text : thatGridFilter.menuFilterText,
    					menu : thatGridFilter.filters.get(i).menu,
    					listeners:{
    						'checkchange':thatGridFilter.onCheckChange.createDelegate(thatGridFilter),
    						'beforecheckchange':thatGridFilter.onBeforeCheck.createDelegate(thatGridFilter),
    						'beforeshow':thatGridFilter.onMenu.createDelegate(thatGridFilter),
    						'beforehide':thatGridFilter.beforeHide.createDelegate(thatGridFilter)
    					}
				    }],
				listeners:{
					'itemclick':that.handleHdMenuClick.createDelegate(that)
                },
                itemMenuIndex : i
            },
            hideOnClick: false
		}));
		this.childCol = true;
		this.childMenu.on("itemclick", this.updateHiddenColumns, this ,this.childcol );
		this.childMenu.on({
			scope     : this
			// beforeshow: this.beforeColChildMenuShow,
			// itemclick : this.handleHdChildMenuClick
		});
	}
	var childsHidden =0;
	for(var k=0; k< colChildModel.length; k++){
		if(colChildModel[k].hidden){
			childsHidden++;
		}
	}
	if(childsHidden == colChildModel.length){
        parentHidden = true;
     }
     else{
        parentHidden = false;
	}
	colMenu.add(new Ext.menu.Item({
         text       : colModel[i].header,
         itemId     : 'resp-col-' + colModel[i].id,
         iconCls: 'x-cols-icon',
         menu : this.childMenu ? this.childMenu : {
            	items:[{
        			itemId:'asc',  
        			text: this.sortAscText,
        			disabled:!sortable,
        			cls: 'xg-hmenu-sort-asc'
        		},{
        			itemId:'desc',
        			text: this.sortDescText, 
        			disabled:!sortable,
        			cls: 'xg-hmenu-sort-desc'
        		},{
					checked : false,
					itemId : 'filters',
					text : thatGridFilter.menuFilterText,
					menu : thatGridFilter.filters.get(i).menu,
					listeners:{
						'checkchange':thatGridFilter.onCheckChange.createDelegate(thatGridFilter),
						'beforecheckchange':thatGridFilter.onBeforeCheck.createDelegate(thatGridFilter),
						'beforeshow':thatGridFilter.onMenu.createDelegate(thatGridFilter),
						'beforehide':thatGridFilter.beforeHide.createDelegate(thatGridFilter)
        			}
        		}],
              listeners:{
                    	'itemclick':that.handleHdMenuClick.createDelegate(that)
                    },
             itemMenuIndex:i
         },
         hideOnClick: false
     }));	
}
	else{
		colMenu.add(new Ext.menu.Item({
			text       : cm.getColumnById(colModel[i].id).header, 
		    itemId     : 'resp-col-' + colModel[i].id,
		    iconCls: 'x-cols-icon',
		    menu : {
		    	items:[{
        			itemId:'asc',  
        			text: this.sortAscText,
        			disabled:!sortable,
        			cls: 'xg-hmenu-sort-asc'
		    	},{
        			itemId:'desc',
        			text: this.sortDescText, 
        			disabled:!sortable,
        			cls: 'xg-hmenu-sort-desc'
	            },{
					checked : false,
					itemId : 'filters',
					text : thatGridFilter.menuFilterText,
					// menu:[]
					menu : thatGridFilter.filters.get(i).menu,
					listeners:{
						'checkchange':thatGridFilter.onCheckChange.createDelegate(thatGridFilter),
						'beforecheckchange':thatGridFilter.onBeforeCheck.createDelegate(thatGridFilter),
						'beforeshow':thatGridFilter.onMenu.createDelegate(thatGridFilter),
						'beforehide':thatGridFilter.beforeHide.createDelegate(thatGridFilter)
					}
	            }],
              listeners:{
                    	'itemclick':that.handleHdMenuClick.createDelegate(that)
                    },
             itemMenuIndex:i
         },
		 hideOnClick: false
		         }));
			 }
		 }
	},
	onDataChange : function(){
    	this.refresh(true);
    	this.updateHeaderSortState();
    } ,
	reset : function(forceReload, addParams)
    {
        if (forceReload === false || Ext.isObject(forceReload)) {
            var conf = forceReload || {};

            this.ds.modified = [];
            //this.grid.selModel.clearSelections(true);

            this.rowIndex      = conf.rowIndex !== undefined ? conf.rowIndex : 0;
            this.lastScrollPos = conf.lastScrollPos !== undefined ? conf.lastScrollPos : 0;
            this.lastRowIndex = conf.lastRowIndex !== undefined ? conf.lastRowIndex : 0;
            this.lastIndex    = conf.lastIndex !== undefined ? conf.lastIndex : 0;

            this.adjustVisibleRows();

            this.showLoadMask(false);

            var _ofn = this.processRows;
            this.processRows = Ext.emptyFn;
            this.suspendEvents();
            this.refresh(true);
            this.resumeEvents();
            this.processRows = _ofn;
            this.processRows(0);

            this.adjustScrollerPos(-this.liveScroller.dom.scrollTop, true);
            this.adjustScrollerPos(
                this.rowIndex * this.rowHeight,
                true
            );

            this.fireEvent('cursormove', this, this.rowIndex,
                Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                this.ds.totalLength);
            this.fireEvent('reset', this, false);
			this.refresh(true);
            return false;
        } else {
            var params = Ext.apply({}, addParams),
                sInfo  = this.ds.sortInfo;

            var pn = this.ds.paramNames,
                cp = {};

            cp[pn.dir]  = sInfo.direction;
            cp[pn.sort] = sInfo.field;

            if (sInfo) {
                params = Ext.apply(params, cp);
            }

            this.fireEvent('reset', this, forceReload, params);
            return this.ds.load({params : params});
        }
    }
});

iportal.listview.livegrid = Ext.extend(Ext.ux.grid.livegrid.GridPanel, {
		showselectedRowsinLookUp: false,//Fix for multiselect
		// Either an Array of field definition objects as
		// passed to Ext.data.Record.create, or a Record
		// constructor created using Ext.data.Record.create.
		recordType : [],
		// The bottom tool bar of the panel. This can be a
		// Ext.Toolbar object, a toolbar config, or an array
		// of buttons/button configs to be added to the
		// toolbar
		buttonBar : null,
		// extraParamsHandler needs to invoke to submit
		// Extra parameters as part of request params while
		// grid component retrieving data from server
		extraParamsHandler : null,
		//
		scrollNotRequired : false,
		productCode : "",
		subProductCode : "",
		functionCode : "",
		checkboxselection : false,
	
		// An function needs to executes when a row is
		// selected.
		rowSelectEvent : "",
		skipDataResult:false,   
		cellActions : null,
		filterparams : null,
		loadHandler : Ext.emptyFn,
		enableHdMenu : true,
		pageSize : null,
		sortConfig : null, 
		autoLoadStore : true, // to load the grid data
		// only in case of the
		// expanded mode.
		initComponent : function (){
			var rb = CRB.getFWBundle(); 
			var cuser = CRB.getFWBundle(); 
			this.on("viewready", this.handleViewReady, this);
										// attaching the
										// 'viewready' event
										// to the livegrid
										
			var selectionModel = new Ext.ux.grid.livegrid.RowSelectionModel({
				singleSelect : true
			});
			this.on("columnmove", this.handleViewReady,this);
			// if checkboxselection is enabled in component
			// need to create object of
			// CheckboxSelectionModel to add it in component
			if (this.checkboxselection == true) {
				selectionModel = new iportal.livegrid.checkboxSelectionModel({
					singleSelect : false
				});
	
			}
			if (!Ext.isEmpty(this.rowSelectEvent)) {
				selectionModel.addListener("rowselect", this.rowSelectEvent, this);
			}
			var extraParams = {
				"__LISTVIEW_REQUEST" : "Y",
				"PAGE_CODE_TYPE" : 'VDF_CODE',
				"INPUT_ACTION" : "INIT_DATA_ACTION",
				"PRODUCT_NAME" : this.productCode,
				"INPUT_FUNCTION_CODE" : this.functionCode,
				"INPUT_SUB_PRODUCT" : this.subProductCode,
				"WIDGET_ID" : this.itemId.substring(0, this.itemId.indexOf("__GRID")),
				"VIEW_ID" : this.view_id,
				
				"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
				"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
			
				"forceCallbacks" : true
			};
			if (!Ext.isEmpty(this.filterparams)) {
				for (each in this.filterparams) {
					extraParams[each] = this.filterparams[each];
				}
	
			}
			var that = this;
	
			this.eqccyCfg = {
				'EQUIV_AMT' : this.eqlCcyhandler.createDelegate(this)
			}, 
			this.selectedCcy = iportal.preferences.getEquivalentCurrency();
			if (this.selectedCcy){
				extraParams['CURRENCY_CD'] = this.selectedCcy;
				extraParams["RATECARD"] = iportal.preferences.getRateCard();
			}
			this.setScrollNotRequired = function (autoHeight){
	
				this.scrollNotRequired = autoHeight;
			}
	
			// if application specific extraParamsHandler is
			// given , frmaemwork invokes the handler to
			// append above extraParams with the application
			// specific required params entries.
			
			
			 
			function getExtParams (param){
				if (!Ext.isEmpty(param)) {
					var extParams = param.apply(that, [ extraParams ]);
					if (!Ext.isEmpty(that.filterparams)) {
						for (each in that.filterparams) {
							extParams[each] = that.filterparams[each];
						}
					}
					return extParams;
	
				} else {
					return extraParams;
				}
	
			}
			
			
			 
			/*
			 * To display emptyText in List View if a customised message to be passed
			 */
			var emptyTextMsg = rb.LOADING; 
			if (Ext.util.Format.trim(this.emptyText) !== '')
				emptyTextMsg = this.emptyText;
			// livegrid
			this.bufferedReader = new Ext.ux.grid.livegrid.JsonReader({
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT',
				id : 'id'
			}, this.recordType);
			
			/**
			 * Intended to call the getExtparams Methods to have the updated params including
			 * extraParamsHandler
			 */
			function doBeforeLoad (store, options){
				var params = getExtParams(that.extraParamsHandler);
				Ext.apply(options.params, params);
			}
			
			/**
			 * This intended to hide and remove REFRESh_DATE property from request params if
			 * available
			 */
			 	// End of Setting last updated date value
				// To Display Disclaimer Text above the
				// footer layer starts
			/**
			 * passing the store & records. Once it receives firing the event.
			 */
			function doAfterLoad (store, records){
				that.ownerCt.mvConf.fireEvent('resizeafterdatacall', records.length); 
				
				if(records.reader && records.reader.jsonData &&
							records.reader.jsonData.response && 
							records.reader.jsonData.response.value &&
							records.reader.jsonData.response.value.ADDITIONAL_DATA &&
							records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR){
					if(rb[records.params['WIDGET_ID']+"_ENTL_ERROR"]){
						that.view.emptyText = rb[records.params['WIDGET_ID']+"_ENTL_ERROR"];
					}else{
						that.view.emptyText = rb[records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR];
					}
				}
				
				/**
				 * Can give widget oriented empty text in the grid, if the widget do have any
				 * records to show.
				 */
				
				else if(this.baseParams.IS_FILTER_FORM && !that.isDataAvailable()){
					var widgetResBundle = CRB.getBundle(that.bundle);
					
					if(widgetResBundle[that.systemViewId+"_FILTER_NO_DATA_MSG"]){
	
						that.view.emptyText = widgetResBundle[that.systemViewId+"_FILTER_NO_DATA_MSG"]; 
	
					}else{
						that.view.emptyText = rb.FILTER_NO_DATA_MSG;
					}
				}
				
				else if(cbx.isEmpty(records.length) || records.length == 0){
					var widgetResBundle = CRB.getBundle(that.bundle);
					if(widgetResBundle[that.systemViewId+"_NO_DATA_MSG"]){
						that.view.emptyText = widgetResBundle[that.systemViewId+"_NO_DATA_MSG"];
					}
					else{
						that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''?that.emptyText:rb.NO_DATA_MSG;
					}
				}
				
				var panelId = that.id.replace('__GRID', '_PANEL');
	
				// var disc_manager =
				// iportal.framework.globaldisclaimer.getInstance();
				if (that.bufferedReader.jsonData) {
					var jsonData = that.bufferedReader.jsonData;
					
				} 
			
				// To Display Disclaimer Text above the
				// footer layer ends
				if (this.baseParams.REFRESH_DATA)
					delete this.baseParams.REFRESH_DATA;
				if (that.lmask != null) { // <!-- Verifed
					// wheather the
					// load mask is
					// null or
					// not-->
					that.lmask.hide();
				}
	
				
													
				that.view.applyEmptyText();
				
				
	

			}
			doAfterLoad = doAfterLoad.createSequence(this.loadHandler);
			
			/*
			 * response data for grid is available then this flag used to stop the store auto load
			 * functionality
			 */
			
			 if(this.skipDataResult==true) { this.autoLoadStore=false; }
			 
			var pageSize = iportal.systempreferences.getPageSizeForPagination();
			if (this.pageSize != null && this.pageSize != "" && !isNaN(this.pageSize)) {
				try {
					var mdPageSize = parseInt(this.pageSize);
					if (mdPageSize > 1) {
						pageSize = mdPageSize;
					}
				} catch (e) {
					pageSize = 45;
				}
			}

			this.store = new Ext.ux.grid.livegrid.Store({
				autoLoad : this.autoLoadStore, 
				bufferSize : pageSize, // buffersize is
				// hardcoded, its not
				// reading from property
				// file as its changing
				// during scroll action
				baseParams : getExtParams(this.extraParamsHandler),
				reader : this.bufferedReader,
				url : iportal.listview.listviewconstants.AJAX_URL,
				sortInfo : this.sortConfig, 
				listeners : {
					"load" : doAfterLoad,
					'loadexception' : doAfterLoad,
					"beforeload" : doBeforeLoad
				}
			
			});
			this.selModel = selectionModel;
			var colListLength = this.columnList.length;
			if (Ext.isEmpty(colListLength)) {
				colListLength = 0;
			}
			if (!Ext.isEmpty(this.columnList.length) && this.columnList.length > 0) {
				if (colListLength > 10) {
					this.autoExpandColumn = this.columnList[colListLength - 1];
					// DIT_315_UPD Starts
					this.autoExpandMin = 150;
					// this.autoExpandMin = 500;
					
				}
			}
	
			/*
			 *  To add min and max expand column value, restricting the last
			 * column resize range
			 */
			
			this.autoExpandMax = 500
			// this.autoExpandMax = 500 
			
			this.autoExpandMin = 150
		
			var viewConfig = {
				autoFill : false,// visibleColumnCount>10?false:true,
				forceFit : false, // visibleColumnCount>10?false:true,
				emptyText : emptyTextMsg,
				nearLimit : 3,
				loadMask : {
					msg : rb.LOADING_MSG
				},
				/**
				 * 
				 */
				autoExpand : function (preventUpdate){
					try {
						var g = this.grid, cm = this.cm;

						if (!this.userResized && g.autoExpandColumn) {
							var tw = g.tw || cm.getTotalWidth(false);
							if (g.tw == null) {
								g.tw = tw;
							}
							var aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
							/**
							 * Resetting the width of all the columns to average width to have equal size columns
							 */
							var totalWidth = tw > aw ? tw : aw;
							var totalColumns = this.cm.getColumnCount(true);
							/**
							 * Code for excludig all the columns with fixed width aout of the auto expand logic.
							 */
							var fixedColumn = this.getFixedColumnStats();
							totalColumns = totalColumns - fixedColumn.totalColumns;
							totalWidth = totalWidth - fixedColumn.totalWidth;
							var avgWidth = totalWidth / totalColumns;
							g.autoExpandMax = avgWidth - 1
							if (!Ext.isEmpty(this.cm.columns)) {
								for ( var index = 0; index < this.cm.columns.length; index++) {
									if (!Ext.isEmpty(this.cm.columns[index])) {
										if (this.cm.columns[index].hidden === false) {
											cm.setColumnWidth(index, Math.floor(avgWidth), false);
										}
									}
								}
							}
							if (tw < aw) {
								var ci = cm.getIndexById(g.autoExpandColumn);
								var currentWidth = cm.getColumnWidth(ci);
								var cw = Math.min(Math.max(((aw - tw) + currentWidth), g.autoExpandMin), g.autoExpandMax);
								if (cw != currentWidth) {
									cm.setColumnWidth(ci, cw, true);
									if (preventUpdate !== true) {
										this.updateColumnWidth(ci, cw);
									}
								}
							}
						}
						else{
							this.updateHeaders(); 
							this.updateHeaderSortState();
						}
					} 
					catch (e) {
						LOGGER.error("While auto Expanding the view : list ::" +e);
					}
				},
				getFixedColumnStats : function (){
					var totalWidth = 0;
					var totalColumns = 0;
					for ( var index = 0; index < this.cm.columns.length; index++) {
						if (!Ext.isEmpty(this.cm.columns[index]) && this.cm.columns[index].fixed) {
							totalWidth += this.cm.columns[index].width;
							totalColumns++;
						}
					}
					return {
						totalWidth : totalWidth,
						totalColumns : totalColumns
					};
				},
				replaceLiveRows : function(cursor, forceReplace, processRows)
				{
					var spill = cursor-this.lastRowIndex;

					if (spill == 0 && forceReplace !== true) {
						return;
					}


					var append = spill > 0;


					spill = Math.abs(spill);


					var bufferRange = this.ds.bufferRange;
					var cursorBuffer = cursor-bufferRange[0];


					var lpIndex = Math.min(cursorBuffer+this.visibleRows-1, bufferRange[1]-bufferRange[0]);

					if (spill >= this.visibleRows || spill == 0) {
						this.mainBody.update(this.renderRows(cursorBuffer, lpIndex));
					} else {
						if (append) {

							this.removeRows(0, spill-1);

							if (cursorBuffer+this.visibleRows-spill <= bufferRange[1]-bufferRange[0]) {
								var html = this.renderRows(
											cursorBuffer+this.visibleRows-spill,
											lpIndex
								);
								Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);

							}

						} else {
							this.removeRows(this.visibleRows-spill, this.visibleRows-1);
							var html = this.renderRows(cursorBuffer, cursorBuffer+spill-1);
							Ext.DomHelper.insertHtml('beforeBegin', this.mainBody.dom.firstChild, html);

						}
					}

					if (processRows !== false) {
						this.processRows(0, undefined, true);
					}
					this.lastRowIndex = cursor;
					if(lpIndex==bufferRange[1] &&  this.syncRowHeight && this.clippedRow && this.clippedHeight > 0){
						Ext.get(this.getRows()[0]).setStyle('margin-top','-'+this.clippedHeight+'px');
					}
				},
				adjustVisibleRows : function()
				{
					if (this.rowHeight == -1) {
						if (this.getRows()[0]) {
							this.rowHeight = this.getRows()[0].offsetHeight;

							if (this.rowHeight <= 0) {
								this.rowHeight = -1;
								return;
							}

						} else {
							return;
						}
					}


					var g = this.grid, ds = g.store;

					var c     = g.getGridEl();
					var cm    = this.cm;
					var size  = c.getSize();
					var width = size.width;
					var vh    = size.height;

					var vw = width-this.getScrollOffset();
					if (cm.getTotalWidth() > vw) {
						vh -= this.horizontalScrollOffset;
					}

					vh -= this.mainHd.getHeight();

					var totalLength = ds.totalLength || 0;

					var visibleRows = Math.max(1, Math.floor(vh/this.rowHeight));

					this.rowClipped = 0;

					this.rowClipped = 0;
					this.clippedHeight=0;
					this.clippedRow=false;
					if(this.syncRowHeight){
						if(vh>(this.rowHeight*visibleRows) && totalLength > visibleRows){
							this.clippedHeight=vh-(visibleRows*this.rowHeight);
							this.clippedHeight=this.rowHeight-this.clippedHeight;
							visibleRows+=1;
							this.clippedRow=true;
						}
					}
					if (totalLength > visibleRows && this.rowHeight / 3 < (vh - (visibleRows*this.rowHeight))) {
						visibleRows = Math.min(visibleRows+1, totalLength);
						this.rowClipped = 1;
					}
					if (this.visibleRows == visibleRows) {
						return;
					}

					this.visibleRows = visibleRows;

					if (this.isBuffering && !this.isPrebuffering) {
						return;
					}

					if (this.rowIndex + (visibleRows-this.rowClipped) > totalLength) {
						this.rowIndex     = Math.max(0, totalLength-(visibleRows-this.rowClipped));
						this.lastRowIndex = this.rowIndex;
					}

					this.updateLiveRows(this.rowIndex, true);
				},
				updateColumnHidden : function(col, hidden){ 
					var that=this;
					var totalWidth = this.getTotalWidth(),
					display    = hidden ? 'none' : '',
								headerCell = this.getHeaderCell(col),
								nodes      = this.getRows(),
								nodeCount  = nodes.length,
								row, rowFirstChild, i;

					this.updateHeaderWidth();
					headerCell.style.display = display;

					for (i = 0; i < nodeCount; i++) {
						row = nodes[i];
						row.style.width = totalWidth;
						rowFirstChild = row.firstChild;

						if (rowFirstChild) {
							rowFirstChild.style.width = totalWidth;
							rowFirstChild.rows[0].childNodes[col].style.display = display; 
						}
					}

					this.onColumnHiddenUpdated(col, hidden, totalWidth);
					delete this.lastViewWidth; //recalc
					if(this.syncRowHeight){
						if (this.getRows()[0]) {
							this.rowHeight = this.getRows()[0].offsetHeight;
							that.layout();
						setTimeout(function(){
					that.refresh(true);
					that.updateHeaders(); 
					that.updateHeaderSortState();
					 },200);	
						}
					}else{
					this.layout();
					}
				},
				updateLiveRows: function(index, forceRepaint, forceReload)
				{


					var inRange = this.isInRange(index);

					if(this.syncRowHeight){
						for(var j=0;j<this.getRows().length;j++){
							Ext.get(this.getRows()[j]).setStyle('margin-top','');
						}
					}

					if (this.isBuffering) {
						if (this.isPrebuffering) {
							if (inRange) {
								this.replaceLiveRows(index, forceRepaint);
							} else {
								this.showLoadMask(true);
							}
						}

						this.fireEvent('cursormove', this, index,
									Math.min(this.ds.totalLength,
												this.visibleRows-this.rowClipped),
												this.ds.totalLength);

						this.requestQueue = index;
						return;
					}

					var lastIndex  = this.lastIndex;
					this.lastIndex = index;
					var inRange    = this.isInRange(index);

					var down = false;

					if (inRange && forceReload !== true) {

						// repaint the table's view
						this.replaceLiveRows(index, forceRepaint);

						// has to be called AFTER the rowIndex was recalculated
						this.fireEvent('cursormove', this, index,
									Math.min(this.ds.totalLength,
												this.visibleRows-this.rowClipped),
												this.ds.totalLength);
						// lets decide if we can void this method or stay in here for
						// requesting a buffer update
						if (index > lastIndex) { // scrolling down

							down = true;
							var totalCount = this.ds.totalLength;

							// while scrolling, we have not yet reached the row index
							// that would trigger a re-buffer
							if (index+this.visibleRows+this.nearLimit <= this.ds.bufferRange[1]) {
								return;
							}

							// If we have already buffered the last range we can ever get
							// by the queried data repository, we don't need to buffer again.
							// This basically means that a re-buffer would only occur again
							// if we are scrolling up.
							if (this.ds.bufferRange[1]+1 >= totalCount) {
								return;
							}
						} else if (index < lastIndex) { // scrolling up
							down = false;
							// We are scrolling up in the first buffer range we can ever get
							// Re-buffering would only occur upon scrolling down.
							if (this.ds.bufferRange[0] <= 0) {
								return;
							}

							// if we are scrolling up and we are moving in an acceptable
							// buffer range, lets return.
							if (index - this.nearLimit > this.ds.bufferRange[0]) {
								return;
							}
						} else {
							return;
						}

						this.isPrebuffering = true;
					}

					// prepare for rebuffering
					this.isBuffering = true;

					var bufferOffset = this.getPredictedBufferIndex(index, inRange, down);

					if (!inRange) {
						this.showLoadMask(true);
					}

					this.ds.suspendEvents();
					var sInfo  = this.ds.sortInfo;

					var params = {};
					if (this.ds.lastOptions) {
						Ext.apply(params, this.ds.lastOptions.params);
					}

					var pn = this.ds.paramNames;

					params[pn.start] = bufferOffset;
					params[pn.limit] = this.ds.bufferSize;

					if (sInfo) {
						params[pn.dir]  = sInfo.direction;
						params[pn.sort] = sInfo.field;
					}

					var opts = {
								forceRepaint     : forceRepaint,
								callback         : this.liveBufferUpdate,
								scope            : this,
								params           : params,
								suspendLoadEvent : true
					};

					this.fireEvent('beforebuffer', this, this.ds, index,
								Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
								this.ds.totalLength, opts
					);

					this.ds.load(opts);
					this.ds.resumeEvents();
				},
				syncRowHeight:false,
				scrollOffset : 18
			};
					
			if (!Ext.isEmpty(this.cm.columns)) {
				for ( var index = 0; index < this.cm.columns.length; index++) {
					if (!Ext.isEmpty(this.cm.columns[index])) {
						if (this.cm.columns[index].hidden === false && this.cm.columns[index].xtype=="canvastemplatecolumn") {
							viewConfig.syncRowHeight=true;
							break;
						}
					}
				}
			}
			this.fireEvent('highlight',this.store, viewConfig);
			this.view = new Ext.ux.grid.livegrid.GridView(viewConfig);
			
			// adding bbar if the totalResult information is
			// reqd to display
			if(this.totalResultIndicator===true){ 
				this.bbar = new iportal.listview.toolbar({
					 		grid : this,
					 		displayInfo : true,
					 		refreshButton : false
				}); 
				
			}
			
			
		
			
			
			this.ctCls = 'list-view';
			this.stripeRows = true;
			this.width = 'auto';
			if (this.enableHdMenu == null || this.enableHdMenu == 'undefined') {
				this.enableHdMenu = true;
			}
			// this.height = 210; //Removed for the resize
			// height problem
			this.autoHeight = this.scrollNotRequired;
			this.loadMask = {
				msg : rb.LOADING_MSG
			};
			// this.enableHdMenu =true;
		// this.enableColumnMove = true;
			this.enableDragDrop = false;
			this.columnLines = true;
			
			if(!Ext.isEmpty(this.plugins) && !Ext.isEmpty(this.cellActions))
				{
				for(var i=0;i<this.cellActions.length;i++)
					this.plugins.push(this.cellActions[i]);
				}
			else
				this.plugins=this.cellActions;
		
	
			this.addEvents('statechange', 'currencychange');
			this.stateful = true;
			if (!this.stateEvents) {
				this.stateEvents = [];
			}
			this.stateEvents.push('statechange');
			this.stateId = this.itemId + '_' + this.view_id + '_GV';
			iportal.listview.livegrid.superclass.initComponent.call(this);
		},
		updateCcyInHeader : function (ccycode){
			var spanHeaderIcon = Ext.get(this.id + '_SPAN_$$$');
			if (spanHeaderIcon && !(~spanHeaderIcon.dom.innerHTML.indexOf(ccycode))) {
				spanHeaderIcon.dom.innerHTML = '&nbsp;' + ccycode;
				return true;
			}
			return false;
		},
		/**
		 * The Method Responsible for give the store params which holds the source of list view data
		 */
		getPrintData : function (){
			var store = this.store || this.getStore();
			return store.baseParams;
		},
		eqvtHeaderClicked : function (item, evt){
			this.fireEvent('currencychange', this.id.substring(0, this.id.indexOf("__GRID")) + "_"
						+ this.view_id, item.text);
			this.getStore().baseParams['CURRENCY_CD'] = item.text;
			this.selectedCcy = item.text;
			var spanHeaderIcon = Ext.get(this.id + '_SPAN_$$$');
			if (this.updateCcyInHeader(item.text)) {
				this.reloadData();
			}
			this.fireEvent('statechange', this);
		},
			// This method is used to get the current state of
		// the grid.
		// Sorting information, filter details, column
		// changes are fetched and returned.
		getState : function (){
			var that = this;
			// var _state =
			// iportal.listview.livegrid.superclass.getState.apply(this,
			// arguments);
	
			var colProperties = [];
			var columns = this.getColumnModel().columns;
			var col;
			var sortInfo = this.getStore().sortInfo;
			
			if(!Ext.isEmpty(sortInfo)){									
				sortInfo['position'] = 1;
			}
			
			// Getting the column changes (visibility and
			// position changes)
			for (i = 0; i < columns.length; i++) {
				col = columns[i];
				var colProp = {};
				colProp['_id'] = col.id;
				colProp['_hidden'] = (col.hidden == true) ? 'Y' : 'N';
				colProp['_dataindex'] = col.dataIndex;
				colProp['_position'] = i + 1;
				colProperties.push(colProp);
			}
	
			// Getting the Filter details
			var filterBaseParams = this.store.baseParams;
			var totalFilters = filterBaseParams.COLUMN_COUNT;
			var colFilters = [];
			for (i = 1; i <= totalFilters; i++) {
				var colFilter = {};
				colFilter['_constraint'] = filterBaseParams['FILTER' + i + '_CONSTRAINT'];
				colFilter['_field'] = filterBaseParams['FILTER' + i + '_FIELD'];
				colFilter['_value_date'] = filterBaseParams['FILTER' + i + '_VALUE_DATE'];
				colFilter['_value_date2'] = filterBaseParams['FILTER' + i + '_VALUE_DATE2'];
				colFilter['_value_time'] = filterBaseParams['FILTER' + i + '_VALUE_TIME'];
				colFilter['_value_time2'] = filterBaseParams['FILTER' + i + '_VALUE_TIME2'];
				colFilter['_value_txt'] = filterBaseParams['FILTER' + i + '_VALUE_TXT'];
				
				/**
				 * In case the filter applied is on Last N Period then override the default value to
				 * be saved
				 */
				if (filterBaseParams['FILTER' + i + '_VALUE_PERIOD']) {
					colFilter['_value_txt'] = filterBaseParams['FILTER' + i + '_VALUE_PERIOD'];
				}
				
				colFilters.push(colFilter);
			}
	
			// Creating the state object
			var _state = {};
			if (_state) {
				// Code added append the currency
				// value on live grid's filter baseparams
				if(filterBaseParams.CURRENCY_CD){
					_state['_gvOpt'] = {
						'eqvt_ccy' : filterBaseParams.CURRENCY_CD
					};
				}
				_state['_sortInfo'] = sortInfo;
				_state['_colProperties'] = colProperties;
				_state['_colFilters'] = colFilters;
			} else {
				// Code added append the currency
				// value on live grid's filter baseparams
				_state = {
					'_gvOpt' : {
						'eqvt_ccy' : (filterBaseParams.CURRENCY_CD ? filterBaseParams.CURRENCY_CD
									: null)
					},
					'_sortInfo' : that.getStore().sortInfo,
					'_colProperties' : colProperties,
					'_colFilters' : colFilters
				};
			}
			return _state;
		},
		eqlCcyhandler : function (){
			var headerIcon = Ext.get(this.id + '_IMG_$$$')
			if (headerIcon) {
				var currencyList = iportal.preferences.getRatecardCurrencies();
				if ((currencyList != null && currencyList.length > 0)) {
					var ccyMenu = new Ext.menu.Menu({
						minWidth : 50
					});
					for (index = 0; index < currencyList.length; index++) {
						ccyMenu.addMenuItem({
							text : currencyList[index],
							handler : this.eqvtHeaderClicked,
							scope : this
						});
					}
					ccyMenu.show(headerIcon, 'br');
				}
			}
		},
		/**
		 * Intended to add REFRESH_DATA = Y to base params and reload Store. P.S REFRESH_DATA this
		 * will be deleted after data load success/failure.
		 */
		reloadData : function (){
			var store = this.getStore();
			store.baseParams['REFRESH_DATA'] = 'Y';
			store.load();
			
			if(this.getSelectionModel){
				var selModel=this.getSelectionModel();
				if(selModel.refresh){
					selModel.refresh();
				}
			}
			
		},
		/**
		 * Intended to provide the selected record in the grid to the caller. This would only work
		 * when a selection model is implemented on the live grid.
		 */
		
		getSelectedData : function (){
			var selectedRecordList = new Array();
			var selModel = this.getSelectionModel();
			if (selModel != null) {
				
				var nSelectRowCount = selModel.getCount();
				/*
				 * if records are selected in the grid, their values are retrieved and returned
				 */
				if (nSelectRowCount > 0) {
					selectedRecordList = selModel.getSelections();
				}
			}
			return selectedRecordList;
		
		},
		
		/**
		 * Intended to check whether store has data or not. Return true if available else false;
		 */
		isDataAvailable : function (){
			if (this.getStore().getCount() > 0) {
				return true;
			}
			return false;
		},
		onRender : function (ct, position){
			var _laststate = Ext.state.Manager.get(this.getStateId(), 'NOT FOUND');
			if (Ext.type(_laststate) === 'object') {
				var item = {};
				
				item['text'] = _laststate._gvOpt ? _laststate._gvOpt.eqvt_ccy : null;
			
				this.getStore().baseParams['CURRENCY_CD'] = item.text;
				this.selectedCcy = item.text;
				 this.updateGridFiltersFromState();
				 this.getStore().sortInfo = this._sortInfo;
				 if(_laststate.viewTitle){
					  this.ownerCt.mvh.updateViewTitle(_laststate.viewTitle);  
				  }
				Ext.state.Manager.clear(this.getStateId());
			}
			else{
			// Added the sorting details
			if (this.sortConfig) {
				this.getStore().sortInfo = this.sortConfig;
			}
			}
			this.setFilters();
			this.updateColumnHeaders();
			this.updateColumnsState();
			iportal.listview.livegrid.superclass.onRender.apply(this, arguments);
			this.view.layout();
		},
		updateColumnsState: function()
		{
			var colModel=this.getColumnModel();
			var currentColState=this._colProperties;
			if(colModel && currentColState)
			{
				var i=0;
				for(i=0;i<this._colProperties.length;i++)
				{
					if(this._colProperties[i]._hidden =="Y")
					{
		                colModel.config[i].hidden=true;
					}
					else{
						colModel.config[i].hidden=false;
					}
				}
			}
		},
		/*CTCBXQ215F01 -ENDS 17/08/2015 -krishnachaitanya R*/
		afterRender : function (){
			iportal.listview.livegrid.superclass.afterRender.apply(this, arguments);
			this.lmask = new Ext.LoadMask(this.ownerCt.bwrap, {
				msg : CRB.getFWBundle()['LOADING_MSG']
			});
			if (this.autoLoadStore)
				this.lmask.show();
			
			this.on('columnresize',function(colIndex, newSize){
				var that=this;
				this.getView().refresh();
				setTimeout(function(){that.getView().updateHeaderSortState();},10);									
			});
			
		},
		
		setFilters : function (){
		
			if (this.gridFilter) {
				var gridFilters = this.gridFilter.gridViewFilters;
				
				// this code added for set filter value
				if(this.store.baseParams["LOOKUP_FLAG"]=="true")
				{
					var lookup_Filter_Field="";
					var lookup_Filter_Value="";
					var lookup_Filter_Type="";
					
					if(this.store.baseParams["ResetStoreValues"])
					{
					// second time onwards assign the params
					// in to separeate params to the store
					// and delete the base params initially
					// available in store,
					// and get the params from the store and
					// assign it to the filters.
						
						lookup_Filter_Field=this.store.baseParams["LOOKUP_TEXT"];
						lookup_Filter_Value=this.store.baseParams["LOOKUP_VALUE_TXT"];
						lookup_Filter_Type=this.store.baseParams["LOOKUP_TYPE"];										
					}
					else
					{
						
						// First time params are available
						// in the store,so get the params
						// from the store and assign it to
						// the filters.
						var count=this.store.baseParams["COLUMN_COUNT"];
						lookup_Filter_Field=this.store.baseParams["FILTER"+(count)+"_FIELD"];
						lookup_Filter_Value=this.store.baseParams["FILTER"+(count)+"_VALUE_TXT"];
						lookup_Filter_Type=this.store.baseParams["FILTER"+(count)+"_TYPE"];
						
					}								
					var filterArr=new Array();
					filterArr.push(lookup_Filter_Value);
					this.gridViewFilters_lookup  =[ new Ext.data.JsonStore({
	                   	FLD_FILTER_VALUES: filterArr,
	                   	FLD_COLUMN_ID :lookup_Filter_Field,
	                   	FLD_FILTER_TYPE :lookup_Filter_Type
					})];
				
				}
			
				this.gridFilter.deleteOldFilters(this.store.baseParams);
	
				if (gridFilters.length > 0) {
					this.store.baseParams["IS_FILTER_FORM"] = "true";
					this.store.baseParams["COLUMN_COUNT"] = gridFilters.length;
					for (i = 0; i < gridFilters.length; i++) {
						var tmpFilter = this.gridFilter.getFilter(gridFilters[i].FLD_COLUMN_ID);
						if (tmpFilter) {
							if (tmpFilter.type == "string" || tmpFilter.type == "numeric"
										|| tmpFilter.type == "float") {
								this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
								this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
								this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
							} else {
								this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
								this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
								this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
								this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
								this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
							}
						} else {
							this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
							this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
						}
					}
				} else {
					delete this.store.baseParams["IS_FILTER_FORM"];
					delete this.store.baseParams["COLUMN_COUNT"];
				}
			}
			
		},
		updateColumnHeaders : function (){
		
			// this code added for set filter values in the
			// menus
			if(this.store.baseParams["LOOKUP_FLAG"]==="true")
			{	
				this.gridFilter.gridViewFilters=this.gridViewFilters_lookup;
				this.gridViewFilters_lookup=[];
				
			}
			
			if (this.gridFilter) {
				var gridFilters = this.gridFilter.gridViewFilters;
				if (gridFilters.length > 0) {
					for (i = 0; i < gridFilters.length; i++) {
						var tmpFilter = this.gridFilter.getFilter(gridFilters[i].FLD_COLUMN_ID);
						if (tmpFilter) {
							var value = gridFilters[i].FLD_FILTER_VALUES[0];
							
							var value1 = gridFilters[i].FLD_FILTER_VALUES[1];
							LOGGER.info("gridfilters", gridFilters[i]);
							LOGGER.info("value from between:" + value);
							var gridFilterType = gridFilters[i].FLD_FILTER_TYPE;
							
							if (tmpFilter.type == "string") {
								
								tmpFilter.menu.fields['def'].setValue(value);
							
							} else if (tmpFilter.type == "list") {
								tmpFilter.menu.setSelected(value);
							
							} else if (tmpFilter.type == "numeric" || tmpFilter.type == "float") {
								
								var cons = null;
								if (gridFilters[i].FLD_FILTER_TYPE) {
									cons = (gridFilters[i].FLD_FILTER_TYPE == "<"
												? "lt"
												: (gridFilters[i].FLD_FILTER_TYPE == ">"
															? "gt"
															: (gridFilters[i].FLD_FILTER_TYPE == "M"
																		? "most"
																		: (gridFilters[i].FLD_FILTER_TYPE == "L"
																					? "least"
																					: "eq"))));
								}
								if (cons != null) {
									var key, field;
									for (key in tmpFilter.menu.fields) {
										field = tmpFilter.menu.fields[key];
										if (field.itemId === "range-" + cons) {
											tmpFilter.menu.fields[cons].setValue(value);
										}
									}
	
								} else {
									tmpFilter.menu.setValue(value);
								}
								
							} else if (tmpFilter.type == "date") {
								var key;
							
								try {
									for (key in tmpFilter.fields) {
										if (gridFilterType === "PREVIOUS_MONTH"
													&& key === "range-lastmonth") {
											tmpFilter.fields[key].setChecked(true);
	
										} else if (gridFilterType === "LAST_N_DAY"
													&& key === "range-last_n_daysperiods") {
	
											tmpFilter.fields[key].setValue(value);
											tmpFilter.fields['last_n_days'].setChecked(true);
										} else if (gridFilterType === "LAST_N_MONTH"
													&& key === "range-last_n_monthsperiods") {
	
											tmpFilter.fields[key].setValue(value);
											tmpFilter.fields['last_n_months'].setChecked(true);
										} else if (gridFilterType === "range" && key === "between") {
											tmpFilter.fields['range-betweenfrom'].setValue(value);
											tmpFilter.fields['range-betweento'].setValue(value1);
											tmpFilter.fields[key].setChecked(true);
										} else if (gridFilterType === "lt" && key === "before") {
											var date = this.convertStringtoDate(value);
											tmpFilter.fields['before'].menu.picker.setValue(date);
											tmpFilter.fields['before'].setChecked(true);
										} else if (gridFilterType === "gt" && key === "after") {
											var date = this.convertStringtoDate(value);
											tmpFilter.fields[key].menu.picker.setValue(date);
											tmpFilter.fields[key].setChecked(true);
										} else if (gridFilterType === "dtEquals" && key === "on") {
											var date = this.convertStringtoDate(value);
											tmpFilter.fields[key].menu.picker.setValue(date);
											tmpFilter.fields[key].setChecked(true);
										}
									}
								} catch (e) {
									LOGGER.error(e);
								}
								
							}
							tmpFilter.active = true;
						}
					}
					this.gridFilter.updateColumnHeadings();
				} else {
					this.gridFilter.clearFilters();
				}
			}
		},
		/**
		 * coverting the string to date for datefilter.
		 * 
		 * @param sdate
		 * @returns
		 * @returns
		 */
		//  convertStringtoDate
		// ==>converting string to date
		convertStringtoDate : function (sdate){
			if (!Ext.isEmpty(sdate) && typeof (sdate) == 'string') {
				var vals = sdate.split("-");
				var xdate = null;
				var monthfield = vals[0];
				var dayfield = vals[1];
				var yearfield = vals[2];
				xdate = new Date(yearfield, monthfield - 1, dayfield);
				if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
							|| (xdate.getFullYear() != yearfield)) {
					LOGGER.error("Invalid Date", sdate);
					return sdate;
				} else {
					xdate = new Date();
					var intvals = [ Number(vals[1]), Number(vals[0]), Number(vals[2]) ];
					xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
					return xdate;
				}
			} else
				return sdate;
		},
		
		updateGridFiltersFromState : function (){
			if (this._colFilters) {
				var gridFilters = [];
				this.gridFilter.deleteOldFilters(this.store.baseParams);
				if (this._colFilters) {
					for (i = 0; i < this._colFilters.length; i++) {
						var tmpFilter = {};
						var filterValues = [];
					
						filterValues[0] = this._colFilters[i]['_value_txt'];
						filterValues[1] = this._colFilters[i]['_value_date'] || '';
						filterValues[2] = this._colFilters[i]['_value_date2'] || '';
						
						tmpFilter['FLD_COLUMN_ID'] = this._colFilters[i]['_field'];
						tmpFilter['FLD_FILTER_TYPE'] = this._colFilters[i]['_constraint'];
						tmpFilter['FLD_FILTER_VALUES'] = filterValues;
						gridFilters.push(tmpFilter);
					}
					this.gridFilter.gridViewFilters = gridFilters;
				}
			}
		},
    handleViewReady :function(){
    	
    	var rb = CRB.getFWBundle(); 
    	/**
		 * If there is no data as a result of applying a filter on the grid then the FILTER_NO_DATA_MSG will be
		 * displayed. Other wise NO_DATA_MSG will be displayed.
		 */
    	this.getSelectionModel().selectFirstRow();
    	this.getView().focusRow(0);
		this.view.emptyText = rb.LOADING;

		this.view.applyEmptyText();
    }
	
    ,destroy : function(){
    	Ext.state.Manager.clear(this.stateId);
    	iportal.listview.livegrid.superclass.destroy.call(this);
    }

						});

// register xtype to allow for lazy initialization
Ext.reg('livegrid', iportal.listview.livegrid);