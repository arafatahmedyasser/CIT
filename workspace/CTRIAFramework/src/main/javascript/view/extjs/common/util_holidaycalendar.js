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
Ext.namespace('iportal.common');
iportal.common.holidaycalendar=function(){
		
	var refreshingData = false;
	var rb = CRB.getFWBundle();
	var cmnrb = CRB.getFWBundle();
		Ext.Ajax.request( {
				params : {
					'PAGE_CODE_TYPE':'HOLIDAY_LIST_VIEW',
					'INPUT_PRODUCT' :'CUSER',
					'INPUT_ACTION'  :'INIT_ACTION',
					'INPUT_FUNCTION_CODE' :'HDLIST',
					'INPUT_SUB_PRODUCT' :'CUSER',
					'INPUT_LANGUAGE_ID':iportal.preferences.getPrimaryLang(),
					'PRODUCT_NAME' :'CUSER'
				},
				success : function(responseP, optionsP) {
					//alert('Inside Holidaycalendar Success Block ');
						var responseData = Ext.decode(responseP.responseText);
						generateHolidayList(responseData);
						//alert('datestr'+dateStr);
						homeCalendar.dates=Ext.decode(dateStr);
				},
				failure : function() {
					//alert('Inside Holidaycalendar Failure Block');
					var win = null;
					win = new iportal.Dialog( {
						title :'MESSAGE',
						dialogType :'MESSAGE',
						message :cmnrb["LBL_MSG_REQ_FAIL"],
						okHandler : function() {
							win.destroy();
						}
					});
	
					win.show();
				}
			});
		
	var dateStr="";
						
		
	
	
	
	emulateAJAX = function() {
	        // Sample data that could have been from AJAX request
	        homeCalendar.dates = {
	            '20090614': '14-Jun-2009 Data'
	        }
	        if (homeCalendar.rendered) {
	          homeCalendar.update();
	        }
	    };
	   // var s  = '2011-05-16';
	  //  var as = "Sample";

	    	homeCalendar = new Ext.ux.Calendar({
	        // Sample data
	        dates:{dateStr:dateStr},
	        getData: function(o) {
	        	if(!Ext.isEmpty(o) && !Ext.isEmpty(o.date)){
	        		return this.dates[o.date.format("Y-m-d")];
	        	}else{
	        		return o;
	        	}
	        },
	        // Custom formatting based on dateY-m-d
	        formatDay: function(o) {
	            var data = this.getData(o);
	            //var s= this.getData(o);
	           // alert(s);
	            var dholiday = o.date.getDay();	
	            if (data) {
	                o.css = "ux-cal-highlight";
	               // oh.caption += "*";
	            }
				if (data=='Weekend Day')
				 {	
					o.css ="ux-cal-WeekEndHoliday";
				 }	
				            
	        },
	        listeners: {
	         
	        	mouseover: function(o) {
				 var data = this.getData(o);
				 //alert("Mouse Over==>"+Ext.encode(data));
				 if (data==undefined)
				{
					 Lndata="";
				}
				else
				{
					 Lndata=data;
				}

				
				if (!o.date) {
                   //this.tooltip.hide();
               } else {
                   var text = o.date.toString();
                   Lntext=text.substring(0,10);

					var dd = o.date.getDay();
					if (dd==0 && dd==6)
					 {
						Lntext = Lntext ;
					 }	
                   if (data)	
					{
					if (this.tooltip.rendered) 
					{					
                      	this.tooltip.body.dom.innerHTML = Lntext +","+Lndata;
					    this.tooltip.show();            
					
                   }
					}

					else
					{
						if (this.tooltip.rendered) 
						{
							this.tooltip.body.dom.innerHTML = Lntext;
							//this.tooltip.html = Lntext;
							this.tooltip.show();  
							//this.tooltip.body.dom.innerHTML = Lntext + Lndata;
							//this.tooltip.body.dom.innerHTML="";
							//this.tooltip.hide();
						}
					} 
               }
           },
	        

	            // Sample for mouse over handling to show tool-tip
	      /* mouseover: function(o) {
	                if (!o.date) {
	                    this.tooltip.hide();
	                } else {
	                	
	                    var text = o.date.toString();
	                    var mydate_new = o.date.format("D M d");
	               // alert(Ext.encode(mydate_new));
	                 
	                    if (this.tooltip.rendered) {
	                        this.tooltip.body.dom.innerHTML = mydate_new;
	                    } else {
	                        this.tooltip.html = mydate_new;
	                    }
	                    this.tooltip.show();
	                }
	            },*/

	            // Adding tool-tip to the calendar
	            render: function() {
	                this.tooltip = new Ext.ToolTip({
	                    target: this.body,
	                    showDelay: 20,
	                    trackMouse: true
	                })
	            },

	            destroy: function() {
	                this.tooltip.destroy();
	            }
	        }
	    });

	    
	    function generateHolidayList(responseData) {
			//alert('inside generateHolidayList'+Ext.encode(responseData));
			//Identify the data stores for country, ccy and branch.
			//var ctyComboObj = responseData['HOLIDAY_LIST'];
			//alert('ctyComboObj'+Ext.encode(ctyComboObj));
			var holidaydate=responseData.HOLIDAY_LIST;
			//alert('holidaydate'+Ext.encode(holidaydate));
			var dateArr= new Array();
			dateArr=responseData.HOLIDAY_LIST;
			
			alert('Date Array length :'+Ext.encode(dateArr.length));
			for(var i=0; i< dateArr.length; i++){
				var obj= dateArr[i];
				//alert(Ext.encode(obj));
				dateStr+='"'+obj.holiday_date+'":"'+obj.description+'",';
			}
			alert('Date and Desc Array Lenght : '+Ext.encode(dateStr.length));
			if(dateStr.length >0){
				dateStr=dateStr.substring(0, dateStr.length-1);
				dateStr="{"+dateStr+"}";
				alert(dateStr);
				homeCalendar.dates=Ext.decode(dateStr);
			}
	   
	
	var holidayListWindow = new iportal.Window( {
		title :'WINDOW_TITLE_HOLIDAY_CALENDAR',
		id :'holidaydataWindowId',
		toolButtons : [ 'refresh', 'pprint', 'close', 'help' ],
		width :350,
		height:210,	
		collapsible :true,
		pprintHandler: function(){
            iportal.openNewWindow('/iportalweb/iportal/jsps/PrintConfirm.jsp'+
              '?elementIdForConfirmationMsg=holiDayGridId','print','toolbar=no,location=no,directories=no,status=no,'+
             'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=100,width=750,height=650');
             },
	//refreshHandler :getHolidayDayRefresh,
         closeHandler : function() {
         openflag 		= true;
         hodrefreshFlag = false;
	},
	helpHandler:function(){
		iportal.jsutil.helpHandler('Holiday_List_Help.htm');
},
	//bbar:[{xtype:'tbfill',text:'Close'}],
	modal :false,
	bundleKey :CRB.getFWBundleKey(),
	items : [homeCalendar]
});

holidayListWindow.show();


		}

};

Ext.ux.Calendar = function(config) {
    Ext.ux.Calendar.superclass.constructor.call(this, config);
    this.addEvents({
        //click: true,
       mouseover: true,
        mouseout: true
    });
};

Ext.ux.Calendar = Ext.extend(Ext.Panel, {
    onRender: function(container, position) {
        Ext.ux.Calendar.superclass.onRender.apply(this, arguments);
        this.createInitialLayout();
        this.update();
    },
    daysOfWeek:iportal.preferences.isLangDirectionRTL()==true? ['\u0634\u0645\u0633', '\u0627\u0644\u0625\u062B\u0646\u064A\u0646', '\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621', 
                                                                '\u062A\u0632\u0648\u062C', '\u0627\u0644\u062E\u0645\u064A\u0633', '\u0627\u0644\u062C\u0645\u0639\u0629', '\u0627\u0644\u0633\u0628\u062A'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    value: new Date(),
    moveMonths: function(months) {
        this.value = this.value.add(Date.MONTH, months);
        this.update();
    },
    showPrevMonth: function() {
        this.moveMonths(-1);
    },
    showNextMonth: function() {
        this.moveMonths(1);
    },
    showNavigation: true,

    createInitialLayout: function() {
        var htmlData = [];
        htmlData.push("<table class=\"ux-cal\" width='100%' height='100%'  cellspacing='1'>");
        //for border border='1'
        htmlData.push("<thead>");
        htmlData.push("<tr class='ux-cal-header'>");
        htmlData.push("<th><div class='x-date-left'><a href='#'>&nbsp;</a></th>")
        htmlData.push("<th colspan='5' class='ux-cal-monthTitle'>&nbsp;</th>");
        htmlData.push("<th><div class='x-date-right' style='float:right'><a href='#'>&nbsp;</a></div></th>")
        htmlData.push('</th></tr>');
        htmlData.push('</thead>');
        htmlData.push('<tbody>');

        htmlData.push("<tr class='ux-cal-weekday'>");
        var daysOfWeek = this.daysOfWeek;
        for (var i = 0; i < 7; i++) {
            var width = i == 0 || i == 6 ? 15 : 14;
				  htmlData.push('<td width="' + width + '%">' + daysOfWeek[i] + '</td>');
			         
        }
        htmlData.push('</tr>');

        for (var i = 0; i < 42; i++) {
            if (i % 7 == 0) { // First day of week
            	
                htmlData.push("<tr class='ux-cal-row '> ");
               
            }
           //ux-cal-row  ux-cal-WeekEnd
           
          
           htmlData.push("<td> &nbsp;</td>");
            if (i % 7 == 6) { // Last day of week
                htmlData.push("</tr>");
            }
        }
        htmlData.push('</tbody>');
        htmlData.push("</table>");
        this.body.update(htmlData.join(""));

        var leftNav = this.body.child("div.x-date-left a");
        var rightNav = this.body.child("div.x-date-right a");
        this.leftClickRpt = new Ext.util.ClickRepeater(leftNav, { handler: this.showPrevMonth, scope: this, preventDefault: true, stopDefault: true });
        this.rightClickRpt = new Ext.util.ClickRepeater(rightNav, { handler: this.showNextMonth, scope: this, preventDefault: true, stopDefault: true });

        var showNavigation = this.showNavigation;
        leftNav.setDisplayed(showNavigation);
        rightNav.setDisplayed(showNavigation);
        this.calendarHeaderEl = this.body.child('th.ux-cal-monthTitle');

        var table = this.body.select('table');
        table.on({
           mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
          //  click: this.onClick,
            scope: this
        });

        this.cells = this.body.select('tbody td');
    },

    beforeDestroy: function() {
        this.leftClickRpt.destroy();
        this.rightClickRpt.destroy();
        this.cells.destroy();
        Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
    },

    onMouseOver: function(e) {
    	
        this.processEvent('mouseover', e);
    },

    onMouseOut: function(e) {
        this.fireEvent('mouseout', e, this);
    },

    onClick: function(e) {
        this.processEvent('click', e);
    },

    processEvent: function(eventName, e) {
    	
        var t = e.getTarget();
      ;
        var o = {};
        if (t.tagName == 'TD') {
            var cell = t;
            var row = t.parentNode;
            var rowIndex = row.rowIndex - 2; // Ignore header rows
            o = { cellIndex: cell.cellIndex, rowIndex: rowIndex, row: row, cell: cell };
            
            if (rowIndex >= 0) {
                o.date = this.startOfCalendar.add(Date.DAY, ((o.rowIndex) * 7) + o.cellIndex);
              
            }
        }
        this.fireEvent(eventName, o, e);
    },

    update: function() {
        var value = this.value.clearTime();
       
        var startOfCalendar = value.getFirstDateOfMonth();
        var endOfCalendar = startOfCalendar.getLastDateOfMonth();

        var startWeekDay = Number(startOfCalendar.format("N"));
        if (startWeekDay > 0) {
            startOfCalendar = startOfCalendar.add(Date.DAY, -startWeekDay);
        }

        var endWeekDay = Number(endOfCalendar.format("N"));
        if (endWeekDay < 6) {
            endOfCalendar = endOfCalendar.add(Date.DAY, 6 - endWeekDay);
        }

        var duration = endOfCalendar - startOfCalendar;
        var oneDay = 1000 * 60 * 60 * 24;
        duration = duration / oneDay + 1;

        endOfCalendar = endOfCalendar.add(Date.DAY, 42 - duration);

        var htmlData = [];

        var calendarTitle = value.format("F, Y");
        if(this.calendarHeaderEl && this.calendarHeaderEl.update){
        	  this.calendarHeaderEl.update(calendarTitle);
        }

        var currentMonth = value.format("m");
        var o = { today: new Date().clearTime(), date: startOfCalendar };
        
        var cells = this.cells.elements;
        this.startOfCalendar = startOfCalendar;
        for (var i = 0; i < 42; i++) {

            o.css = o.date.format("m") == currentMonth ? "sameMonth" : "otherMonth";
            o.css += " x-unselectable";
            o.caption = o.date.format("d");
            o.cell = cells[i + 7];
           
            this.formatDay(o);

            o.cell.className = o.css;
            o.cell.innerHTML = o.caption;
            o.date = o.date.add(Date.DAY, 1);
        }
    },
    beforeDestroy: function() {
        if (this.rendered) {
            Ext.destroy(
                this.leftClickRpt,
                this.rightClickRpt
            );
        }
        Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
    }
});
Ext.reg('ux-cal', Ext.ux.Calendar);	
