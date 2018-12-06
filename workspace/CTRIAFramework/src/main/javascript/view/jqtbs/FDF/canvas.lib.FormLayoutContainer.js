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
 * @namespace "canvas.lib"
 * @description This component is currently responsible in Jquery_Bootstrap Framework to render the column/table layout
 * 				inside form container.
 * 				Also, it then adds DOM structure to add form components inside them.
 * 				Following form components are handled in the same file:
 * 					1. Empty cell
 *  				2. Empty row
 *  				3. Line
 */

canvas.lib.FormLayoutContainer = Class(cbx.core.Component, {
	/**
	 * @class 		"canvas.lib.FormLayoutContainer"
	 * @extends 	"cbx.core.Component"
	 * @description The constructor function creates the DOM structure for accomodating the n-columns in the form
	 *              container.
	 */

	/*
	 * The values of totalcols is not set when there is only one column in the form container. Hence, the
	 * initialization.
	 */
	totalCols : 1,

	elem : null,
	/*
	 * 	The following components are initialised and rendered seperately. 
	 */
	noRenderRequired : ['cbx-emptycell', 'cbx-rowclear', 'cbx-line', 'cbx-logo' ],

	constructor : function (config)
	{

		this.parentObj = config.parentObj;
		this.totalCols = parseInt(config.formData.totalColumns);

		/*
		 * Here, the totalCols is initialised for the containers that are called within the container and for which
		 * totalCols is undefined.
		 */
		if (cbx.isEmpty(config.formData.totalColumns))
		{
			this.totalCols = 1;
		}

		/*
		 * A div is created to hold all the columns to be created.
		 */
		this.elem = new cbx.lib.layer({
			"eleType" : "div",
			"class" : "formcontainer",
			"data-item-id" : "formcontainer"
		}).getLayer();
		$(this.parentObj).append(this.elem);

		this.setCmp(this.elem);
	},

	/**
	 * @method 		addComponentsByColumnLayout
	 * @memberof 	"canvas.lib.FormLayoutContainer"
	 * @param		childItems - {Array} List of all the children under that parent
	 * @param		parent - parent DOM
	 * @description This method is responsible for generating structure for form components 
	 * 				in column layout fashion.
	 * 				Also handles the form components said above in column layout. 
	 * 				'Colspan' metadata is not respected in this layout type.
	 * 				'Anchor' metadata is not respected for empty cell and empty row.
	 */
	addComponentsByColumnLayout : function (childItems, parent)
	{

		var childLength = childItems.length;
		var width = 12 / this.totalCols;
		width = Math.floor(width);

		/*
		 * 	DOM structure for n-columns are created here.
		 */
		for (var i = 0; i < this.totalCols; i++)
		{
			var tempDiv = new cbx.lib.layer({
				"eleType" : "div",
				"class" : "col-lg-" + width + " col-md-" + width + " col-sm-" + width + " col-xs-12 " ,
				"data-item-id" : "Column" + i
			}).getLayer();
			$(parent).append(tempDiv);
		}
		
		/*
		 * 	Index is declared to add the component in its respective column.
		 * 	Added to overcome Row-empty form component's.
		 */
		var index = 0;

		/*
		 * 	This loop runs for each childitem in the list.
		 */
		for (var i = 0; i < childLength; i++)
		{
			/*
			 * 	Loop for each column in the form container.
			 */
			for (var j = 0; j < this.totalCols; j++)
			{
				/*
				 * 	If the position of the container matches the child item position, then 
				 * 	the component is rendered in that column.
				 */
				if ((index % this.totalCols) == j)
				{
					/*
					 * 	In empty cell, one empty cell is added in the respective column.
					 * 	In multi-col layout, empty row has to be hidden in all the devices 
					 * 	where the form components are stacked one after another.
					 * 	Empty cell is not shown when form components are rendered in stack.
					 */
					if (childItems[i].xtype == 'cbx-emptycell' && this.totalCols > 1)
					{
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-formlayout-"+childItems[i].itemId +" hidden-xs",
							"data-item-id" : childItems[i].itemId,
							"data-item-type" : childItems[i].xtype
						}).getLayer();
						$(parent).find('div[data-item-id = "Column' + j + '"]').append(tempDiv);						
					} 
					
					/*
					 * 	In empty row, one empty cell is added in the respective column until the end
					 * 	of row. 
					 * 	In multi-col layout, empty row has to be hidden in all the devices where the 
					 * 	form components are stacked one after another.
					 * 	Empty row is not shown when form components are rendered in stack.
					 */
					else if (childItems[i].xtype == 'cbx-rowclear' && this.totalCols > 1)
					{
						/*
						 * 	Since this is column layout and seperate DOM is created for each column, 
						 * 	the DOM for empty row has to be created and rendered seperately for each 
						 * 	column until the end of row.
						 */
						for ( ; j < this.totalCols; j++) 
						{
							var tempDiv = new cbx.lib.layer({
								"eleType" : "div",
								"class" : "ct-formlayout-"+childItems[i].itemId + "hidden-xs",
								"data-item-id" : childItems[i].itemId,
								"data-item-type" : childItems[i].xtype
							}).getLayer();								
							$(parent).find('div[data-item-id = "Column' + j + '"]').append(tempDiv);
							
							/*
							 * Index is increased when a empty row is added except for last one.
							 */
							if(j<this.totalCols -1)
								index++;
						}
					} 
					
					/*
					 * 	In line, one line is added in the respective column.
					 */
					else if (childItems[i].xtype == 'cbx-line')
					{
						var widthDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-form__anchor-width"
						}).getLayer();
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-formlayout-"+childItems[i].itemId + "ct-line",
							"data-item-id" : childItems[i].itemId,
							"data-item-type" : childItems[i].xtype
						}).getLayer();
						$(widthDiv).append(tempDiv);
						$(parent).find('div[data-item-id = "Column' + j + '"]').append(widthDiv);					
					} 
					/*
					 * 	For other components, DOM structure to render form components are added.
					 */
					else if ( !this.noRenderRequired.contains(childItems[i].xtype) )
					{
						var widthDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-form__anchor-width"
						}).getLayer();
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-formlayout-"+childItems[i].itemId,
							"data-item-id" : childItems[i].itemId,
							"data-item-type" : childItems[i].xtype
						}).getLayer();
						$(widthDiv).append(tempDiv);
						$(parent).find('div[data-item-id = "Column' + j + '"]').append(widthDiv);
					}
				}
			}
			/*
			 * 	Index is incremented after adding a form component.
			 */
			index++;
		}
	},

	/**
	 * @method 		addComponentsByTableLayout
	 * @memberof 	"canvas.lib.FormLayoutContainer"
	 * @param		childItems - {Array} List of all the children under that parent
	 * @param		parent - parent DOM
	 * @description This method is responsible for generating structure for form components 
	 * 				in table layout fashion.
	 * 				Also handles the form components said above in column layout. 
	 * 				'Colspan' metadata is respected in table layout.
	 * 				'Anchor' metadata is not respected for empty cell and empty row.
	 */
	addComponentsByTableLayout : function (childItems, parent)
	{

		var childLength = childItems.length;
		var width = 12 / this.totalCols;
		width = Math.floor(width);

		var remainingChild = childLength;
		var colCount = this.totalCols;
		var j = 0;

		/*
		 * 	The loop is run until the remaining child becomes null.
		 */
		while (remainingChild > 0)
		{
			/*
			 * First a row is created, within which columns are rendered and only one
			 * form component is rendered per column per row based on their position. 
			 */
			var rowDiv = new cbx.lib.layer({
				"eleType" : "div",
				"class" : "row"
			}).getLayer();

			for (; j < childLength; j++)
			{
				/*
				 * 	Here, each column is rendered in a row until the row is full. 
				 * 	This is done using colCount.
				 */
				if (colCount > 0)
				{	
					/*
					 * 	In empty cell, one empty cell is added in the respective column.
					 * 	In multi-col layout, empty row has to be hidden in all the devices 
					 * 	where the form components are stacked one after another.
					 * 	Empty cell is not shown when form components are rendered in stack.
					 */
					if (childItems[j].xtype == 'cbx-emptycell' && this.totalCols > 1)
					{
						/*
						 * 	Colspan is initialised to 1 in case it is not defined in metadata.
						 */
						var colspan = 1;
						/*
						 * 	Colspan is set to the configured metadata value only when the 
						 * 	totalCols is greater than colspan. 
						 * 	If colspan value exceed totalCols value, then the value of totalCols 
						 * 	is set to colspan.
						 */
						if (!cbx.isEmpty(childItems[j].colspan)) {
							if (colspan < this.totalCols)
							colspan = childItems[j].colspan;
							else
								colspan = this.totalCols;
						}
						/*
						 * 	The width is multiplied with colspan to get the required width.
						 */
						var colDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "hidden-xs col-lg-" + width*colspan + " col-md-" + width*colspan + " col-sm-" + width*colspan,
						}).getLayer();
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-formlayout-"+childItems[j].itemId,
							"data-item-id" : childItems[j].itemId,
							"data-item-type" : childItems[j].xtype
						}).getLayer();
						$(colDiv).append(tempDiv);
						$(rowDiv).append(colDiv);
						/*
						 * 	If the colspan is less than colCount, then the colspan is reduced from colcount.
						 * 	Else, colCount is reduced to 0.
						 */
						colCount = (colCount>colspan) ? (colCount-colspan): 0;
						/*
						 * 	After each child is rendered, the remaining child is reduced by 1.
						 */
						remainingChild--;
					} 
					
					/*
					 * 	In empty row, one empty cell is added in the respective column until the end
					 * 	of row. 
					 * 	In multi-col layout, empty row has to be hidden in all the devices where the 
					 * 	form components are stacked one after another.
					 * 	Empty row is not shown when form components are rendered in stack.
					 */
					else if (childItems[j].xtype == 'cbx-rowclear' && this.totalCols > 1)
					{
						/*
						 * 	The width is set in such a way that it occupies the remaining row.
						 */
						var colDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "hidden-xs col-lg-" + width*colCount + " col-md-" + width*colCount + " col-sm-" + width*colCount
						}).getLayer();
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-formlayout-"+childItems[j].itemId,
							"data-item-id" : childItems[j].itemId,
							"data-item-type" : childItems[j].xtype
						}).getLayer();
						$(colDiv).append(tempDiv);
						$(rowDiv).append(colDiv);
						/*
						 * 	Colcount is reduced to zero. No more components are to be rendered in the same row.
						 */
						colCount = 0;
						/*
						 * 	After each child is rendered, the remaining child is reduced by 1.
						 */
						remainingChild--;
					} 
					
					/*
					 * 	In line, one line is added in the respective column.
					 */
					else if (childItems[j].xtype == 'cbx-line')
					{
						/*
						 * 	Colspan is initialised to 1 in case it is not defined in metadata.
						 */
						var colspan = 1;
						/*
						 * 	Colspan is set to the configured metadata value only when the 
						 * 	totalCols is greater than colspan. 
						 * 	If colspan value exceed totalCols value, then the value of totalCols 
						 * 	is set to colspan.
						 */
						if (!cbx.isEmpty(childItems[j].colspan)) {
							if (colspan < this.totalCols)
							colspan = childItems[j].colspan;
							else
								colspan = this.totalCols;
						}
						/*
						 * 	The width is multiplied with colspan to get the required width.
						 */
						var colDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "col-lg-" + width*colspan + " col-md-" + width*colspan + " col-sm-" + width*colspan + " col-xs-12 data-width",
						}).getLayer();
						var widthDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-form__anchor-width"
						}).getLayer();
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-formlayout-"+childItems[j].itemId + " ct-line",
							"data-item-id" : childItems[j].itemId,
							"data-item-type" : childItems[j].xtype
						}).getLayer();
						$(widthDiv).append(tempDiv);
						$(colDiv).append(widthDiv);
						$(rowDiv).append(colDiv);
						/*
						 * 	If the colspan is less than colCount, then the colspan is reduced from colcount.
						 * 	Else, colCount is reduced to 0.
						 */
						colCount = (colCount>colspan) ? (colCount-colspan): 0;
						/*
						 * 	After each child is rendered, the remaining child is reduced by 1.
						 */
						remainingChild--;
					} 
					/*
					 * 	For other components, DOM structure to render form components are added.
					 */
					else if ( !this.noRenderRequired.contains(childItems[j].xtype) )
					{				
						/*
						 * 	Colspan is initialised to 1 in case it is not defined in metadata.
						 */
						var colspan = 1;
						/*
						 * 	Colspan is set to the configured metadata value only when the 
						 * 	totalCols is greater than colspan. 
						 * 	If colspan value exceed totalCols value, then the value of totalCols 
						 * 	is set to colspan.
						 */
						if (!cbx.isEmpty(childItems[j].colspan)) {
							if (colspan < this.totalCols)
							colspan = childItems[j].colspan;
							else
								colspan = this.totalCols;
						}
						/*
						 * 	The width is multiplied with colspan to get the required width.
						 */
						var colDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "col-lg-" + width*colspan + " col-md-" + width*colspan + " col-sm-" + width*colspan + " col-xs-12 data-width",
						}).getLayer();
						var widthDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "ct-form__anchor-width"
						}).getLayer();
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"data-item-id" : childItems[j].itemId,
							"class" : "ct-formlayout-"+childItems[j].itemId,
							"data-item-type" : childItems[j].xtype
						}).getLayer();
						$(widthDiv).append(tempDiv);
						$(colDiv).append(widthDiv);
						$(rowDiv).append(colDiv);
						/*
						 * 	If the colspan is less than colCount, then the colspan is reduced from colcount.
						 * 	Else, colCount is reduced to 0.
						 */
						colCount = (colCount>colspan) ? (colCount-colspan): 0;
						/*
						 * 	After each child is rendered, the remaining child is reduced by 1.
						 */
						remainingChild--;
					}
					else
					{
						/*
						 * 	As the child item has not to be rendered, the remaining child is reduced by 1 to 
						 * 	ignore the rendering.
						 */
						remainingChild--;
					}
				}
				else
					break;
				}
			/*
			 * 	Once the row is completed, the colCount is reset for next row.
			 * 	Also the present row is appended to parent.
			 */
			colCount = this.totalCols;
			$(parent).append(rowDiv);
		}

	},

	/**
	 * @method 		getParent
	 * @memberof 	"canvas.lib.FormLayoutContainer"
	 * @description Returns this.elem 
	 */
	getParent : function ()
	{
		return this.getCmp(this.elem);
	}
});
