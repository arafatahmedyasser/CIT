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
Ext.namespace('iportal.calendar');

iportal.calendar.component = Ext.extend(Ext.ux.Calendar,
		{
			dates : {
				"" : ""
			},
			rData : null,
			store : null,
			value: new Date(),
			recordType : [],
			getData : function(obj) {
				if (!Ext.isEmpty(obj) && !Ext.isEmpty(obj.date)) {
					return this.dates[obj.date.format("Y-m-d")];
				} else {
					return obj;
				}
			},
			// Custom formatting based on dateY-m-d
			formatDay : function(obj) {
				var data = this.getData(obj);
				// var s= this.getData(obj);
				var dholiday = obj.date.getDay();
				var value = this.value.clearTime();
			       var startOfCalendar = value.getFirstDateOfMonth();
			       var currentMonth = startOfCalendar.getMonth();
								
			if (data) {
					if(currentMonth==obj.date.getMonth()){
						obj.css = "ux-cal-highlight";
						// oh.caption += "*";
					}
				}
				var mydate = new Date();
				LnDate=mydate.toString();
				LnCurdate=obj.date.toString();	
				
				LnDate1=LnDate.substring(0,10);
				LnCurdate1=LnCurdate.substring(0,10);
				
				if (LnDate1==LnCurdate1)
				{
				    //current date highlight
					obj.css += " ux-cal-highlight1";
				}
	
				
				LnDay1=LnCurdate1.substring(0,3);
				
				LnMonth=obj.css.substring(0,9);
				
				if(LnDay1=="Sun" && LnMonth=="sameMonth")
				{
					obj.css +=" ux-cal-sun-highlight";
				}	
				

			},
			listeners : {

				mouseover : function(obj) {
					
					var data = this.getData(obj);
					 var value = this.value.clearTime();
				       var startOfCalendar = value.getFirstDateOfMonth();
				       var currentMonth = startOfCalendar.getMonth();
				  				       
					if (data == undefined) {
						Lndata = "";
					} else {
						Lndata = data;
					}

					if (!obj.date) {
						// this.tooltip.hide();
					} else {
						var text = obj.date.toString();
						Lntext = text.substring(0, 10);

						var dd = obj.date.getDay();
						if (dd == 0 && dd == 6) {
							Lntext = Lntext;
						}
						if(iportal.preferences.isLangDirectionRTL()){
							var day={
							'Sun':'\u0634\u0645\u0633',
							'Mon':'\u0627\u0644\u0625\u062B\u0646\u064A\u0646',
							'Tue':'\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621',
							'Wed':'\u062A\u0632\u0648\u062C',
							'Thu':'\u0627\u0644\u062E\u0645\u064A\u0633',
							'Fri':'\u0627\u0644\u062C\u0645\u0639\u0629',
							'Sat':'\u0627\u0644\u0633\u0628\u062A'
							};
							var month={
							'Jan':'\u064A\u0646\u0627\u064A\u0631',
							'Feb':'\u0641\u0628\u0631\u0627\u064A\u0631',
							'Mar':'\u0645\u0627\u0631\u0633',
							'Apr':'\u0623\u0628\u0631\u064A\u0644',
							'May':'\u0642\u062F',
							'Jun':'\u064A\u0648\u0646\u064A\u0648',
							'Jul':'\u064A\u0648\u0644\u064A\u0648',
							'Aug':'\u0623\u063A\u0633\u0637\u0633',
							'Sep':'\u0633\u0628\u062A\u0645\u0628\u0631',
							'Oct':'\u0623\u0643\u062A\u0648\u0628\u0631',
							'Nov':'\u0646\u0648\u0641\u0645\u0628\u0631',
							'Dec':'\u062F\u064A\u0633\u0645\u0628\u0631',
							};
							var Lday=Lntext.substring(0,3);
							var mnth=Lntext.substring(4,7);
							var date=Lntext.substring(8,10);
							Lntext=day[Lday]+"\u0020"+month[mnth]+"\u0020"+ date;
							}
						if (data) {
							
							
							if (this.tooltip.rendered) {
								if(currentMonth==obj.date.getMonth()){
									this.tooltip.body.dom.innerHTML = Lntext + ","
									+ Lndata;
									
								}else{
									this.tooltip.body.dom.innerHTML = Lntext;
								}
								this.tooltip.show();

						
						  }
						}

						else {
							if (this.tooltip.rendered) {
								this.tooltip.body.dom.innerHTML = Lntext;
								this.tooltip.show();

							}
						}
					}
				
				},

				// Adding tool-tip to the calendar
				render : function() {
					this.tooltip = new Ext.ToolTip( {
						target : this.body.select('table .ux-cal-row td'),
						showDelay : 20,
						trackMouse : true
					});
				}
			},
			beforeDestroy : function() {
				this.tooltip.destroy();
				iportal.calendar.component.superclass.beforeDestroy.apply(this,
						arguments);
			}

		});

cbx.ns('iportal.calendar');
iportal.calendar.calendarviewpanel = Ext.extend(Ext.Panel, {

	// productCode:"CUSER",
	/** Sub product code */
	// subProductCode:"CUSER",
	/** function code */
	functionCode : "VSBLTY",
	resourceBundleKey : null,
	extraParamsHandler : null,
	conf : null,
	rData : null,
	store : null,
	mvConf : null,
	recordType : [],
	initEvents : function() {
		var rb = CRB.getFWBundle();
		iportal.calendar.calendarviewpanel.superclass.initEvents.call(this);
		this.loadMask = new Ext.LoadMask(this.bwrap, Ext.apply( {
			store : this.store
		}, this.loadMask));
		this.loadMask.msg = rb.LOADING_MSG;

	},
	getXYSeries : function() {
		var clms = this.viewConf.VIEW_MD.FLD_COLUMN_LIST;
		var obj = {};
		obj.Y_COLUMN = [], obj.Y_COLUMN_LABEL = [],
				obj.Y_COLUMN_DATA_TYPE = [], obj.X_COLUMN = [],
				obj.X_COLUMN_LABEL = [], obj.X_COLUMN_DATA_TYPE = [];
		for ( var i = 0, clen = clms.length; i < clen; i++) {
			if (clms[i].FLD_Y_SERIES_IND === "Y") {
				obj.Y_COLUMN.push(clms[i].FLD_COLUMN_ID);
				obj.Y_COLUMN_LABEL.push(clms[i].FLD_COLUMN_DISPLAY_NAME_KEY);
				obj.Y_COLUMN_DATA_TYPE.push(clms[i].FLD_DATA_TYPE);
			} else if (clms[i].FLD_X_SERIES_IND === "Y") {
				obj.X_COLUMN.push(clms[i].FLD_COLUMN_ID);
				obj.X_COLUMN_LABEL.push(clms[i].FLD_COLUMN_DISPLAY_NAME_KEY);
				obj.X_COLUMN_DATA_TYPE.push(clms[i].FLD_DATA_TYPE);
			}
		}
		return obj;
	},
	reloadData : function() {

		var store = this.store;
		store.baseParams['REFRESH_DATA'] = 'Y';
		store.load();
	},
	isDataAvailable : function() {

		if (this.getStore && this.getStore().getCount() > 0) {
			return true;
		}
		return false;
	},
	
	updateHeight : function(height) {
		this.height = height;
		this.setHeight(height);
		this.getComponent(0).setHeight(height);
		this.getComponent(0).adjustBodyHeight(height);
		this.getComponent(0).el.repaint();
	},
	
	initComponent : function() {
		var that = this;
		// var homeCalendar= new iportal.calendar.component()
		
		/*
		 * For auto-reload during collapsed state
		 */
		/*
		 * if(this.viewConf.VIEW_MD.FLD_INIT_COLLAPSED!=null &&
		 * this.viewConf.VIEW_MD.FLD_INIT_COLLAPSED==='Y'){
		 * this.initCollapsed=true; }else{ this.initCollapsed=false; }
		 */
		/*
		 * Store for Calendar
		 */
		var cols = new Array();
		var clms = this.viewConf.VIEW_MD.FLD_COLUMN_LIST;
		for ( var i = 0, clen = clms.length; i < clen; i++) {
			var rec = {};
			var clm = {};
			rec.name = clms[i].FLD_COLUMN_ID;
			rec.type = clms[i].FLD_DATA_TYPE === 'time' ? 'date'
					: (clms[i].FLD_DATA_TYPE === 'rate'
							|| clms[i].FLD_DATA_TYPE === 'numstr' ? 'string'
							: clms[i].FLD_DATA_TYPE);

			// var coltype = this.colTypeMap[clms[i].FLD_DATA_TYPE];
			this.recordType.push(rec);

		}

		var extraParams = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"PRODUCT_NAME" : this.productCode,
			"INPUT_FUNCTION_CODE" : this.functionCode,
			"INPUT_SUB_PRODUCT" : this.subProductCode,
			"WIDGET_ID" : this.itemId.substring(0, this.itemId
					.indexOf("_PANEL")),
			"VIEW_ID" : this.viewConf.VIEW_MD.VIEW_ID,
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
			
			"forceCallbacks" : true

		};

		if (!Ext.isEmpty(this.filterparams)) {
			for (each in this.filterparams) {
				extraParams[each] = this.filterparams[each];
			}
		}

		function getExtParams(param) {
			if (!Ext.isEmpty(param)) {
				var extParams = param(extraParams);
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

		function doAfterLoad(store, records) {

			var dateStr = "";
			var rb = CRB.getBundle(store.bundle);
			/*
			 * if(!Ext.isEmpty(that.jsonReader)&&
			 * !Ext.isEmpty(that.jsonReader.jsonData)&&
			 * !Ext.isEmpty(that.jsonReader.jsonData.response.value.ADDITIONAL_DATA.LBL_EMPTY_TEXT)){
			 * var
			 * emptyTextLabel=that.jsonReader.jsonData.response.value.ADDITIONAL_DATA.LBL_EMPTY_TEXT
			 * that.emptyTextMsg=
			 * null==rb[emptyTextLabel]?rb.NO_DATA_MSG:rb[emptyTextLabel] }
			 */

			for ( var i = 0; i < records.length; i++) {
				var obj = records[i].json;
				dateStr += '"' + obj.holiday_date + '":"' + obj.description
						+ '",';
			}
			
			  if(dateStr!=null && dateStr.length>1){ 	 	 
                  dateStr=dateStr.substring(0, dateStr.length-1); 	  	 
          }
			  // had to trim the trailing comma. 
			dateStr = "{" + dateStr + "}";
			// To Load the Calendar with Dates from the Database
			var homeCalendar = that.getComponent(0);
			homeCalendar.dates = Ext.decode(dateStr);
			// if (homeCalendar.rendered) {
			homeCalendar.update(); // Updating the Calendar for new store of
									// Dates
			// }

			if (records.length == 0) {
				that.showEmptyMessage();
				return;
			}
		}
		this.jsonReader = new Ext.data.JsonReader( {
			root : 'response.value.ALL_RECORDS',
			totalProperty : 'response.value.TOTAL_COUNT',
			id : 'id'
		}, this.recordType);

		this.store = new Ext.data.Store( {
			autoLoad : true,
			baseParams : getExtParams(this.extraParamsHandler),
			reader : this.jsonReader,
			bundle : this.bundle,
			url : iportal.listview.listviewconstants.AJAX_URL,
			listeners : {
				"load" : doAfterLoad,
				'loadexception' : doAfterLoad,
				"reload" : doAfterLoad
			}
		});

		var multiconf = this.conf.mvConf;
		var defaultConfig = {
			items : [ new iportal.calendar.component() ]
		};
		Ext.apply(this, defaultConfig);
		iportal.calendar.calendarviewpanel.superclass.initComponent.apply(this,
				arguments);

	}

});

Ext.reg('calendar-view', iportal.calendar.calendarviewpanel);