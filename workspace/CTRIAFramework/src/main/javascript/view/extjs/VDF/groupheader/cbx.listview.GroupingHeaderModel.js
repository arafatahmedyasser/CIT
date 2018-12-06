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
cbx.ns("cbx.grid.groupingheader");

/**
 * It is used to handle all the grouping column headers related operations.
 *  
 
 */

cbx.grid.groupingheader.GroupingHeaderModel = function (){
	
	return Ext.apply(new Ext.util.Observable, {
		
		/**
		 * Used to creating the column model obejct for grouping columns based on the columns
		 * available in the col list based on the columns parent id.
		 * @params columns     list of columns
		 * @return columnHeader 
		 */
		getGroupingHeaderModel : function(columns){
			
			var columnHeader = new Array();
			
			for(var i=0; i<columns.length; i++){
				
				if(columns[i].parentId == '' || !columns[i].parentId ){
					
					columnHeader.push(columns[i]);
				}
				
				else {
					
					for(var j=0; j<columns.length; j++){
						
						if(columns[i].parentId == columns[j].id){			
							
							if(!columns[j].childs)
								columns[j].childs =[];
								
							columns[j].childs.push(columns[i]);
								
							break;
							
						}
					}
				}
			}
			return columnHeader;
		},
		
		/**
		 * Used to a create lookup for grouping columns.
		 * 
		 * @params rb  resource bundle 
		 * @params columns list of columns
		 */
		getGroupingHeaderLookup : function(rb,columns){
			
			var groupHeaderLookup ={};
			
			for(var i=0; i<columns.length; i++){
				
				columns[i].header = rb['LBL_'+ columns[i].header];
				
				groupHeaderLookup[columns[i].id] = columns[i];
				
			}
			
			/*for(var i=0; i<columns.length; i++){
				
				var mkChild = groupHeaderLookup[columns[i].id];
				
				if(mkChild.parentId != '' && mkChild.id != 'checker'){
					var parentId = mkChild.parentId;
					
					var parent = groupHeaderLookup[parentId];
					
					parent['childs'] = mkChild;
				}
			}*/
			
			return groupHeaderLookup;
		},
		
		/**
		 * Used to update the column model object with the grouping columns model 
		 */
		updateColumnModel : function(cols){
			
			var columnHeader = new Array();
		
			var parents = new Array();
			
			var childColumns = new Array();
			
			var childsId = new Array();
			
			for(var i=0; i<cols.length; i++){
				
				if(cols[i].id != 'checker'){
					
					if(cols[i].parentId != ''){
						
						childColumns.push(cols[i]);
						
						childsId.push(cols[i].id);
					}
				}
			}
			
			for(var i=0; i< childsId.length;i++){
				
				for(var j =0; j<cols.length; j++){
					
					if(childsId[i] == cols[j].id){
						
						cols.splice(j,1);	
					}
				}
			}
			
			for(var i=0; i<cols.length; i++){
				
				var flag = true;
				
				for(var j=0; j<childColumns.length;j++){
					
					if(cols[i].id == childColumns[j].parentId){
						
						columnHeader.push(childColumns[j]);
						
						flag = false;
					}
				}
				
				if(flag){
					
					columnHeader.push(cols[i]);
				}
			}
			
			for(var j=0; j<childColumns.length;j++){
				cols.push(childColumns[j]);
			}
			
			
			/*for(var i=0; i<cols.length; i++){
				
				if(cols[i].parentId == '' || !cols[i].parentId ){
					
					columnHeader.push(cols[i]);
				}
				
				else {
					
					for(var j=0; j<cols.length; j++){
						
						if(cols[i].parentId == cols[j].id){			
								
								columnHeader.push(cols[i]);
								
								parents.push(j);
								
								break;
							
						}
					}
				}
			}
			
			for(var i=0; i<parents.length; i++){
				
				columnHeader.removeByValue(cols[parents[i]]);
			}*/
			
			return columnHeader;
			
		},
		
		/**
		 * Used for drag and drop the column from older index position to new index position.
		 * @params oldIndex
		 * @params newIndex
		 * @params cm
		 */
		moveGrpClmHeader : function (oldIndex, newIndex, cm,n){
			
			//var grpHeaderOldIndex = this.getGroupHeaderIndex(oldIndex, cm);
			
			var draggedColumn = cm.grpColumns[oldIndex];
			
			var neighbourMove = 0;
			
			var grpCol =0;
			
			var isHavingGrp = false; 
			
			var afterChild = false;
			
			//var grpHeaderNewIndex = this.getGroupHeaderIndex(newIndex, cm);
			
			cm.grpColumns.splice(oldIndex, 1);
			
			cm.grpColumns.splice(newIndex, 0, draggedColumn);
			
			
			
			for(var k=0; k<cm.grpColumns.length;k++){
				
				if(cm.grpColumns[k].childs){
					afterChild = true;
					grpCol = grpCol + cm.grpColumns[k].childs.length-1;
					if(oldIndex>k){						
						oldIndex = oldIndex+grpCol;
					}
					if(oldIndex > newIndex){
						if(oldIndex == k){
							oldIndex = oldIndex+grpCol;
						}
					}
				}
				
				if(afterChild){
					if(newIndex == k){
						isHavingGrp = true;
					}
				}
				
			}
			
			if(!isHavingGrp){
				grpCol = 0;
			}
			
			
			if(draggedColumn.childs){
				
				for(var i=0; i<draggedColumn.childs.length; i++){
					
					for(var j=0; j<cm.columns.length;j++){
						
						if(draggedColumn.childs[i].id == cm.columns[j].id){
							
							var mCol = cm.config[j];
							
							cm.config.splice(j,1);
							
							if(oldIndex < newIndex){
								
								cm.config.splice(newIndex+grpCol,0,mCol);
							}
							else{
								
								cm.config.splice(newIndex+neighbourMove,0,mCol);
								
								neighbourMove++;
							}
							
							break;
						}
					}
				}
				cm.moveColumn(0, 0, true);				
			}
			
			else {
				
				cm.moveColumn(oldIndex, newIndex+grpCol, false);
			}
			
	    },
	    /**
		 * 
		 * Used to get the index of the header columns.
		 * @param col
		 * @param cm
		 * @returns {Number}
		 */
	    getGroupHeaderIndex : function(col, cm){
	    	
			var colIndex = 0;
			
			var column = cm.columns[col];
			
			for(var k=0; k < cm.grpColumns.length; k++){
				
				if(column.id == cm.grpColumns[k].id){
					
					colIndex = k;
					
					break;
					
				}else if(cm.grpColumns[k].childs){
					
					for(var j=0; j< cm.grpColumns[k].childs.length; j++){
						
						if(column.id == cm.grpColumns[k].childs[j].id){
							
							colIndex = k;
							
							break;
							
						}
					}
				}
			}
			return colIndex;
		}
	});
}();
