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
 *  JQTBS01 		ArunKumar Sekar 	Creating initial List View						09-02-2015
 * ===============================================================================================
 */

cbx.ns("canvas.lib");
/**
 * @className : canvas.lib.listUtility
 * @description: Contains utility methods for list view. <BR>
 * 
 */
canvas.lib.listUtility = Class({
	
	/**
	 * Class constructor, prepares all parameters
	 * @config: Metadata, parent scope
	 */
	constructor: function(config){
		cbx.apply(this, config.config);
	},
	
	/**
	 * API: registering partials at Handlebars
	 * @key: Partial KEY
	 * @html: HTML content that should be connected to the key
	 */
	registerPartials: function(key, html){
		Handlebars.registerPartial(key, html);
	},
	
	/**
	 * API: remove registered partials at Handlebars
	 * @key: Partial KEY
	 */
	unregisterPartials: function(key){
		Handlebars.registerHelper(key);
	},
	
	/**
	 * Regitering Handlebars custom helpers
	 */
	doHandlerBarsHelpers: function(scope){
		var that = scope;
		/**
		 * Sorting
		 */
		Handlebars.registerHelper("canvas-sorting",function(context,options){
			var colID = that.getParamValue("colID");
			if(colID == "ALL"){
				return that.dirClass;
			} else {
				if(context == colID){
					return that.getParamValue("sortClass");
				} else return that.dirClass;
			}
		});
		
		/**
		 * Paging 
		 */
		Handlebars.registerHelper("canvas-paging",function(context,options){
			var cPage = parseInt(context);
			if(options == 'previous') {
				if(cPage <= 1 ) return "disabled";
			} else if(options == 'next') {
				var pages = Math.ceil(that.recordsCount / that.perPage);
				if(pages <= cPage ){
					return "disabled";
				}
			} else {
				var numbers = parseInt(options);
				if(numbers == cPage) return "active";
			}
			return "";
		});
		
		/**
		 * for not allowing context column in mobile view
		 */
		Handlebars.registerHelper("contextMobile",function(index,key,value){
			if(key != "CONTEXT"){
				return "<span class='ct-tr'><span class='ct-td ct-listview-key'>"+key+"</span> <span class='ct-td ct-listview-val' data-item-data ='"+index+"'>"+value+"</span></span>";
			}
		});
		
		/**
		 * Context Column except paging
		 */
		Handlebars.registerHelper("canvas-context-icon", function(iconClass,contextType, options){
			if(contextType == "ICON")
				return that.context.getContextIconList();
			else if(contextType == "MENU")
				return that.context.getContextBtnMenu(iconClass);
		});
		
		
	},
	
	/**
	 * returns bootstrap css class for Device specific priority 
	 */
	columnPriority: function(priority){
		var cssClass = "";
		if(priority == 2)
			cssClass = "hidden-xs";
		else if(priority >= 3)
			cssClass = "hidden-xs hidden-sm";
		return cssClass;
	},
	
	/**
	 * returns css class on switching sort directions 
	 */
	getSortcClass: function(direction){
		if(direction == "")
			return "flaticon-up-down-arrow2";
		else if(direction == "ASC")
			return "flaticon-up-arrow";
		else
			return "flaticon-down-arrow";
	},
	
	/**
	 * Utility method to extend range of give numbers
	 * @from: Form number
	 * @to: To number
	 */
	rangeExtend : function(from,to){
		var tmpArry = [];
		if(to > 0){
			if(to > from){
				for(var i=from; i<=to; i++){
					tmpArry.push(i);
				}
			}
		}	
		return tmpArry;
	},
	/**
	 * Returns formatted date
	 * @v: Form number
	 * @inFormat: Existing date format
	 * @outFormat: date format to be convert
	 */
	formatDate : function(v,inFormat, outFormat) {
		inFormat = 'DD/MM/YYYY';//inFormat||"MM/DD/YYYY";
        if (!v) {
            return "";
        }
        if (!cbx.isDate(v)) {
        	var selectedDate = moment(v, inFormat);
    		
        }
        return selectedDate.format(outFormat/*"DD/MM/YYYY"*/);
    },
    
    
    /**
     * Returns page starts from
     * @page: Current page
     * @perPage: per page how many records to be shown 
     */
    recordsFrom: function(page, perPage){
    	return Math.round(((page - 1) * perPage)+1);
    },
    /**
	 * responsible to prepare row data based on data type
	 * @format: Data Type
	 * @value: Row value
	 * @metadata: Metadata for additional arguments
	 * @data: business data for additional arguments
	 * 
	 */
	validateRowData: function(format, value, metadata, data){
		if(!format) return value;
		switch(format.toUpperCase()){
			case "DATE":
					var drillDownReq=metadata.DRILLDOWN_IND;
					if (!cbx.isEmpty(value)) {
					value = this.formatDate(value,this.dateFrom,this.dateTo);
					if (drillDownReq === 'Y') {
						return "<a href=\"javascript:void(0);\" data-drilldown=\"true\">" + value + "</a>";
					} else {
						return value;
					}
					}
					else {
						return "--"; //iportal.NULL_VAL_REPLACE;
					}
				break;
			case "AMOUNT":
     	   	case "FLOAT":
     	   	case "INT" :
		     	   	var islinkedCurrAvail = false;
		   			var curr = data[metadata.LINKED_SOURCE_CCY];
		   			var currAppend = metadata.FLD_APPEND_CURRENCY_MODE || '';
		   			var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
		   			var currList = currDecimalPlaceList;
		   			var drillDownReq=metadata.DRILLDOWN_IND;
		   			var val = value;
		   			if(currList != null){
	       				var currDecForLinkedCurr = currList[curr];
	       				if (currDecForLinkedCurr != undefined
	       						&& currDecForLinkedCurr.trim() != '') {
	       					(islinkedCurrAvail = true);
	       				}
	       			}
	       			var currBasedDecimal = 2;
	       			if (!cbx.isEmpty(val)) {
	       				if (!curr || curr.trim() == '' || curr == '') {
	       					curr = iportal.systempreferences.getDefaultBankCCY();
	       					if (!curr || curr.trim() == ''
	       							|| curr == '') {
	       						curr = cbx.globalcurrency.metadata.getDefaultCurrency();
	       					}
	       				}
	       				if (curr && curr != '' && curr.trim() != '') {
	       					currBasedDecimal = currList[curr];
	       				}
	       				try {
	       					if (val.charAt(0) == ".") {
	       						val = "0" + val;
	       					}
	       				} catch (err) {	}
	       				val = new String(val);
	       				var sn = canvas.amountFormatter.getInstance();
	       				val = sn.basicFormatter(val.replace(/,/g,""), currBasedDecimal);
	       				if (islinkedCurrAvail == true) {
	       					// TODO : need to work for RTL Support
	       					if (currAppend == 1) {//"PREFIX"
       							val = curr + " " + val;
       						} else if (currAppend == 2) {//"POSTFIX"
       							val = val + " " + curr;
	       				} else {
	       					val = val;
       						}
	       				}
	       				if (drillDownReq === 'Y') {
							return "<a href=\"javascript:void(0);\" data-drilldown=\"true\">" + val + "</a>";
						} else {
							return val;
	       			} 
						}
	       			 else {
						return "--"; //iportal.NULL_VAL_REPLACE;
					}
     	   		break;
     	   case "STRING" :
    	   		var that=this;
				that.width=10; // config
				var drillDownReq=metadata.DRILLDOWN_IND;
				if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
					return "--";//iportal.NULL_VAL_REPLACE;
				} 
				else { 
					if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* value.length)) {
						value = value.replace(/'/g, "&#145;");
						value = value.replace(/"/g, '&#34;');
						if (drillDownReq === 'Y') {
							return "<a href=\"javascript:void(0);\" data-drilldown=\"true\"><span title='"+ value +"'>"+ value+ "</span></a>";	
						} else {			
							return "<span title='"+ value +"'>"+ value + "</span>";
						}
					}
					/**
					 * Render a hyperlink in a grid column if the
					 * value of the DRILL_DOWN_IND is 'Y'
					 */
					else if (drillDownReq === 'Y') {
						return "<a href=\"javascript:void(0);\" data-drilldown=\"true\">" + value + "</a>";
					} else {
						return value;
					}
			      }
				break;
    	   	case "PERCENTAGE" :
    	   		this.align = /*(cfg.align) || */'right';
    	   		var drillDownReq=metadata.DRILLDOWN_IND;
				if (!cbx.isEmpty(value)) {
					var v = value + ' %';
					if (drillDownReq === 'Y') {
						return "<a href=\"javascript:void(0);\" data-drilldown=\"true\">" + v + "</a>";
					} else {
					return v;
					}
				} else {
					return "--"; //iportal.NULL_VAL_REPLACE;
    }
    	   		break;
    	   	case "BOOLCHECK" :
				if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1))
				{
					return "--";// iportal.NULL_VAL_REPLACE;
				} else
				{
					if (value == "true")
					{
						return "<input data-boolcheck='true' type='checkbox' checked />";
					} else
					{
						return "<input data-boolcheck='true' type='checkbox' />";
					}
				}
    	   	break;
    	   	case "TRANSLATEDVALUE" :
	     	   	var rb = CRB.getBundle(this.bundleKey) || CRB.getFWBundle();
	     	   var drillDownReq=metadata.DRILLDOWN_IND;
				if (!cbx.isEmpty(value)) {
					value = new String('LBL_' + value);
					try {
						if (rb[value] == undefined) {
							value = '?' + value + '?';
						} else {
							value = rb[value];
						}
					} catch (e) {
						value = '?' + value + '?';
					}
					if (drillDownReq === 'Y') {
						return "<a href=\"javascript:void(0);\" data-drilldown=\"true\">" + value + "</a>";
					} else {
					return value;
					}
				} else {
					return "--"; //iportal.NULL_VAL_REPLACE;
				}
    	   	break;
    	   	case "RATE" :
    	   		var that=this;
    			that.width=10; // config
				var drillDownReq=metadata.DRILLDOWN_IND;
    					if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
    						return "--";//iportal.NULL_VAL_REPLACE;
    					} else { 
    				if (value.startsWith('.')) {
    					value = "0".concat(value);
    				}
    				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* value.length)) {
    					value = value.replace(/'/g, "&#145;");
    					value = value.replace(/"/g, '&#34;');
    					if (drillDownReq === 'Y') {
    						return "<a href=\"javascript:void(0);\" data-drilldown=\"true\" class='tlink'><span title='"+ value +"'>"+ value + "</span></a>";
    					} 
    					else {
    						return '<span title="'+ value +'">' + value + '</span>';
    					}
    				}
    				else if (drillDownReq === 'Y') {
    							return "<a href=\"javascript:void(0);\" data-drilldown=\"true\">" + value + "</a>";
    						} else {
    							return value;
    						}
    					}
    			break;
    	 	case "COMBOLIST" :
    	 			if (cbx.isEmpty(data)){
    	 					return "--";
    	 			} 
    	 			else{
    	 				if(!cbx.isEmpty(value)){
    	 					LOGGER.info("value= ", value);
    	 				}
    	 					var additionalData=metadata.additionalData.ADDL_LIST_CONFIG[metadata.FLD_COLUMN_ID].DATA;
    	 					var comboHtml="<select class='selectpicker' data-item-id='combolist'>";
    	 					for(var ind=0; ind<additionalData.RAWKEYS.length; ind++){
    	 						var val='';
    	 						if(additionalData.RAWKEYS && additionalData.RAWVALUES){
    	 							if(!cbx.isEmpty(value) && additionalData.RAWKEYS[ind]==value){
    	 								comboHtml+="<option value="+additionalData.RAWKEYS[ind]+" selected>"+additionalData.RAWVALUES[ind]+"</option>";
    	 							}
    	 							else
    	 								comboHtml+="<option value="+additionalData.RAWKEYS[ind]+">"+additionalData.RAWVALUES[ind]+"</option>";
    	 			    		}
    	 					}
    	 					return comboHtml+="</select>";
    	 			}
    	 		break;
		}
		return value;
	},
	updateCellValue:function(tdEle,colMetadata,rowIndex,colName,value){
		
		var format = colMetadata.DATA_TYPE
		switch(format.toUpperCase()){
			case "DATE":
				if (!cbx.isEmpty(value)) {
				value = this.formatDate(iportal.jsutil.convertStringToDateObject(value).format('d/m/Y'),this.dateFrom,this.dateTo);
				tdEle.find('span[title]').html(value);
				}
				else {
					tdEle.find('span[title]').html("--"); //iportal.NULL_VAL_REPLACE;
				}
						
			break;
		case "AMOUNT":
 	   	case "FLOAT":
     	   	case "INT" :
 	   		var islinkedCurrAvail = false;
			var curr = data[colMetadata.LINKED_SOURCE_CCY];
			var currAppend = colMetadata.FLD_APPEND_CURRENCY_MODE || '';
			var currDecimalPlaceList = cbx.globalcurrency.colMetadata.getCurrDecimalPlaceList();
			var currList = currDecimalPlaceList;
			var val = value;
			if(currList != null){
				var currDecForLinkedCurr = currList[curr];
				if (currDecForLinkedCurr != undefined
						&& currDecForLinkedCurr.trim() != '') {
					(islinkedCurrAvail = true);
				}
			}
			var currBasedDecimal = 2;
			if (!cbx.isEmpty(val)) {
				if (!curr || curr.trim() == '' || curr == '') {
					curr = iportal.systempreferences.getDefaultBankCCY();
					if (!curr || curr.trim() == ''
							|| curr == '') {
						curr = cbx.globalcurrency.colMetadata.getDefaultCurrency();
					}
				}
				if (curr && curr != '' && curr.trim() != '') {
					currBasedDecimal = currList[curr];
				}
				try {
					if (val.charAt(0) == ".") {
						val = "0" + val;
					}
				} catch (err) {	}
				val = new String(val);
				var sn = canvas.amountFormatter.getInstance();
				val = sn.basicFormatter(val.replace(/,/g,""), currBasedDecimal);
				if (islinkedCurrAvail == true) {
					// TODO : need to work for RTL Support
					if (currAppend == 1) {//"PREFIX"
						val = curr + " " + val;
					} else if (currAppend == 2) {//"POSTFIX"
						val = val + " " + curr;
				} else {
					val = val;
					}
				}
				tdEle.find('span[title]').html(val);
			}
			else {
				tdEle.find('span').html("--"); //iportal.NULL_VAL_REPLACE;
			}
 	   		
 	   break;
 	   case "STRING" :
 		  var that=this;
			that.width=10; // config
			if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
				tdEle.find('span[title]').html("--");//iportal.NULL_VAL_REPLACE;
			} 
			else { 
				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* value.length)) {
					value = value.replace(/'/g, "&#145;");
					value = value.replace(/"/g, '&#34;');
					tdEle.find('span[title]').html(value);
				}
 		
		      }
 		break;
	   	case "PERCENTAGE" :
	   		this.align = /*(cfg.align) || */'right';
			if (!cbx.isEmpty(value)) {
				var v = value + ' %';
				tdEle.find('span[title]').html(v);
			} else {
				tdEle.find('span[title]').html("--"); //iportal.NULL_VAL_REPLACE;
			}
	   		
	   	break;
	   	case "BOOLCHECK" :
	   		if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1))
			{
	   			tdEle.find('span').val("--");// iportal.NULL_VAL_REPLACE;
			} else
			{
				if (value == "true")
				{
					tdEle.find('span').html("<input data-boolcheck='true' type='checkbox' checked />");
				} else
				{
					tdEle.find('span').html("<input data-boolcheck='true' type='checkbox' />");
				}
			}	   		
	   		
	   	break;
	   	case "TRANSLATEDVALUE" :
	   		var rb = CRB.getBundle(this.bundleKey) || CRB.getFWBundle();
				if (!cbx.isEmpty(value)) {
					value = new String('LBL_' + value);
					try {
						if (rb[value] == undefined) {
							value = '?' + value + '?';
						} else {
							value = rb[value];
						}
					} catch (e) {
						value = '?' + value + '?';
					}
					tdEle.find('span[title]').html(v);
				} else {
					tdEle.find('span[title]').html("--"); //iportal.NULL_VAL_REPLACE;
				}

	   		
	   	break;
	   	case "RATE" :
	   		var that=this;
			that.width=10; // config
			var drillDownReq=colMetadata.DRILLDOWN_IND;
					if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
						tdEle.find('span[title]').html("--"); //iportal.NULL_VAL_REPLACE;
					} else { 
				if (value.startsWith('.')) {
					value = "0".concat(value);
				}
				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* value.length)) {
					value = value.replace(/'/g, "&#145;");
					value = value.replace(/"/g, '&#34;');
					tdEle.find('span[title]').html(value);
				}
				}
	   	break;
	 	case "COMBOLIST" :
				if(!cbx.isEmpty(value)){
					LOGGER.info("value= ", value);
				}
					var additionalData=colMetadata.additionalData.ADDL_LIST_CONFIG.ACTION.DATA;
					
					for(var ind=0; ind<additionalData.RAWKEYS.length; ind++){

						if(additionalData.RAWKEYS && additionalData.RAWVALUES){
							if(!cbx.isEmpty(value) && additionalData.RAWKEYS[ind]==value){
								tdEle.find('.selectpicker').val(value);
							}
			    		}
					}
	 	break;			
		}
	},
	/**
	 * returns the page number.
	 */
    getPages: function(currentPage){
    	var pages = [];
    	if(this.pages <= this.pageVisible){
    		start = 1;
    		end = this.pages;
    	} else {
    		var half = Math.floor(this.pageVisible / 2);
            var start = currentPage - half + 1 - this.pageVisible % 2;
            var end = currentPage + half;
            if (start <= 0) {
                start = 1;
                end = this.pageVisible;
            }
            if (end > this.pages) {
                start = this.pages - this.pageVisible + 1;
                end = this.pages;
            }
    	}
        var itPage = start;
        while (itPage <= end) {
            pages.push(itPage);
            itPage++;
        }
        return pages;
    },
    /**
     * get the display name from list renderer which in turn calls from bundle
     * @colID the column id for which display name is required
     */
    getTextByColumnID: function(colID){
    	var len = this.headerArray.length;
    	if(len > 0){
    		for(var i=0; i<len; i++){
    			if(this.headerArray[i].COL_ID == colID){
    				return this.headerArray[i].LIST_DATA;
    				break;
    			}
    		}
    	} 
    	return colID;
    },
    /**
     * Used to set the direction to render the context menu as left or right 
     */
    setContextMenu: function(e, contextContainer){
    	var mouseX = e.clientX, 
		mouseY = e.clientY,
		boundsX = $(window).width(),
		boundsY = $(window).height(),
		menuWidth = contextContainer.find('.dropdown-menu').outerWidth(),
		menuHeight = contextContainer.find('.dropdown-menu').outerHeight(),
		top,left;
		if(mouseY + menuHeight > boundsY)	top = mouseY - menuHeight + $(window).scrollTop();
		else top = mouseY + $(window).scrollTop();
		if ((mouseX + menuWidth > boundsX) && ((mouseX - menuWidth) > 0)){
			// Right side alignment fix
			contextContainer.find("li ul").css({ "right": "100%","left": "initial" });
			left = mouseX - menuWidth + $(window).scrollLeft();
		} else {
			// Left side alignment fix
			contextContainer.find("li ul").css({ "left": "100%", "right": "initial" });
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
    },
    /**
     * returns the datatype using column ID
     * @colID the column id for which datatype is required
     * @colList list of all columns
     * @fld field name
     */
    getDataTypeByColID: function(colID,colList,fld){
    	var len = colList.length;
    	if(len > 0){
    		for(var i = 0; i<len; i++){
    			if(colList[i].FLD_COLUMN_ID == colID){
    				return colList[i][fld];
    				break
    			}
    		}
    	}
    	return "string";
    }
	
});
/**
 * Small Plugin that will identify Container has scroll
 *
 */
(function($) {
    $.fn.hasScrollBar = function() {
        var hasScrollBar = {}, e = this.get(0);
        hasScrollBar.vertical = (e.scrollHeight > e.clientHeight) ? true : false;
        hasScrollBar.horizontal = (e.scrollWidth > e.clientWidth) ? true : false;
        return hasScrollBar;
    }
})(jQuery);
/**
 * plugin for column ordering
 * 
 */
(function($){
$.fn.canvasColumnSortable = function(options){
		var defaults = {
			droppableElement: null,
			handle: false,
			onDrop: function(){}
		};
		var opts = $.extend({},defaults,options);
		var isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		var ondragstart = (isTouchDevice) ? "touchstart" : "mousedown";
		var ondrag = (isTouchDevice) ? "touchmove" : "mousemove";
		var ondragEnd = (isTouchDevice) ? "touchend" : "mouseup";
		var absolutePosition = function (elt, stopAtRelative){
			var ex = 0, ey = 0;
			do {
				var isIE = false;
				var browserVersion = null;
				if ((i = navigator.userAgent.indexOf("MSIE")) >= 0) {
					isIE = true;
					browserVersion = parseFloat(navigator.userAgent.substr(i + "MSIE".length));
			    }
				var curStyle = isIE ? elt.currentStyle : window.getComputedStyle(elt, '');
				var supportFixed = !(isIE && browserVersion < 7);
				if (stopAtRelative && curStyle.position == 'relative') break;
				else if (supportFixed && curStyle.position == 'fixed') {
					ex += parseInt(curStyle.left, 10);
					ey += parseInt(curStyle.top, 10);
					ex += document.body.scrollLeft;
					ey += document.body.scrollTop;
					break;
				} else {
					ex += elt.offsetLeft;
					ey += elt.offsetTop;
				}
			} while (elt = elt.offsetParent);
			return { x : ex, y : ey };
		};
		var findColumn = function(header, x) {
			var pos = absolutePosition(header[0]);
		      if (pos.x <= x && x <= pos.x + header.outerWidth()) {
		        return true;
		      }
		    return false;
		};
		return this.each(function(){
			var ele = $(this);
			ele.on(ondragstart,function(e){
				//e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				var isDraggable = true;
				var ele = ($(this).prop("tagName") == "TH") ? $(this) : $(this).parents('th');
				var offset = ele.offset();
				var pos=ele.position();
				var e = (isTouchDevice) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
				dataX = (e.pageX - offset.left);
				var cloned = ele.find("span[data-lbl]").clone().wrap("<div/>").addClass("ct-sortable").hide();
				$("body").addClass("ct-noselect").append(cloned);
				cloned.offset({ top:(e.pageY+$(window).scrollTop()),left:(e.pageX+$(window).scrollLeft()) }).css("position","absolute").show();
				$(document).on(ondrag, function(e){
					if(!isDraggable) return false;
					var e = (isTouchDevice) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
						var clonedOffset = cloned.offset().left ;
						var eleOffset = ele.parent().offset().left ;
						var tbl = ele.parents("table");
						if(clonedOffset < eleOffset || (cloned.offset().left)>(ele.parent().offset().left+ele.parents("[data-item-id='portlet-body']").width())){
							tbl.find("thead tr[data-item-header] th").removeClass("ct-col-order-highlight");
							cloned.remove();
						}else{

					cloned.offset({left: (e.pageX+$(window).scrollLeft())}).css("position","absolute");
					ele.parents("thead tr[data-item-header]").find("th").each(function(i){
						var index = findColumn($(this),e.pageX);
						if(index){
							if(i != -1 && ele.index() != i){
										
							var x = tbl.find("thead tr[data-item-header] th:nth-child("+(i+1)+")");
							x.addClass("ct-col-order-highlight");
							tbl.find("thead tr[data-item-header] th").not(x).removeClass("ct-col-order-highlight");
							}
						}
					});
						}
				});
				$(document).on(ondragEnd, function(e){
					var e = (isTouchDevice) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
					var moveCols = function(tbl,sIdx,fIdx){
						var rows = tbl.find("thead tr[data-item-header],tbody tr[data-grid-records]").not("tbody tr td[colspan]"),
							rowsLen = rows.length;
						var i = 0;
						for(; i <rowsLen; i++){
							var row = $(rows[i]),
								cells = row.children()//.filter('[data-grid-record]');
								cell = cells.eq(sIdx);
							if (cells.eq(fIdx).is('[data-grid-record]') || cells.eq(fIdx).is('[data-draggable]')){
								if (fIdx < cells.length) {
									if(sIdx<fIdx){
										cell.insertAfter(cells.eq(fIdx));
									}else{
										cell.insertBefore(cells.eq(fIdx));
									}
									
								} else {
									row.append(cell);
								}
							}
						}
					};

						var tbl = ele.parents("table");
						if((cloned.offset().left ) < (ele.parent().offset().left) || (cloned.offset().left)>(ele.parent().offset().left+ele.parents("[data-item-id='portlet-body']").width())){
							tbl.find("thead tr[data-item-header] th").removeClass("ct-col-order-highlight");
						}else{
					ele.parents("thead tr[data-item-header]").find("th").each(function(i){
						var index = findColumn($(this),e.pageX);
						if(index){
									
							if(i != -1 && ele.index() != i){
								var j=i+1;
                                if(tbl.find("thead tr[data-item-header] th:nth-child("+j+")").hasClass("action-col") || tbl.find("thead tr[data-item-header] th:nth-child("+j+")").hasClass("rowselection-col")) {
                                	tbl.find("thead tr[data-item-header] th").removeClass("ct-col-order-highlight");
                                	return false;
                                }
								moveCols(tbl,ele.index(),i);
								tbl.find("thead tr[data-item-header] th").removeClass("ct-col-order-highlight");
								return false;
							}
							else if(i==ele.index()){
								ele.find("[data-action=column-sorter]").trigger("mousedown");
							}
						}
						tbl.find("thead tr[data-item-header] th").removeClass("ct-col-order-highlight");
					});
						}
					cloned.remove();
					$(document).off(ondrag);
					$(document).off(ondragEnd);
				});
			});
		});
	}
})(jQuery);
(function($){
	
	$.fn.canvasDragDrop = function(options){
		
		var defaults = {
			droppableElement: null,
			handle: false,
			onDrop: function(){}
		};
		
		var opts = $.extend({},defaults,options);
		var isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		
		var ondragstart = (isTouchDevice) ? "touchstart" : "mousedown";
		var ondrag = (isTouchDevice) ? "touchmove" : "mousemove";
		var ondragEnd = (isTouchDevice) ? "touchend" : "mouseup";
		return this.each(function(){
			var dragX,
				dragY,
				ele = $(this);
				ele.addClass("canvas-draggable-main");
				
			ele.on(ondragstart,function(e){
				if($(e.target).next().attr("role")=="tooltip")
					$(e.target).next().remove();
				e.preventDefault(); e.stopPropagation();
				var isDraggable = true;
				var e = (isTouchDevice) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
				var clonedEle = ele.children("[data-lbl]").clone();
				var htmlCont = ele.children("[data-lbl]").data('fieldname');
				var	cloned = clonedEle.wrap("<div/>").addClass("canvas-draggable").html(htmlCont);
				
				var offset = ele.offset();
				dataX = (e.pageX - offset.left);
				dataY = (e.pageY - offset.top);
				cloned.offset({ top:offset.top,left:offset.left });
				
				$("body").addClass("ct-noselect").append(cloned);
				
				
				$(document).on(ondrag, function(e){
					if($(e.target).next().attr("role")=="tooltip")
						$(e.target).next().remove();
					if(!isDraggable) return false;
					var e = (isTouchDevice) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
					cloned.show().offset({top: e.pageY-dataY, left: e.pageX-dataX});
				});
				
				$(document).on(ondragEnd, function(e){
					if(!isDraggable) return false;
					var e = (isTouchDevice) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
					var mPos = {
						x: e.pageX,
						y: e.pageY
					};
					
					var droppable = (opts.droppableElement != null && opts.droppableElement instanceof jQuery)? opts.droppableElement : $(opts.droppableElement);
					
					droppable.each(function () {
						var pos = $(this).offset(),
							twt = $(this).outerWidth(),
							tht = $(this).outerHeight();
						 if((mPos.x > pos.left) && 
							(mPos.x < (pos.left + twt)) && 
							(mPos.y > pos.top) && 
							(mPos.y < (pos.top + tht))) {
							 var html = cloned.html();
							 var newTmpl = opts.onDrop.call(this,cloned);
							 newTmpl = ($.trim(newTmpl)=='')?html:newTmpl;
							$(this).append(newTmpl);
						}
					});
					
					$("body").removeClass("ct-noselect");
					
					cloned.remove();
					
					$(document).off(ondrag);
					$(document).off(ondragEnd);
				});
			
			});
			
		});
	}
	
})(jQuery);