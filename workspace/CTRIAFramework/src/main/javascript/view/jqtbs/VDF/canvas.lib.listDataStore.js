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
 * @namespace "canvas.lib"
 * @description The name space canvas.lib is useful for organizing the code.<br>
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a common one is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 */
cbx.ns('canvas.lib');

/**
 * @class "canvas.lib.listDataStore"
 * @description This class is the repository of :
 * 				1] Selected data
 * 				2] Modified Data
 * 				3] All the records of the view
 * 				4] Count of the records fetched
 * 				5] Additional data of the list view (values to be displayed in the view)
 * 				
 * @example 
 * var dataStoreObj = new canvas.lib.listDataStore();
 */	
canvas.lib.listDataStore= Class({
	selectedData : [],
	modifiedData : [],
	actualTotalCount : 0,
	isAllSelect : null,
	data : null,
	records : null,
	listRefs : null,
	
	/**@method  "initializeData"
	 * @memberof "canvas.lib.listDataStore"
	 * @param 	 config - list data from the ajax request
	 * @description Responsible to initialize all the data with the respective data value of ajax call result
	 */
	initializeData : function(config){
		var data = config;
		this.modifiedData = [];
		this.selectedData = [];
		this.actualTotalCount = data.response.value.TOTAL_COUNT;
		this.records = data.response.value.ALL_RECORDS;
		this.additionalData = data.response.value.ADDITIONAL_DATA;
	},
	
	/**@method  "appendData"
	 * @memberof "canvas.lib.listDataStore"
	 * @param	 data - data of the new set of records
	 * @description Responsible to add the new set of records to the records variable of this class
	 */
	appendData:function(data){
		this.records = this.records.concat(data.response.value.ALL_RECORDS);
	},
	
	/**@method  "getActualTotalCount"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Total number of records fetched from the DB
	 * @description Responsible to return the total number of records fetched from the DB
	 */
	getActualTotalCount:function(){
		return this.actualTotalCount; 
	},
	
	/**@method  "getAdditionalData"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Additional data of list view
	 * @description Responsible to return the additional data of list view (values to be displayed in the view)
	 */
	getAdditionalData:function(){
		return this.additionalData;
	},
	
	/**@method  "getRecords"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Cloned copy of the set of records
	 * @description Returns the cloned copy of the set of records of the view
	 */
	getRecords:function(){
		return cbx.clone(this.records);
	},
	
	/**@method  "getRecordsLength"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 count of records in the list
	 * @description Returns the count of records of the list
	 */
	getRecordsLength:function(){
		return this.records.length;
	},

	/**@method  "getSelectedData"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Records data which are currently selected
	 * @description Returns the records which are currently selected
	 */
	getSelectedData: function(){
		return this.selectedData;
	},
	
	/**@method  "getModifiedData"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 records which are modified
	 * @description Returns the records which are modified
	 */
	getModifiedData: function(){
		return this.modifiedData;
	},	
	
	/**@method  "getColID"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Column ID 
	 * @description Returns the Column Id of the particular Column as in the database.
	 */
	getColID : function(){
		return this.colData[0];
	},
	
	/**@method  "getIndex"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Index of the row selected in that column
	 * @description Returns the index of the row selected in that column.
	 */
	getIndex : function(){
		return this.colData[1];
	},
	
	/**@method  "getColValue"
	 * @memberof "canvas.lib.listDataStore"
	 * @return	 Column display value
	 * @description Returns column diaplay value of that index.
	 */
	getColValue : function(){
		return this.listViewMD.viewMD.FLD_COLUMN_LIST[this.getIndex()].HEADER_VAL;
	},
	
	/**@method  "getColData"
	 * @memberof "canvas.lib.listDataStore"
	 * @param 	 data - Column DOM Data
	 * @return	 Field Data 
	 * @description Returns the field data displayed.
	 */
	getColData : function(data){
		return this.colData = data.data("item-data").split("|");
	},
	
	/**@method  "getRow"
	 * @memberof "canvas.lib.listDataStore"
	 * @param	 rowInd - row Index
	 * @return	 Row data of that pirticular index
	 * @description Returns cloned copy of record from the records list for the index passed 
	 */
	getRow : function(rowInd){
		var row = this.listview.rendererData.totalRows[rowInd];
		row.rowIndex = rowInd;
		return row;
	},
	
	/**@method  "updateSelectedData"
	 * @memberof "canvas.lib.listDataStore"
	 * @param 	 records - selected records<BR>
	 * 			 addData - additional Data of the records<BR>
	 * 			 allRecords - All records of the list 
	 * @description Updates the selected data set
	 */
	updateSelectedData : function(records,addData,allRecords){
		if(allRecords && addData){
			this.selectedData=[];
			this.selectedData=records;
			 this.isAllSelect=true;
		}
		else if(allRecords && !addData){
			this.selectedData=[];
			this.isAllSelect=false;
		}
		else{
			var recFound=0;
			if(addData){
					for(var j=0;j<this.selectedData.length;j++){
						if(this.selectedData[j].rowIndex==records.rowIndex){
							recFound++;
						}	
					}
					if(recFound==0){
						this.selectedData.push(records);
					}
			}
			else{
					for(var j=0;j<this.selectedData.length;j++){
						if(this.selectedData[j].rowIndex==records.rowIndex){
							this.selectedData.removeAt(j);
							this.isAllSelect=false;
						}	
					}
			}
		}
		
		this.listview.updateSelectedCount(parseInt(this.selectedData.length));
	},
	
	/**@method  "updateModifiedData"
	 * @memberof "canvas.lib.listDataStore"
	 * @param 	 rowData - row Data<BR>
	 * 			 colId - column id
	 * @return	 Boolean value to indicate if update is successful
	 * @description Updates the modified data set
	 */
	updateModifiedData : function(rowData,colId){
		var existingModData=0;
		var index=0;
		var updatedInd=false;
		if(this.checkIfRecordModified(rowData,colId)){
		if(!cbx.isEmpty(this.modifiedData) && cbx.isArray(this.modifiedData)){
			for(index=0;index<this.modifiedData.length;index++){
				if(this.modifiedData[index].rowIndex==rowData.rowIndex && this.modifiedData[index][colId]!=rowData[colId]){
					 this.modifiedData[index][colId]=rowData[colId];	
					 existingModData++;
					 break;
				}	
			}
		}
		if(existingModData<=0){
			this.modifiedData.push(rowData);
			}
		updatedInd=true;
		}
		else{
			if(!cbx.isEmpty(this.modifiedData) && cbx.isArray(this.modifiedData)){
				for(index=0;index<this.modifiedData.length;index++){
					if(this.modifiedData[index].rowIndex == rowData.rowIndex){
						 this.modifiedData.removeAt(index);
						 break;
					}	
				}
			}
			updatedInd=false;
		}
		return updatedInd;
	},
	
	/**@method  "checkIfRecordModified"
	 * @memberof "canvas.lib.listDataStore"
	 * @param 	 rowData - row Data<BR>
	 * 			 colId - column id
	 * @return	 Boolean value to indicate if record is modified
	 * @description Checks if the record is modified and returns a boolean value
	 */
	checkIfRecordModified : function(rowData,colId){
		var recRow=this.getRow(rowData.rowIndex);
		if(recRow.rowIndex==rowData.rowIndex && recRow[colId]==rowData[colId]){
				return false;
		}
		else{
				return true;
		}
	}
});
