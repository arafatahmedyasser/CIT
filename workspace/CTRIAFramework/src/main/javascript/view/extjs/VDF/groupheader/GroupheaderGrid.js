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
Ext.namespace("cbx.grid.groupingheader");


cbx.grid.groupingheader.GroupHeaderGrid = function(config) {
	Ext.apply(this, config);
};

Ext.extend(cbx.grid.groupingheader.GroupHeaderGrid, Ext.util.Observable, {
	
	init: function(grid) {
		var v = grid.getView();
		v.beforeMethod('initTemplates', this.initTemplates);
		v.renderHeaders = this.renderHeaders.createDelegate(v, [v.renderHeaders]);
		v.afterMethod('onColumnWidthUpdated', this.updateGroupStyles);
		v.afterMethod('onAllColumnWidthsUpdated', this.updateGroupStyles);
		v.afterMethod('onColumnHiddenUpdated', this.updateHiddenColumns);
		v.updateGroupStyles=this.updateGroupStyles;
		v.updateChildColumnWidth = this.updateChildColumnWidth;
		v.updateSortIcon = this.updateSortIcon;
		v.getGroupStyle = this.getGroupStyle;
		v.getHeaderCell = this.getHeaderCell;
		v.beforeColMenuShow = this.beforeColMenuShow;
		v.hideChildColumn = this.hideChildColumn;
		v.updateHiddenColumns = this.updateHiddenColumns;
		v.updateGroupHeaders = this.updateGroupHeaders;
		v.updateColumnWidth = this.updateColumnWidth;
		v.getGroupHeaderCell = this.getGroupHeaderCell;
		v.getGroupHeaderIndex = this.getGroupHeaderIndex;
		v.hideChildColumns = this.hideChildColumns;
		v.getClmByGrpClmId = this.getClmByGrpClmId;
		v.updateChildColumnsWidth = this.updateChildColumnsWidth;
		v.handleHdMenuClickDefault = this.handleHdMenuClickDefault;
		v.isMenuDisabled = this.isMenuDisabled; 
		v.getWidth=this.getWidth;
		v.getColumnStyle = this.getColumnStyle;
		v.isFixed = this.isFixed;
		v.isSortable = this.isSortable;
		v.autoExpand = this.autoExpand;
		v.applyHiddenToChild = this.applyHiddenToChild;
		//v.onColumnHiddenUpdated = this.onColumnHiddenUpdated;
		v.updateColumnWidth= this.updateColumnWidth;
		var childCol = false;
	},

	/**
     * @private
     * Provides default templates if they are not given for this particular instance. Most of the templates are defined on
     * the prototype, the ones defined inside this function are done so because they are based on Grid or GridView Column configuration
     * 
     */
	initTemplates: function() {
		
		var ts = this.templates || {};	
		
		if (!ts.gheader) {
			
			ts.gheader = new Ext.Template(
						
				'<table border="0" cellspacing="0" cellpadding="0" class="ux-grid-group-table" style="{tstyle}">',
				
				'<thead>{rows}{header}{subheader}</thead>',
				
				'</table>'
			);
		}
		
		if (!ts.mainheader) {
			
			ts.mainheader = new Ext.Template(
						
				'<tr class="x-grid3-hd-row">{ghcells}</tr>'
			);
		}
		
		if (!ts.subheader) {
			
			ts.subheader = new Ext.Template(
						
				'<tr class="x-grid3-hd-row">{cells}</tr>'
			);
		}
		
		if (!ts.gcell) {
			
			ts.gcell = new Ext.Template(
						
				'<td class="x-grid3-hd x-grid3-cell  x-grid3-td-{id} cbx-grouphd{css}" style="{style}" rowspan="{rowspan}" colspan="{colspan}">',
				
                '<div {tooltip} {attr} class="x-grid3-hd-inner {css}" unselectable="on" style="{istyle}">', 
                
                    this.grid.enableHdMenu ? '{hdmenu}' : '',
                    			
                    '{value}',
                    
                    '{sortmnu}',
                    
                '</div>',
                
                '</td>'
                
			);
		}
		
		this.templates = ts;
	},

	/**
     * @private
     * Renders the grouping header rows using the 'gheader' template. Does not inject the HTML into the DOM, just
     * returns a string.
     * @return {String} Rendered header rows
     */
	renderHeaders: function() {
		
		var ts = this.templates, rows = [], table = [],cols; 
		
		
		
		var ghcells = [], cells = [];
		
		var rowspan = 1, colspan = 0;col = 0;;
		
		
		
		if(!Ext.isEmpty(this.isResponsiveGrid)&&this.isResponsiveGrid)
			{
			cols=this.cm.columns;
			var properties = {
	                id     : this.cm.getColumnId(0),
	                value  : this.cm.getColumnHeader(0) || '',
	                style  : this.getColumnStyle(0, true),
	                css    : 'x-grid3-cell-first ',
	                tooltip: this.getColumnTooltip(0)
	            };
			cells[0]=ts.hcell.apply(properties);
			return ts.header.apply({
	            cells : cells.join(""),
	            tstyle: String.format("width: {0};", this.getTotalWidth())
	        });
			}
		else
			{
			 cols= this.cm.grpColumns;
			}
		
		 
	
			 
		for (var i=0; i<cols.length; i++){			
			colspan = 0;
			if(cols[i].hidden == false || cols[i].id == 'checker'){
				
				var colId = cols[i].id;
				
				if(colId == 'checker'){
					
					colId = colId+'_group';
				}
				
				if(cols[i].childs != null ){
					
					rowspan = 2;
					
					var gcols = cols[i].childs;
					
					for(var k=0; k<gcols.length;k++){
						
						if(gcols[k].hidden == false){
							
							colspan++;
						}
					}
					if(colspan == 0){
						
						continue;
					}
					
					ghcells[i] = ts.gcell.apply({
						
						id: cols[i].id || i + '-'+col,
						
						css: 'x-grid3-hd-'+colId,
									
						style: 'width:' + this.getWidth(cols[i])+ 'px' + ';' + 'text-align:' + 'center' + ';',
						
						rowspan: '1',
						
						colspan: colspan,
						
						tooltip: cols[i].tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + cols[i].tooltip + '"' : '',
									
						value: this.cm.grpLookup[cols[i].id].header || '&#160;',
						
						istyle: cols[i].align == 'center' ? 'padding-right:16px' : '',
									
						hdmenu:'',
						
						sortmnu:''
							
					});
					
					var cellCount = gcols.length+cells.length;
					
					for(var j=cells.length, childcolIndex =0; j<cellCount;j++,childcolIndex++){
									
						var childcol = 0;
						
						if(gcols[childcolIndex].hidden == false){
							
							cells[j] = ts.gcell.apply({
								
								id: gcols[childcolIndex].id || i + '-'+childcol,
								
								css: gcols[childcolIndex].header ? 'ux-grid-hd-group-cell' : 'ux-grid-hd-nogroup-cell',
											
								style: gcols[childcolIndex].align ? 'text-align:' + gcols[childcolIndex].align + ';' : '',
											
							    rowspan: '1',
							    
								colspan: '1',
								
								tooltip: gcols[childcolIndex].tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + gcols[childcolIndex].tooltip + '"' : '',
											
								value: this.cm.getColumnById(gcols[childcolIndex].id).header || '&#160;',
								
								istyle: gcols[childcolIndex].align == 'right' ? 'padding-right:16px' : '',
											
								hdmenu:'<a class="x-grid3-hd-btn" href="#"></a>',
								
								sortmnu:'<img alt="" class="x-grid3-sort-icon" src="'+ Ext.BLANK_IMAGE_URL+'" />'
								
							});
							
							childcol ++;
							
						}
					}
				}
				
				else {
					
					ghcells[i] = ts.gcell.apply({
						
						id: cols[i].id || i + '-'+col,
						
						css: '-td x-grid3-hd-'+colId,
									
						style: 'width:' + this.getWidth(cols[i])+'px'+ ';'  + (cols[i].align ? 'text-align:' + cols[i].align + ';' : ''),
						
						rowspan: '2',//rowspan,
						
						colspan: '1',
						
						tooltip: cols[i].tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + cols[i].tooltip + '"' : '',
									
						value: this.cm.getColumnById(cols[i].id).header || '&#160;',
						
						istyle: cols[i].align == 'right' ? 'padding-right:16px' : '',
									
						hdmenu:'<a class="x-grid3-hd-btn" href="#"></a>',
						
						sortmnu:'<img alt="" class="x-grid3-sort-icon" src="'+ Ext.BLANK_IMAGE_URL+'" />'
						
					});
					
					col++;
					
				}
				
				rows[0] = ts.mainheader.apply({
					
					ghcells : ghcells.join('')
					
				});
				
				rows[1] = ts.subheader.apply({
					
					cells: cells.join('')
					
				});
			}
		}
			 
		this.updateChildColumnWidth(cols);
		
		return ts.gheader.apply({
			
			tstyle: 'width:' + this.getTotalWidth() + ';',
			
			rows: rows.join('')
			
		});
	},
	
	/**
	 * 
	 * Used to update the child columns width in the column model.
	 * @param cols
	 * @returns
	 */
	updateChildColumnWidth :function(cols){
		
		for (var i=0; i<cols.length; i++){
			
			if(cols[i].childs != null){
				
				var hiddenChildCount=0;
				
				for (var j=0; j<cols[i].childs.length; j++){
					
					if(cols[i].childs[j].hidden){
						
						hiddenChildCount++;
					}
				}
				for (var j=0; j<cols[i].childs.length; j++){
					
					cols[i].childs[j].width = cols[i].width/(cols[i].childs.length -hiddenChildCount);
					
					for(var k=0; k<this.cm.columns.length;k++){
						
						if(cols[i].childs[j].id == this.cm.columns[k].id){
							
							this.cm.columns[k].width = cols[i].childs[j].width;
							
							break;
						}
					}
				}
			}
		}
	},
	
	/**
	 * Used to calculte the width according to the number of child columns and then assigning the calculated width to the 
	 * grouping header width by using the width comes from the column model.
	 * 
	 * @param column
	 * @returns
	 * @returns
	 */
	getWidth :function(column){
		
		 var columnWidth =0, childCount =0; 
		 
		 if(column.childs){
			 
			 for(var i=0;i<column.childs.length;i++){
				 
		 		 if(!column.childs[i].hidden){
		 			 
		 			 childCount++;
		 		 }
			 }
			 
		 	 for(var i=0;i<column.childs.length;i++){
		 		 
		 		var gcolumn = column.childs[i];
		 		
		 		if(gcolumn.hidden == false){
		 			
		 			if(gcolumn.width == 'Infinity'){
		 				
		 				if(childCount == column.childs.length){
		 					
		 					columnWidth = 125 * childCount;		 					
		 				}
		 				else {
		 					
		 					columnWidth = column.width/childCount;		 					
		 				}
		 			}
		 			else {
		 				
		 				columnWidth = columnWidth + this.getClmByGrpClmId(gcolumn.id).width;
		 			}
		 		}
		 	}
		 	if (Ext.isNumber(columnWidth)) {
		 		
	 			if (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2)) {
	 				
	 				columnWidth =  columnWidth;
	 				
	            } else {
	            	
	            	columnWidth =  columnWidth;//Math.max(columnWidth - this.borderWidth, 0);
	            } 
	 		 }
		 	
		 	column.width= columnWidth;
		 	
		 	return columnWidth;
		 }
		 else{
			 
			columnWidth = this.getClmByGrpClmId(column.id).width,
			
	        borderWidth = this.borderWidth;
	        
	        if (Ext.isNumber(columnWidth)) {
	        	
	            if (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2)) {
	            	
	                return columnWidth;
	                
	            } 
	            else {
	            	
	                return Math.max(columnWidth - borderWidth, 0) ;
	            }
	            
	        } 
	        else {
	        	
	            return columnWidth;
	        }
		 }
	  },
	   
	   /**
	    * 
	    * Used to  retrieve the column id of the grouped columns.
	    * @param gColId
	    * @returns
	    * @returns
	    */
	   getClmByGrpClmId : function(gColId ){
		   
		   for(var i=0; i< this.cm.config.length; i++){
			   
			   if(gColId == this.cm.config[i].id){
				   
				   return this.cm.config[i];
			   }
		   }
	   },

	   /**
	    * 
	    * Used to apply the columns styles like width, align etc..
	    * @param c
	    * @returns {___anonymous9340_9458}
	    * @returns
	    */
		getGroupStyle: function(c) {
			
			var w = 0, h = true, cs = 0;
			
			for (var i = c.col; i < c.col + c.colspan; i++) {
				
				if (!this.cm.isHidden(i)) {
					
					var cw = this.cm.getColumnWidth(i);
					
					if(typeof cw == 'number'){
						
						w += cw;
					}
					h = false;
					
					cs++;
				}
			}
			return {
				
				width: (Ext.isBorderBox ? w : Math.max(w - this.borderWidth, 0)) + 'px',
				
				hidden: h,
				
				colspan: cs || 1				
			};
		},

		/**
		 * 
		 * Used to update the group styles with the width.
		 * @param colIndex
		 * @returns
		 */
		updateGroupStyles: function(colIndex) {
			
			var headerCell ,
			
			columnWidth = this.getColumnWidth(colIndex);
			
			var column = this.cm.columns[colIndex];
			
			for(var k=0; k < this.cm.grpColumns.length; k++){
				
				if(column.id == this.cm.grpColumns[k].id){
					
					colIndex = k;
				}
			}
			headerCell = this.getHeaderCell(colIndex);
			
			headerCell.style.width = columnWidth;
		},
		
		/**
		 * 
		 * Used to get the header cell of the grouped columns.
		 * @param col
		 * @returns
		 * @returns
		 */
		getGroupHeaderCell : function(col){	
			
			var colIndex = 0, headerCell;
			
			var column = this.cm.columns[col];
			
			colIndex = this.getGroupHeaderIndex(column);
			
			headerCell = this.getHeaderCell(colIndex);
			
			return headerCell;
		},

		/**
		 * 
		 * Used to update the column with of the grouped columns.
		 * @param column
		 * @param width
		 * @returns
		 */
		updateColumnWidth : function (column, width){
			
			var columnWidth = this.getColumnWidth(column), 
			
				totalWidth = this.getTotalWidth(), 
				
				headerCell = this.getGroupHeaderCell(column), 
				
				nodes = this.getRows(), 
				
				nodeCount = nodes.length, 
				
				row, i, firstChild;
			
			var colId = this.getColumnId(column);
			
			var noOfChilds = 0;
			
			if(this.cm.grpLookup[colId].parentId !=''){
				
				var parentCol = this.cm.grpLookup[colId].parentId;
				
				for(var k=0; k<this.cm.grpColumns.length; k++){
					
					if(parentCol == this.cm.grpColumns[k].id && this.cm.grpColumns[k].childs){
						
						for(var j=0; j<this.cm.grpColumns[k].childs.length;j++){
							
							if(!this.cm.grpColumns[k].childs[j].hidden)
								
								noOfChilds++;
						}
						var len = this.cm.grpColumns[k].childs.length;
						
						for(var l =0; l<this.cm.columns.length; l++){
							
							if(this.cm.grpColumns[k].childs[len-1].id == this.cm.columns[l].id){
								
								column = l;
								
								break;
							}
						}
					}
				}
			}
			
			for(var k=0; k<this.cm.grpColumns.length;k++){
				
				if(colId == this.cm.grpColumns[k].id){
					
					this.cm.grpColumns[k].width = width;//parseInt(columnWidth.slice(0,-2));
					
				}
				/*else if(this.cm.grpColumns[k].childs){
					var w = this.cm.grpColumns[k].width / noOfChilds;
					
					w = columnWidth - w ;
				}*/
			}
			headerCell.style.width = width;//columnWidth;
			
			for (i = 0; i < nodeCount; i++) {
				
				row = nodes[i];
				
				firstChild = row.firstChild;
				
				row.style.width = totalWidth;
				
				if (firstChild) {
					
					firstChild.style.width = totalWidth;
					
					if(this.cm.grpLookup[colId].parentId !=''){
						
						var cellWidth = firstChild.rows[0].childNodes[column].style.width;
						
						var resizedWidth = (/*parseInt(columnWidth.slice(0,-2))*/width -  parseInt(cellWidth.slice(0,-2)))/noOfChilds;
						
						cellWidth = parseInt(cellWidth.slice(0,-2)) + resizedWidth;
						
						for(var l=0; l<noOfChilds;l++){
							
							firstChild.rows[0].childNodes[column -l].style.width = cellWidth+"px";
							
							this.cm.config[column -l].width = cellWidth;
						}
					}
					else{
						
						firstChild.rows[0].childNodes[column].style.width = width;
					}
				}
			}
			this.updateGroupHeaders();
		}, 
		
		/**
		 * 
		 * Used to update the width of the child columns based on the width of the parent column.
		 * @param childColumns
		 * @param colIndex
		 * @returns
		 */
		updateChildColumnsWidth : function(childColumns,colIndex){
			
			var width=0;
			
			for(var i=0; i<childColumns.length;i++){
				
				for(var j=0; j<this.cm.columns.length;j++){
					
					if(childColumns[i].id == this.cm.columns[j].id){
						
						width = width + this.cm.columns[j].width;
					}
				}
			}
			this.cm.grpColumns[colIndex].width = width;
		},
		
		/**
		 * 
		 * TODO: Description
		 * @param col
		 * @param dir
		 * @returns
		 */
		updateSortIcon : function(col, dir){
			
			var task = new Ext.util.DelayedTask(function(){
				var sc = this.sortClasses;
				
				var hds = this.mainHd.select('td.x-grid3-cell').removeClass(sc);
				
				var colIndex = this.getGroupHeaderIndex(this.cm.columns[col]);	
				
			if(hds.item(colIndex)!=null)
				hds.item(colIndex).addClass(sc[dir == "DESC" ? 1 : 0]);
				
			}, this);
			task.delay(100);
		},
		
		/**
		 * 
		 * Used to get the header cell of the grouping headers grid.
		 * @param index
		 * @returns
		 * @returns
		 */
		getHeaderCell : function(index){
			
			//return this.mainHd.dom.getElementsByTagName('td')[index];
			
			return this.mainHd.query('td.x-grid3-cell')[index];
		},
		
		/**
		 * 
		 * Used for rendering the hd menu with the column names based on the property.
		 * 
		 * @returns
		 */
		beforeColMenuShow: function(){
			
			 var colMenu  = this.colMenu;
			 
			 
			 
			 var colModel;
			 var cm;
			 
			 if(!Ext.isEmpty(this.isResponsiveGrid)&&this.isResponsiveGrid)
				{
				this.beforeColMenuShowGroup();
				return;
				}
			 else
				 {
				 
				 colModel= this.cm.grpColumns;
				 cm=this.cm;
				 
				 }
			 
			 
			 colMenu.removeAll();
			 
			 for(var i=0; i<colModel.length;i++){
				 
				 //if(colModel[i].hidden == false){
				 
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
								
								this.childMenu.add(new Ext.menu.CheckItem({
									
						            text       : cm.getColumnById(colChildModel[j].id).header,
						            
						            itemId     : 'col-' + colChildModel[j].id,
						            
						            checked    : !colChildModel[j].hidden,
						            
						            //disabled   : colModel.config[i].hideable === false,   
						            
						            hideOnClick: false
						            
								}));
								this.childCol = true;
								
								this.childMenu.on("itemclick", this.updateHiddenColumns, this ,this.childcol );
								
								this.childMenu.on({
			            	 
									scope     : this
			                 
									//beforeshow: this.beforeColChildMenuShow,
			                 
									//itemclick : this.handleHdChildMenuClick
			                 
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
							
							colMenu.add(new Ext.menu.CheckItem({
					             text       : colModel[i].header,
					             itemId     : 'col-' + colModel[i].id,
					             checked    : !parentHidden,
					             //disabled   : true,
					             menu : this.childMenu ? this.childMenu : '',
					             hideOnClick: false
					         }));	
					 }
					 else{
						 colMenu.add(new Ext.menu.CheckItem({
				             text       : cm.getColumnById(colModel[i].id).header, 
				             itemId     : 'col-' + colModel[i].id,
				             checked    : !colModel[i].hidden,
				             //disabled   : colModel.config[i].hideable === false,
				             //menu : this.childMenu ? this.childMenu : '',
				             hideOnClick: false
				         }));
					 }
				 }
		//}
		},
		
		
		/**
		 * 
		 * Uesd to set the column hide and then show based on the values from the menu.
		 * @param colIndex
		 * @param value
		 * @returns
		 */
		updateHiddenColumns : function (colIndex, value ){
			var colId,count=0;
			if(typeof colIndex != 'number'){
				var item = colIndex.itemId;
				colId = item.split('col-').pop();
				
				for(var i=0;i< this.cm.columns.length;i++){
					if(colId == this.cm.columns[i].id){
						colIndex = i;
						break;
					}
				}
				
			
				for(var c=0; c<this.cm.grpColumns.length;c++){
		    		if(this.cm.grpColumns[c].hidden == false){
		    			count++;
		    			if(!Ext.isEmpty(this.cm.grpColumns[c].childs) && this.cm.grpColumns[c].childs.length>0){
		    				for(var i=0;i<this.cm.grpColumns[c].childs.length;i++){
		    					if(this.cm.grpColumns[c].childs[i].hidden == false){
		    						count++;
		    					}
		    					}
		    				}
		    			}
		    		
		    	}
				if(count == 2 && colIndex !=-1 && this.cm.columns[colIndex].hidden== false){
		    		this.updateGroupHeaders();
	    			this.updateHeaders(); 
		    	
		    		
		    		LOGGER.debug("only one column remain IN GRIOUP HEADER");
		    		return;
		    	}
				
				
				if(this.cm.getColumnById(colId).hidden){
					value = false;
					//this.cm.getColumnById(colId).hidden = false;
				
					try{
					//this.cm.setHidden(colIndex, value);
					}catch(e){
					LOGGER.error("Catching the error at time of calling the setHidden Method",e);	
					}					
				}
				else {
					value = true;
					//this.cm.getColumnById(colId).hidden = true;
					this.cm.setHidden(colIndex, value);
				}
				for(var k=0; k < this.cm.grpColumns.length; k++){
					if(this.cm.grpColumns[k].childs){
						colIndex = k;
						break;
					}
				}
			}
			else{
				var col = this.cm.columns[colIndex];
				this.cm.setHidden(colIndex, value);
				colIndex = this.getGroupHeaderIndex(col);	
			}
						
			if(this.cm.grpColumns[colIndex].childs){
				
				var childs = this.cm.grpColumns[colIndex].childs;
				
				for(var i=0; i< childs.length; i++){
					
					if(colId == childs[i].id){
						childs[i].hidden = value;
						break;
					}
				}
			}
			else {
				
				this.cm.grpColumns[colIndex].hidden = value;
			}
			this.updateGroupHeaders();
			this.updateHeaders(); 
		},
		
		
		/**
		 * 
		 * Used to get the index of the header columns.
		 * @param col
		 * @returns {Number}
		 * @returns
		 */
		getGroupHeaderIndex : function(col){
			var colIndex = 0;
			for(var k=0; k < this.cm.grpColumns.length; k++){
				if(col.id == this.cm.grpColumns[k].id){
					colIndex = k;
					break;
				}
				else {
					if(this.cm.grpColumns[k].childs){
						for(var i =0; i< this.cm.grpColumns[k].childs.length; i++){
							if(col.id == this.cm.grpColumns[k].childs[i].id){
								colIndex = k;
								break;
							}
							// break;
						}
					}
				}
			}
			return colIndex;
		},
		
		
		/**
		 * 
		 *  Description
		 * @returns
		 */
		updateGroupHeaders : function() {	
			
			if(this.innerHd){
				 this.innerHd.firstChild.innerHTML = this.renderHeaders();
			}
	                
	        this.templates.body.apply({rows: this.renderRows()});	        
	        	             
	    },
	    
	    
	    /**
	     * 
	     * Called by handleHdMenuClick if any button except a sort ASC/DESC button was clicked. The default implementation provides
	     * the column hide/show functionality based on the check state of the menu item. A different implementation can be provided
	     * if needed.
	     * @param item
	     * @returns
	     */
	    handleHdMenuClickDefault: function(item) {
	    	var colModel = this.cm,	    	
	    	itemId = item.getItemId();	
	    	itemId = itemId.substr(4);
	    	var index = colModel.getIndexById(itemId);
	    	var count = 0,parntCunter=0,totalCounter=0; 
	    	
	    	
	    	for(var c=0; c<this.cm.grpColumns.length;c++){
	    		if(this.cm.grpColumns[c].hidden == false){
	    			count++;
	    			if(!Ext.isEmpty(this.cm.grpColumns[c].childs) && this.cm.grpColumns[c].childs.length>0){
	    				for(var i=0;i<this.cm.grpColumns[c].childs.length;i++){
	    					if(this.cm.grpColumns[c].childs[i].hidden == false){
	    						count++;
	    					}
	    					}
	    				}
	    			}
	    		
	    	}
	    	if(index == -1 )
	    		{
	    		for(var c=0; c<this.cm.grpColumns.length;c++){
	    			

		    		if(this.cm.grpColumns[c].hidden == false){
		    			totalCounter++;
		    			if(!Ext.isEmpty(this.cm.grpColumns[c].childs) && this.cm.grpColumns[c].childs.length>0){
		    				for(var i=0;i<this.cm.grpColumns[c].childs.length;i++){
		    					if(this.cm.grpColumns[c].childs[i].hidden == false && this.cm.grpColumns[c].childs[i].parentId!=itemId){
		    						totalCounter++;
		    					}
		    					}
		    				}
		    			}
		    		
		    	
	    			
	    			if(!Ext.isEmpty(this.cm.grpColumns[c].childs) && this.cm.grpColumns[c].childs.length>0 ){
	    				for(var i=0;i<this.cm.grpColumns[c].childs.length;i++){
	    					if(this.cm.grpColumns[c].childs[i].hidden == false && this.cm.grpColumns[c].childs[i].parentId==itemId){
	    						parntCunter++;
	    					}
	    					}
	    				}
		    		}
	    		        if(parntCunter>=1 && totalCounter<2)
	    		           	{              
	    		        	this.updateGroupHeaders();
	    	    			this.updateHeaders(); 
	    		       
	    		
	    		           LOGGER.debug("Parent has child");
	    		           return;
	    		
	    		           }
	    		        LOGGER.debug("OUTSIDE -1 ");
	    		}
	    	if(count == 2 && index !=-1 && this.cm.columns[index].hidden== false){
	    		this.updateGroupHeaders();
    			this.updateHeaders(); 
	    		
	    		
	    		LOGGER.debug("only one column remain");
	    		return;
	    	}
	    	
	    	if (index != -1) {
		    	if (item.checked && colModel.getColumnsBy(this.isHideableColumn, this).length <= 1) {
		    		this.onDenyColumnHide();
		    		return false;
		    	}
	    	colModel.setHidden(index, item.checked);
			
		    	this.updateGroupHeaders();
		    	this.updateHeaders(); 				
				LOGGER.debug("this.onDenyColumnHide()    OUT SIDE");
				return;
			
	    	} 
	    	else{
	    		if(this.cm.grpColumns){
	    			for(var i=0; i< this.cm.grpColumns.length;i++){
			    		if(this.cm.grpColumns[i].id == itemId){
			    			if(this.cm.grpColumns[i].childs){
			    				this.applyHiddenToChild(item.checked,this.cm.grpColumns[i].childs);
		    					//this.hideChildColumns(item.checked, i);
			    			}
			    		}
			    	}
	    			this.updateGroupHeaders();
	    			this.updateHeaders();  
	    		}
	    	}
	    },
	    
	    applyHiddenToChild : function(checked,childCols){	    	
	    	for(var i =0;i<this.cm.columns.length;i++){
	    		for(var j=0;j<childCols.length;j++){
	    			if(this.cm.columns[i].id ==childCols[j].id){
	    				//this.cm.setHidden(i,checked);
	    				this.cm.columns[i].hidden = checked;
	    				//this.updateHiddenColumns(i,checked);
	    			}
	    		}
	    	}
	    },
	    
	    /**
	     * 
	     * Used for hiding the child columns, if the parent columns get unchecked.
	     * @param checked
	     * @param index
	     * @returns
	     */
	    hideChildColumns : function(checked, index){	    	
	    	for(var i=0; i< this.cm.grpColumns[index].childs.length;i++){
	    		this.cm.getColumnById(this.cm.grpColumns[index].childs[i].id).hidden = checked;
	    		this.cm.grpColumns[index].childs[i].hidden = checked;
	    	}
	    },
	    
	    
	    
	    /**
	     * @private
	     * Used by {@link #handleHdOver} to determine whether or not to show the header menu class on cell hover
	     * @param {Number} col The header cell index
	     * @param {Ext.Element} el The cell element currently being hovered over
    	 */
	    isMenuDisabled : function(col) {
	    	if(col == -1){
	    		return true;
	    	}else{
	    		return !!this.cm.config[col].menuDisabled;
	    	}    	
    	},
    	
    	
    	/**
         * Returns true if the column is <code>{@link Ext.grid.Column#fixed fixed}</code>,
         * false otherwise.
         * @param {Number} colIndex The column index
         * @return {Boolean}
         */
    	isFixed : function(colIndex) {
    		if(col == -1){
	    		return true;
	    	}else{
    			return !!this.config[colIndex].fixed;
    		}
    	},
    	
    	isSortable : function(col) {
    		if(col == -1){
	    		return false;
	    	}else{
    			return !!this.config[col].sortable;
    		}
    	},
    	
    	 /**
         * @private
         * Builds a CSS string for the given column index
         * @param {Number} colIndex The column index
         * @param {Boolean} isHeader True if getting the style for the column's header
         * @return {String} The CSS string
         */
        getColumnStyle : function(colIndex, isHeader) {
            var colModel  = this.cm,
                colConfig = colModel.config,
                style     = isHeader ? '' : colConfig[colIndex].css || '',
                align     = colConfig[colIndex].align;
            
            style += String.format("width: {0};", this.getColumnWidth(colIndex));
            
            if (colModel.isHidden(colIndex)) {
                style += 'display: none; ';
            }
            
            if (align) {
                style += String.format("text-align: {0};", align);
            }
            
            return style;
        },
        
        autoExpand : function (preventUpdate){
    		try {
    			var g = this.grid, cm = this.cm;

    			if (!this.userResized && g.autoExpandColumn) {
    				
    				var tw = g.tw || cm.getTotalWidth(false);
    				if (g.tw == null) {
    					g.tw = tw;
    				}
    				
    				var aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
    				
    				var totalWidth = tw > aw ? tw : aw;
    				totalWidth = totalWidth - 10;
    				var totalColumns = this.cm.getColumnCount(true);
    				/**
    				 * Code for excludig all the columns with fixed width aout of
    				 * the auto expand logic.
    				 */
    				var fixedColumn = this.getFixedColumnStats();
    				totalColumns = totalColumns - fixedColumn.totalColumns;
    				totalWidth = totalWidth - fixedColumn.totalWidth;
    				var avgWidth = totalWidth / totalColumns;
    				g.autoExpandMax = avgWidth - 1;
    				if (!Ext.isEmpty(this.cm.columns)) {
    					for ( var index = 0; index < this.cm.columns.length; index++) {
    						if (!Ext.isEmpty(this.cm.columns[index])) {
    							if (this.cm.columns[index].hidden === false) {    								
    								cm.setColumnWidth(index, Math.floor(avgWidth), true);    								
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
    			}
    			//this.innerHd.firstChild.innerHTML = this.renderHeaders();     			
    			this.updateGroupHeaders();
    		} catch (e) {
    		}
    	},
   onColumnHiddenUpdated : function(col, hidden, totalWidth){
    	LOGGER.debug(" ON METHOD onColumnHiddenUpdated");
   	},
  
    
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
		// private
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
	     * <p>Return the index of the grid column which contains the passed HTMLElement.</p>
	     * See also {@link #findRowIndex}
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
	    }
	    
});
