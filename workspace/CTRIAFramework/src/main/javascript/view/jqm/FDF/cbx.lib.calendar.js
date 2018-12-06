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
/*
 
 * File : cbx.lib.calendar.js
 * Class : cbx.lib.calendar
 * 
 */

cbx.ns('cbx.lib');
cbx.lib.calendar = Class({
	constructor : function(opts){
		$.init.calendar(opts);
	} 
});

/*
 * Extending jQuery UI datepicker to support responsive and JQM
 */

(function($, undefined ) {
	
	$nativeDP = $.fn.datepicker;
	
	$.fn.datepicker = function(options){
	
		var _this = this;
		
		/*
		 * Disable native date picker
		 */
		$( document ).bind( "mobileinit", function(){
		   $.mobile.page.prototype.options.degradeInputs.date = true;
		});
		
		options.beforeShow = function(input){
			if($(input)){
				cbx.lib.datePicker.setActiveDatePicker($(input));
			}
			
			setTimeout(function(){
				applyJQMTheme();
			},10);
		};
		
		options.onClose = function(){
			$(this).blur();
		};
		
		
		options.onChangeMonthYear =  function(){
			setTimeout(function(){
				applyJQMTheme();
			},10);
		};
		
		//$nativeDP.call(this,options);
		$nativeDP.apply( this, arguments );
		var inst = $.datepicker.dpDiv;
		
		function applyJQMTheme(){
			var _this = inst;
			$( ".ui-datepicker-header", _this).addClass("ui-body-c jqm-datepicker ui-corner-top").removeClass("ui-corner-all");
			$( ".ui-datepicker-prev, .ui-datepicker-next", _this).attr("href", "#");
			$( ".ui-datepicker-prev", _this).buttonMarkup({iconpos: "notext", icon: "arrow-l", shadow: true, corners: true});
			$( ".ui-datepicker-next", _this).buttonMarkup({iconpos: "notext", icon: "arrow-r", shadow: true, corners: true});
			$( ".ui-datepicker-calendar th", _this).addClass("ui-bar-b");
			$( ".ui-datepicker-calendar td", _this).addClass("ui-body-d");
			$( ".ui-datepicker-calendar a", _this).buttonMarkup({corners: false, shadow: false }); 
			$( ".ui-datepicker-calendar a.ui-state-active", _this).addClass("ui-btn-active"); // selected date
			$( ".ui-datepicker-calendar a.ui-state-highlight", _this).addClass("ui-btn-up-d")/*.css('background','linear-gradient(#FFFFFF, #F1F1F1) repeat scroll 0 0 #EEEEEE'); */// today"s date
	        $( ".ui-datepicker-calendar .ui-btn", _this).each(function(){
				var el = $(this);
				el.html( el.find( ".ui-btn-text" ).html() ); 
	        });
		};
		
		inst.click(function(e){
			applyJQMTheme();
		});
		
		return this;
	}
	
})(jQuery);


$.widget('init.calendar', {
	 
	defaults : {
		/*
		 * input object which needs to enable date picker
		 */
		inputObj : null,
		/*
		 * Options :
		 * 		foucs  :  input field focus
		 * 		button :  on click calendar button 
		 */
		showOn : 'focus', 
		/*
		 * Options :
		 * 		mm/dd/yy		- Default
		 * 		yy-mm-dd		- ISO 8601
		 * 		d M, y			- Short
		 * 		d MM, y			- medium
		 * 		DD, d MM, yy	- Full Length
		 */
		dateFormat : 'mm/dd/yy',
		
		submitFormat : 'dd/mm/yy',
		/*
		 * Show calendar between range date
		 * Options :
		 * 		Ex : -20 (from 20 days backwards)
		 */
		fromDate : null,
		/*
		 * Show calendar between range date
		 * Options :
		 * 		Ex   : +1M (next 1 one month)
		 * 		Ex 2 : +1M 10D (next 1 one month and 10 days) 
		 */
		toDate : null,
		
		/*
		 * Now we supporting slide effect only.
		 * Options :
		 * 	show, slide
		 */
		transition : 'show',
		/*
		 * Event's and callbacks
		 * 
		 * Type : Function,
		 * Executes the callback method once the select has been selected
		 * 
		 */
		select : function(){}
		
	},
	_init : function(){
		var that=this;
		if(!this.input){
			return false;
		}
		this.input.datepicker(this.setDatePickerOptions());

		if(!cbx.isEmpty(this.opts.disabled)&&this.opts.disabled==true){
			this.input.datepicker('disable');
		}

		$.datepicker._formatDate=function(inst, day, month, year) {
			if (!day) {
				inst.currentDay = inst.selectedDay;
				inst.currentMonth = inst.selectedMonth;
				inst.currentYear = inst.selectedYear;
				}
				var date = (day ? (typeof day == 'object' ? day :
				this._daylightSavingAdjust(new Date(year, month, day))) :
				this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));				
				var formattedDate=this.formatDate("dd/mm/yy", date, this._getFormatConfig(inst));
				$('#'+inst.id).attr("data-rel",formattedDate);
				return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
				} 
		
			$.datepicker._restrictMinMax=function(inst, date) {
			var minDate = this._getMinMaxDate(inst, 'min');
			var maxDate = this._getMinMaxDate(inst, 'max');
			var validate="";
			var newDate = (minDate && date < minDate ? minDate : date);
			if(minDate && date < minDate)
			{
			validate=$.datepicker._get(inst, 'validateField');
			validate.apply((inst.input ? inst.input[0] : null), ['should be lesser than the min date', inst]);
			//return false;
			}			
			newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
			if(maxDate && newDate > maxDate)
			{
				validate=$.datepicker._get(inst, 'validateField');
				validate.apply((inst.input ? inst.input[0] : null), ['should be greater than the max date', inst]);
				//return false;
			}
			
			return newDate;
		} 
		$.datepicker. _setDate= function(inst, date, noChange) {
			var clear = !date;
			var origMonth = inst.selectedMonth; 
			var origYear = inst.selectedYear;
			var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
			if(!cbx.isEmpty(newDate) && newDate!==false){
			inst.selectedDay = inst.currentDay = newDate.getDate();
			inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
			inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
			if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
			this._notifyChange(inst);
			this._adjustInstDate(inst);
			if (inst.input) {
			inst.input.val(clear ? '' : this._formatDate(inst));
			}
		}
			}
		
		function showErrorForReport(msg){
			var err_Dialog = new iportal.Dialog({
				dialogType : 'ERROR',
				title : "Error",
				message : msg,
				okHandler : function (){
					err_Dialog.close();
				}
			});
			err_Dialog.show();
		}
		function extendRemove(target, props) {
			$.extend(target, props);
			for (var name in props)
				if (props[name] == null || props[name] == undefined)
					target[name] = props[name];
			return target;
		}
		$.datepicker._showDatepicker=function(input) {
			input = input.target || input;
			if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
				input = $('input', input.parentNode)[0];
			if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
				return;
			var inst = $.datepicker._getInst(input);
			if($('#'+inst.id).attr("displayMode")=="view")
			return;
			
			if ($.datepicker._curInst && $.datepicker._curInst != inst) {
				$.datepicker._curInst.dpDiv.stop(true, true);
				if ( inst && $.datepicker._datepickerShowing ) {
					$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
				}
			}
			var beforeShow = $.datepicker._get(inst, 'beforeShow');
			var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
			if(beforeShowSettings === false){
				//false
				return;
			}
			extendRemove(inst.settings, beforeShowSettings);
			inst.lastVal = null;
			$.datepicker._lastInput = input;
			$.datepicker._setDateFromField(inst);
			if ($.datepicker._inDialog) // hide cursor
				input.value = '';
			if (!$.datepicker._pos) { // position below input
				$.datepicker._pos = $.datepicker._findPos(input);
				$.datepicker._pos[1] += input.offsetHeight; // add the height
			}
			var isFixed = false;
			$(input).parents().each(function() {
				isFixed |= $(this).css('position') == 'fixed';
				return !isFixed;
			});
			var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
			$.datepicker._pos = null;
			//to avoid flashes on Firefox
			inst.dpDiv.empty();
			// determine sizing offscreen
			inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
			$.datepicker._updateDatepicker(inst);
			// fix width for dynamic number of date pickers
			// and adjust position before showing
			offset = $.datepicker._checkOffset(inst, offset, isFixed);
			inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
				'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
				left: offset.left + 'px', top: offset.top + 'px'});
			if (!inst.inline) {
				var showAnim = $.datepicker._get(inst, 'showAnim');
				var duration = $.datepicker._get(inst, 'duration');
				var postProcess = function() {
					var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
					if( !! cover.length ){
						var borders = $.datepicker._getBorders(inst.dpDiv);
						cover.css({left: -borders[0], top: -borders[1],
							width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
					}
				};
				inst.dpDiv.zIndex($(input).zIndex()+1);
				$.datepicker._datepickerShowing = true;

				// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
				if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
					inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
				else
					inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
				if (!showAnim || !duration)
					postProcess();
				if (inst.input.is(':visible') && !inst.input.is(':disabled'))
					inst.input.focus();
				$.datepicker._curInst = inst;
			}
		}
				
	},
	_create : function(){
		
		this.opts = $.extend({},this.defaults, this.options);
		this.input = $(this.opts.inputObj);
		this.submit
	},
	setDatePickerOptions : function(){
		var opt = {};
		
		opt.showAnim = this.opts.transition;
		opt.dateFormat = this.opts.dateFormat;
		opt.altField = this.input.attr( "id" );
		
		opt.defaultDate = this.opts.defaultDate;
		opt.showOn = this.opts.showOn;
		if(this.opts.showOn == 'button'){
			opt.showOn = 'button';
			opt.buttonImageOnly = true;
			opt.buttonImage = '/iportalweb/iportal/images/default/shared/calendar.gif';
		}
		
		if(this.opts.fromDate){
			opt.minDate = this.opts.fromDate;
		}
		
		if(this.opts.toDate){
			opt.maxDate = this.opts.toDate;
		}
		/*
		 * Bind on select event
		 */
		opt.onSelect = this.select();
		
		opt.validateField=this.validateField();
		
		return opt;
	},
	show : function(){
		this.input.datepicker('show');
	},
	setValue :function(){
		LOGGER.info("SETVALUE");
	},
	hide : function(){
		this.input.datepicker('hide');
	},
	select : function(){
		var _that = this;
		return function(curDate){		
			_that.opts.select.apply(this,[$(this).attr("data-rel")]);
		};
	},
	validateField : function(){
		var _that = this;
		return function(msg){		
			_that.opts.validateDate.apply(this,[msg]);
		};
	}
});