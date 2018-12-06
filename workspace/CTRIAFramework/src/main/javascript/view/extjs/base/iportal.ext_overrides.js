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
 * 
 */

Ext.BLANK_IMAGE_PATH = iportal.workspace.metadata.getContextRoot() + "/CTRIAFramework/UIArena/theme/system/ext/images";

Ext.BLANK_IMAGE_URL = iportal.workspace.metadata.getContextRoot()
			+ "/CTRIAFramework/UIArena/theme/system/ext/images/s.gif";

/**
 * 
 */
Ext.SSL_SECURE_URL = iportal.workspace.metadata.getContextRoot()
			+ "/CTRIAFramework/UIArena/theme/system/ext/images/s.gif";

/**
 * 
 */
Ext.override(Ext.Element, {
	setWidth : function (width, animate)
	{
		width = isNaN(width) ? "auto" : width;
		var me = this;
		width = me.adjustWidth(width);
		!animate || !me.anim ? me.dom.style.width = me.addUnits(width) : me.anim({
			width : {
				to : width
			}
		}, me.preanim(arguments, 1));
		return me;
	}

});

/**
 * To disabling the Backspace through out the application except input fields focus This override will add a class to a
 * form fields on focus. This will return true by default to Ext.FormFieldFocused on Ext.form.Field onFocus state.
 * similar as it will return false by default to Ext.FormFieldFocused on Ext.form.Field onBlur state. This code snippet
 * helps to ensure the CBXQ212U04-fix behaviour on CBXHome.jsp as defined.
 */
Ext.override(Ext.form.Field, {
	onFocus : Ext.form.Field.prototype.onFocus.createSequence(function ()
	{
		Ext.FormFieldFocused = true;
		 if(this.findParentByType('cbx-formpanel')){
	        	this.findParentByType('cbx-formpanel').lastFocussedField=this.name;
	        }
		 
		// Making FormFieldFocused FALSE for ComboBox and DateField
	
		if(this.xtype == "cbx-combobox" || this.xtype == "cbx-datefield" ){
			Ext.FormFieldFocused = false;
		}
	
	}),
	onBlur : Ext.form.Field.prototype.onBlur.createSequence(function ()
	{
		Ext.FormFieldFocused = true;
	}),
	setFieldLabel : function (text)
	{
		if (this.rendered)
		{
			this.el.up('.x-form-item', 10, true).child('.x-form-item-label').update(text);
		}
		this.fieldLabel = text;
	}
});

Ext
			.override(
						Ext.form.BasicForm,
						{
							/**
							 * adding updateFlag as a parameter for the form framework, to compute and tell if the any
							 * of the provided field failed to update or all fields got updated successfully.
							 */
							setValues : function (values, feedbackFlag)
							{
								if (Ext.isArray(values))
								{
									var fieldsUpdated = true;
									for (var i = 0, len = values.length; i < len; i++)
									{
										var v = values[i];
										var f = null;
										/**
										 * Index,mutiformId has been taken care.For multiform the value will be a JSOn
										 * rather than a string. So there is no meaning of finding the field multiform
										 * and setting the value because ideally there will not be any setValue method
										 * for the multi form. The first block will be for the fields inside multi form
										 * and the second block is a part of the normal flow
										 */
										if (!cbx.isEmpty(v.index) && !cbx.isEmpty(v.multiFormId)
													&& typeof (v.value) == 'string' && typeof (v.value) != 'object')
										{
											f = v.managerScope.findField(v.multiFormId).findField(v.index, v.id);
											
										} else if (typeof (v.value) == 'string' && typeof (v.value) != 'object')
										{
											f = this.findField(v.id);
										}
										else if (typeof (v.value) == 'string'  || Ext.isArray(v.value))
											{
												var field = this.findField(v.id);  
												if(field && (field.getXType() === 'cbx-multiselectcombobox' || field.getXType() === 'cbx-staticmultiselectcombobox' || field.getXType() ==='cbx-itemselector') ){
													f=field;
												}
											}
										if (f)
										{
											f.setValue(v.value);
											if (this.trackResetOnLoad)
											{
												f.originalValue = f.getValue();
											}
										} else
										{
											fieldsUpdated = false;
										}
									}
								} else
								{
									var field, id;
									for (id in values)
									{
										if (!cbx.isEmpty(values[id].index)
													&& !cbx.isEmpty(values[id].multiFormId && typeof (values[id].value) == 'string'
																&& typeof (values[id].value) != 'object'))
										{
											var f = values[id].managerScope.findField(values[id].multiFormId).findField(values[id].index, values[id].id);
											;
										} else if (typeof (values[id].value) == 'string')
										{
											var f = this.findField(values[id].id);
										}
										if (typeof values[id] != 'function' && (field = f))
										{
											if ((field.getXType() === 'iportal-datefield' || field.getXType() === 'iportal-staticdatefield')
														&& (typeof values[id] === 'string'))
											{
												if (values[id].split('/').length === 3)
												{
													var date_parts = values[id].split('/');
													var d = new Date();
													d.setFullYear(date_parts[2], date_parts[1] - 1, date_parts[0]);
													field.setValue(d);
												} else
												{
													field.setValue(values[id]);
												}
											} else if ((field.getXType() === 'iportal-amountfield' || field.getXType() === 'iportal-staticamountfield')
														&& (typeof values[id] === 'string'))
											{
												field.setFormattedValue(values[id]);
											} else
												field.setValue(values[id]);
											if (this.trackResetOnLoad)
											{
												field.originalValue = field.getValue();
											}
										}
									}
								}
								if (feedbackFlag === true)
								{
									return fieldsUpdated;
								}
								return this;
							}
						});

Ext
			.override(
						Ext.DatePicker,
						{
							clearFn : Ext.emptyFn,
					/**
					 * @cfg {Object} holidayList contains the list of holidays
					 *      to be validated
					 */
					holidayList : [],
					/**
					 * @cfg {Object} parsedHolidayDates contains the list of
					 *      parsed holidays
					 */
					parsedHolidayDates : [ [], [] ],
					// Setter method to maintain the holiday lists
					setHolidayList : function(holidays) {
						this.holidayList = holidays;
					},
					// Setter method to maintain the parsed holiday lists
					setParsedholidaydates : function(parsedHolidays) {
						this.parsedHolidayDates = parsedHolidays;
					},
							initComponent : function ()
							{
								Ext.DatePicker.superclass.initComponent.call(this);
								this.value = this.value ? this.value.clearTime() : new Date().clearTime();
								this.addEvents(
								/**
								 * @event select Fires when a date is selected
								 * @param {DatePicker} this
								 * @param {Date} date The selected date
								 */
								'select',
								/**
								 * @event clear Fires when a date is cleared
								 * @param {DatePicker} this
								 * @param {Date} date The selected date
								 */
								'clear');
								if (this.handler)
								{
									this.on("select", this.handler, this.scope || this);
								}
								this.initDisabledDays();
							},
							onRender : function (container, position)
							{
								var m = [
										'<table cellspacing="0">',
										'<tr><td class="x-date-left"><a href="#" title="',
										this.prevText,
										'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="',
										this.nextText, '">&#160;</a></td></tr>',
										'<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>' ];
								var dn = this.dayNames;
								for (var i = 0; i < 7; i++)
								{
									var d = this.startDay + i;
									if (d > 6)
									{
										d = d - 7;
									}
									m.push("<th><span>", dn[d].substr(0, 1), "</span></th>");
								}
								m[m.length] = "</tr></thead><tbody><tr>";
								for (var i = 0; i < 42; i++)
								{
									if (i % 7 == 0 && i != 0)
									{
										m[m.length] = "</tr><tr>";
									}
									m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
								}
								m[m.length] = '</tr></tbody></table></td></tr><tr><td colspan="3" class="x-date-bottom" align="center"></td></tr></table><div class="x-date-mp"></div>';

								var el = document.createElement("div");
								el.className = "x-date-picker";
								el.innerHTML = m.join("");

								container.dom.insertBefore(el, position);

								this.el = Ext.get(el);
								this.eventEl = Ext.get(el.firstChild);

								new Ext.util.ClickRepeater(this.el.child("td.x-date-left a"), {
									handler : this.showPrevMonth,
									scope : this,
									preventDefault : true,
									stopDefault : true
								});

								new Ext.util.ClickRepeater(this.el.child("td.x-date-right a"), {
									handler : this.showNextMonth,
									scope : this,
									preventDefault : true,
									stopDefault : true
								});

								this.eventEl.on("mousewheel", this.handleMouseWheel, this);

								this.monthPicker = this.el.down('div.x-date-mp');
								this.monthPicker.enableDisplayMode('block');

								var kn = new Ext.KeyNav(this.eventEl, {
									"left" : function (e)
									{
										e.ctrlKey ? this.showPrevMonth() : this.update(this.activeDate.add("d", -1));
									},

									"right" : function (e)
									{
										e.ctrlKey ? this.showNextMonth() : this.update(this.activeDate.add("d", 1));
									},

									"up" : function (e)
									{
										e.ctrlKey ? this.showNextYear() : this.update(this.activeDate.add("d", -7));
									},

									"down" : function (e)
									{
										e.ctrlKey ? this.showPrevYear() : this.update(this.activeDate.add("d", 7));
									},

									"pageUp" : function (e)
									{
										this.showNextMonth();
									},

									"pageDown" : function (e)
									{
										this.showPrevMonth();
									},

									"enter" : function (e)
									{
										e.stopPropagation();
										return true;
									},

									scope : this
								});

								this.eventEl.on("click", this.handleDateClick, this, {
									delegate : "a.x-date-date"
								});

								this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.selectToday, this);

								this.el.unselectable();

								this.cells = this.el.select("table.x-date-inner tbody td");
								this.textNodes = this.el.query("table.x-date-inner tbody span");

								this.mbtn = new Ext.Button({
									text : "&#160;",
									tooltip : this.monthYearText,
									renderTo : this.el.child("td.x-date-middle", true)
								});

								this.mbtn.on('click', this.showMonthPicker, this);
								this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");

								this.clearBtn = new Ext.Button({
									renderTo : this.el.child("td.x-date-bottom", true),
									text : CRB.getFWBundle()['LBL_CLEAR'],
									style : 'display:inline;',
									cls : 'portal_pos_btn',
									handler : this.clearFn,
									scope : this
								});

								var today = (new Date()).dateFormat(this.format);
								this.todayBtn = new Ext.Button({
									renderTo : this.el.child("td.x-date-bottom", true),
									text : String.format(this.todayText, today),
									tooltip : String.format(this.todayTip, today),
									// style:'display:inline;',
									style : 'display:none;',
									handler : this.selectToday,
									scope : this
								});

								if (Ext.isIE)
								{
									this.el.repaint();
								}
								this.update(this.value);
							},
							/**
							 * Sets the value of the date field
							 * 
							 * @param {Date} value The date to set
							 */
							setValue : function (value)
							{
								var old = this.value;
								if (value.clearTime)
								{
									this.value = value.clearTime(true);
								}
								if (this.el)
								{
									this.update(this.value);
								}
							},
							/**
							 * 
							 */
							update : function (date, forceRefresh)
							{
								var vd = this.activeDate;
								this.activeDate = date;
								if (!forceRefresh && vd && this.el)
								{
									var t = date.getTime();
									if (vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear())
									{
										this.cells.removeClass("x-date-selected");
										this.cells.each(function (c)
										{
											if (c.dom.firstChild.dateValue == t)
											{
												c.addClass("x-date-selected");
												setTimeout(function ()
												{
													try
													{
														c.dom.firstChild.focus();
													} catch (e)
													{
													}
												}, 50);
												return false;
											}
										});
										return;
									}
								}
								var days = date.getDaysInMonth();
								var firstOfMonth = date.getFirstDateOfMonth();
								var startingPos = firstOfMonth.getDay() - this.startDay;

								if (startingPos <= this.startDay)
								{
									startingPos += 7;
								}

								var pm = date.add("mo", -1);
								var prevStart = pm.getDaysInMonth() - startingPos;

								var cells = this.cells.elements;
								var textEls = this.textNodes;
								days += startingPos;
								// convert everything to numbers so it's fast
								var day = 86400000;
								var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
								var today = new Date().clearTime().getTime();
								var sel = date.clearTime().getTime();
								var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
								var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
								var ddMatch = this.disabledDatesRE;
								var ddText = this.disabledDatesText;
								var ddays = this.disabledDays ? this.disabledDays.join("") : false;
								var ddaysText = this.disabledDaysText;
								var format = this.format;

								var setCellClass = function (cal, cell){
							var dfY = d.getFullYear();
							cell.title = "";
							var foundday, eCell = Ext.get(cell), tiptext = false, fvalue;
							/**
							 * Method added to maintain the parsed holiday list
							 * which will be used by other methods later. Since
							 * this is mainatined in a multidimensional array
							 * due which as this method will be invoked for most
							 * of the date picker listeners,so to avoid the
							 * calculation every time and especially for
							 * performance boosting this is mainatined for the
							 * same.
							 */

							if (cal.markNationalHolidays) {
								// calculate new holiday list for current year
								if (!Ext.isEmpty(cal.nationalHolidays)) {
									cal.nationalHolidaysNumbered = cal.parsedHolidayDates;
								} else {
									cal.nationalHolidaysNumbered = [ [], [] ];
								}
							}
									var t = d.getTime();
									cell.firstChild.dateValue = t;
									if (t == today)
									{
										cell.className += " x-date-today";
										cell.title = cal.todayText;
									}
									if (t == sel)
									{
										cell.className += " x-date-selected";
										setTimeout(function ()
										{
											try
											{
												cell.firstChild.focus();
											} catch (e)
											{
											}
										}, 50);
									}
									// disabling
									if (t < min)
									{
										cell.className = " x-date-disabled";
										cell.title = cal.minText;
										return;
									}
									if (t > max)
									{
										cell.className = " x-date-disabled";
										cell.title = cal.maxText;
										return;
									}
									if (ddays)
									{
										if (ddays.indexOf(d.getDay()) != -1)
										{
											cell.title = ddaysText;
											cell.className = " x-date-disabled";
										}
									}
									if (ddMatch && format)
									{
										var fvalue = d.dateFormat(format);
										if (ddMatch.test(fvalue))
										{
											cell.title = ddText.replace("%0", fvalue);
											cell.className = " x-date-disabled";

								}

							}
							//This is the actual process of color coding holiday dates for any week that fall under the month of that year.
							if (cal.markNationalHolidays){
									if(cal.nationalHolidaysNumbered[0]
									&& cal.nationalHolidaysNumbered[0].length > 0) {
								foundday = cal.nationalHolidaysNumbered[0]
										.indexOf(t);
								if (foundday != -1) {
									cell.className = "x-datepickerplus-nationalholidays";
									//Additional css added for customization
									eCell.addClass(cal.nationalHolidaysCls);
									cell.title = (!Ext.isEmpty(cal.nationalHolidaysNumbered[1][foundday]) ? cal.nationalHolidaysNumbered[1][foundday]
											: false);

								}
							}//The values specified in weekEndList will be used to color code the week ends if it is configured
									if (!Ext.isEmpty(cal.weekEndList)){
										var weekEndValues = cal.weekEndList.split(',');
										for(var i=0; i<weekEndValues.length; i++){
											if(d.getDay()==weekEndValues[i]){
												cell.className = "x-datepickerplus-weekends";
												eCell.addClass(cal.weekEndCls);
												cell.title = cal.weedEndText;//setting Tool tip text
											}
										}
										
									}
									//Else Saturdays and Sundays will be marked as week ends
									else {
										if(d.getDay()===0 || d.getDay()===6){
											cell.className = "x-datepickerplus-weekends";
											eCell.addClass(cal.nationalHolidaysCls);
											cell.title = cal.weedEndText;//setting Tool tip text
											}
										}
									
							}
								};

								var i = 0;
								for (; i < startingPos; i++)
								{
									textEls[i].innerHTML = (++prevStart);
									d.setDate(d.getDate() + 1);
									cells[i].className = "x-date-prevday";
									setCellClass(this, cells[i]);
								}
								for (; i < days; i++)
								{
									intDay = i - startingPos + 1;
									textEls[i].innerHTML = (intDay);
									d.setDate(d.getDate() + 1);
									cells[i].className = "x-date-active";
									setCellClass(this, cells[i]);
								}
								var extraDays = 0;
								for (; i < 42; i++)
								{
									textEls[i].innerHTML = (++extraDays);
									d.setDate(d.getDate() + 1);
									cells[i].className = "x-date-nextday";
									setCellClass(this, cells[i]);
								}

								this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

								if (!this.internalRender)
								{
									var main = this.el.dom.firstChild;
									var w = main.offsetWidth;
									this.el.setWidth(w + this.el.getBorderWidth("lr"));
									Ext.fly(main).setWidth(w);
									this.internalRender = true;
									// opera does not respect the auto grow header
									// center column
									// then, after it gets a width opera refuses to
									// recalculate
									// without a second pass
									if (Ext.isOpera && !this.secondPass)
									{
										main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth + main.rows[0].cells[2].offsetWidth))
													+ "px";
										this.secondPass = true;
										this.update.defer(10, this, [ date ]);
									}
								}
							},

							/**
							 * 
							 */
							beforeDestroy : function ()
							{
								if (this.rendered)
								{
									this.mbtn.destroy();
									this.todayBtn.destroy();
									this.clearBtn.destroy();
								}
							},
							/**
							 * 
							 */
							focus : function ()
							{
								if (this.rendered)
								{
									this.clearBtn.focus();
								}
							}
						});

/**
 * If ordinary datefields require CLEAR button this override should be used. The change can be removed if nowhere its
 * confirmed we are directly using date-field
 */
Ext.override(Ext.form.DateField, {
	clearDate : function (fieldObj)
	{
		fieldObj.setValue('');
		if (fieldObj.menu)
			fieldObj.menu.hide();
		fieldObj.clearInvalid();
		this.fireEvent('clear', this, this.value);
	},
	/**
	 * 
	 */
	onTriggerClick : function ()
	{
		if (this.disabled)
		{
			return;
		}
		if (this.menu == null)
		{
			this.menu = new Ext.menu.DateMenu({
				hideOnClick : false,
				focusOnSelect : false
			});
		}
		this.onFocus();
		Ext.apply(this.menu.picker, {
			minDate : this.minValue,
			maxDate : this.maxValue,
			disabledDatesRE : this.disabledDatesRE,
			disabledDatesText : this.disabledDatesText,
			disabledDays : this.disabledDays,
			disabledDaysText : this.disabledDaysText,
			format : this.format,
			showToday : this.showToday,
			nationalHolidaysCls: this.nationalHolidaysCls, //setting the holiday cls an additional attribute to custom the css class.
			weekEndCls: this.weekEndCls,//setting the CSS class that should be applied for week ends
			markNationalHolidays:this.markNationalHolidays, //Boolean value for holiday dates validation and disabling...only executes if this attribute is true
			nationalHolidays:this.holidayList, //Maintaining the days of the week that should be marked as week ends
			minText : String.format(this.minText, this.formatDate(this.minValue)),
			maxText : String.format(this.maxText, this.formatDate(this.maxValue))
		});
		this.menu.on(Ext.apply({}, this.menuListeners, {
			scope : this
		}));
		var that = this;
		this.menu.picker.setValue(this.getValue() || new Date());
		this.menu.picker.clearFn = function ()
		{
			that.clearDate(that);
		};
		this.menu.show(this.el, "tl-bl?");
		this.menuEvents('on');
	}
});

/**
 * To apply focus and blur event for the button. This was done as part of lookup's tab focus issue.
 */
Ext.override(Ext.Button, {
	onFocus : function (A)
	{
		if (!this.disabled)
		{
			this.el.addClass("x-btn-focus");
			this.fireEvent("focus", this);
		}
	},
	onBlur : function (e)
	{
		if (this.fireEvent("blur", this) === false)
		{
			return false;
		}
		this.el.removeClass("x-btn-focus");
	},
	onMouseOver : function (e)
	{
		if (!this.disabled)
		{
			var internal = e.within(this.el, true);
			if (!internal)
			{
				this.el.addClass('x-btn-over');
			}

			var tempid = this.el.id;
			var ElClasses = document.getElementById(tempid).className;
			if (ElClasses.search("portal_pos_btn") > 1)
			{
				this.el.addClass("portal_pos_btn_hover");
			}
			if (ElClasses.search("portal_neg_btn") > 1)
			{
				this.el.addClass("portal_neg_btn_hover");
			}
			if (!this.monitoringMouseOver)
			{
				this.doc.on('mouseover', this.monitorMouseOver, this);
				this.monitoringMouseOver = true;
			}
			this.fireEvent('mouseover', this, e);
		}
		if (this.isMenuTriggerOver(e, internal))
		{
			this.fireEvent('menutriggerover', this, this.menu, e);
		}

	},
	// private
	monitorMouseOver : function (e)
	{
		if (e.target != this.el.dom && !e.within(this.el))
		{
			if (this.monitoringMouseOver)
			{
				this.doc.un('mouseover', this.monitorMouseOver, this);
				this.monitoringMouseOver = false;
			}
			this.onMouseOut(e);
		}
	},

	// private
	onMouseOut : function (e)
	{

		var internal = e.within(this.el) && e.target != this.el.dom;
		this.el.removeClass('x-btn-over');
		this.fireEvent('mouseout', this, e);
		if (this.isMenuTriggerOut(e, internal))
		{
			this.fireEvent('menutriggerout', this, this.menu, e);
		}
		var tempid = this.el.id;
		if (document.getElementById(tempid))
		{
			var ElClasses = document.getElementById(tempid).className;
			if (ElClasses.search("portal_neg_btn_hover") > 1)
			{
				this.el.removeClass("portal_neg_btn_hover");
			}
			if (ElClasses.search("portal_pos_btn_hover") > 1)
			{
				this.el.removeClass("portal_pos_btn_hover");
			}
		}

	},
	onClick : function (e)
	{
		if (this.tooltip)
		{
			Ext.QuickTips.getQuickTip().cancelShow(this.btnEl);
		}
		if (e)
		{
			e.preventDefault();
		}
		if (e.button !== 0)
		{
			return;
		}
		if (!this.disabled)
		{
			if (this.enableToggle && (this.allowDepress !== false || !this.pressed))
			{
				this.toggle();
			}
			if (this.menu && !this.menu.isVisible() && !this.ignoreNextClick)
			{
				this.showMenu();
			}
			this.fireEvent('click', this, e);
			// Disabling button on click, if it has handler,
			if (Ext.isFunction(this.handler))
			{
				this.disable();
				this.handler.createSequence(
				// this will enable button after handler executed.
				function ()
				{
					if (this.el && this.el.dom)
					{
						this.enable();
					}
				}, this).call(this.scope || this, this, e);
			}
		}

	}
});

Ext
			.override(
						Ext.layout.ToolbarLayout,
						{
							onLayout : function (ct, target)
							{
								if (!this.leftTr)
								{
									var align = ct.buttonAlign == 'center' ? 'center' : 'left';
									target.addClass('x-toolbar-layout-ct');
									if (target.dom.parentNode.className
												&& target.dom.parentNode.className === 'x-html-editor-tb')
									{
										target.insertHtml('beforeEnd', String.format(this.tableHTML, align));
										if (this.hiddenItem == undefined)
										{
											this.hiddenItems = [];
										}
									} else
									{
										target.dom.innerHTML = '<table cellspacing="0" class="x-toolbar-ct"><tbody><tr><td class="x-toolbar-left" align="'
													+ align
													+ '"><table cellspacing="0"><tbody><tr class="x-toolbar-left-row"></tr></tbody></table></td><td class="x-toolbar-right" align="right"><table cellspacing="0" class="x-toolbar-right-ct"><tbody><tr><td><table cellspacing="0"><tbody><tr class="x-toolbar-right-row"></tr></tbody></table></td><td><table cellspacing="0"><tbody><tr class="x-toolbar-extras-row"></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>';
									}
									this.leftTr = target.child('tr.x-toolbar-left-row', true);
									this.rightTr = target.child('tr.x-toolbar-right-row', true);
									this.extrasTr = target.child('tr.x-toolbar-extras-row', true);
								}
								var side = ct.buttonAlign == 'right' ? this.rightTr : this.leftTr, pos = 0, items = ct.items.items;

								for (var i = 0, len = items.length, c; i < len; i++, pos++)
								{
									c = items[i];
									if (c.isFill)
									{
										side = this.rightTr;
										pos = -1;
									} else if (!c.rendered)
									{
										c.render(this.insertCell(c, side, pos));
										if (target.dom.parentNode.className
													&& target.dom.parentNode.className === 'x-html-editor-tb')
										{
											this.configureItem(c);
										}
									} else
									{
										if (!c.xtbHidden && !this.isValidParent(c, side.childNodes[pos]))
										{
											var td = this.insertCell(c, side, pos);
											td.appendChild(c.getPositionEl().dom);
											c.container = Ext.get(td);
										}
									}
								}

								this.cleanup(this.leftTr);
								this.cleanup(this.rightTr);
								this.cleanup(this.extrasTr);
								this.fitToSize(target);
							}
						});

Ext.override(Ext.BoxComponent, {
	setAutoScroll : function (scroll)
	{
		if (this.rendered && this.getContentTarget())
		{
			this.getContentTarget().setOverflow(scroll ? 'auto' : '');
		}
		this.autoScroll = scroll;
		return this;
	}
});

Ext.override(Ext.Component, {
	render : function (container, position)
	{
		if (!this.rendered && this.fireEvent('beforerender', this) !== false)
		{
			if (!container && this.el)
			{
				this.el = Ext.get(this.el);
				container = this.el.dom.parentNode;
				this.allowDomMove = false;
			}
			this.container = Ext.get(container);
			if (this.ctCls)
			{
				this.container.addClass(this.ctCls);
			}
			this.rendered = true;
			if (position !== undefined)
			{
				if (Ext.isNumber(position))
				{
					position = this.container.dom.childNodes[position];
				} else
				{
					position = Ext.getDom(position);
				}
			}
			try
			{
				this.onRender(this.container, position || null);
			} catch (e)
			{
			}
			if (this.autoShow)
			{
				this.el.removeClass([ 'x-hidden', 'x-hide-' + this.hideMode ]);
			}
			if (this.cls)
			{
				this.el.addClass(this.cls);
				delete this.cls;
			}
			if (this.style)
			{
				this.el.applyStyles(this.style);
				delete this.style;
			}
			if (this.overCls)
			{
				this.el.addClassOnOver(this.overCls);
			}
			this.fireEvent('render', this);

			//

			var contentTarget = this.getContentTarget();
			if (this.html)
			{
				contentTarget.update(Ext.DomHelper.markup(this.html));
				delete this.html;
			}
			if (this.contentEl)
			{
				var ce = Ext.getDom(this.contentEl);
				if (ce != null)
				{
					Ext.fly(ce).removeClass([ 'x-hidden', 'x-hide-display' ]);
					contentTarget.appendChild(ce);
				}
			}
			if (this.tpl)
			{
				if (!this.tpl.compile)
				{
					this.tpl = new Ext.XTemplate(this.tpl);
				}
				if (this.data)
				{
					this.tpl[this.tplWriteMode](contentTarget, this.data);
					delete this.data;
				}
			}
			this.afterRender(this.container);

			if (this.hidden)
			{

				this.doHide();
			}
			if (this.disabled)
			{

				this.disable(true);
			}

			if (this.stateful !== false)
			{
				this.initStateEvents();
			}
			this.fireEvent('afterrender', this);
		}

		return this;
	}
});

Ext.apply(Ext.grid.CheckboxSelectionModel.prototype, {
	// Enables selection of individual rows in
	// CheckboxSelectionModel and fixes a bug
	// wherein the header checkbox remains selected when rows
	// are deselected
	onMouseDown : function (e, t)
	{
		// if using left mouse button and simpleSelect or
		// checkbox was clicked
		if (e.button === 0
					&& (t.className == 'x-grid3-row-checker' || (!this.singleSelect && Ext.fly(t).hasClass(
								'x-grid3-cell-inner'))))
		{
			e.stopEvent();
			var row = e.getTarget('.x-grid3-row');
			if (row)
			{
				var index = row.rowIndex;
				if (this.isSelected(index))
				{
					this.deselectRow(index);
					// deselect checkbox header if selected
					var hd = Ext.DomQuery.selectNode('.x-grid3-hd-checker', this.grid.view.innerHd);
					if (hd)
						Ext.fly(hd).removeClass('x-grid3-hd-checker-on');
				} else
				{
					this.selectRow(index, true);
					if (this.getCount() == this.grid.getStore().getCount())
					{
						var hd = Ext.DomQuery.selectNode('.x-grid3-hd-checker', this.grid.view.innerHd);
						if (hd)
							Ext.fly(hd).addClass('x-grid3-hd-checker-on');
					}
				}
			}
		}
	}
});

Ext.override(Ext.form.FormPanel, {
	getPrintData : function ()
	{
		var fItems = this.items;
		var formMetaData = {};
		var defaultTitle = '';
		if (this.findParentByType('iportal-window'))
		{
			defaultTitle = this.findParentByType('iportal-window').title;
		}
		formMetaData['formtitle'] = this.title || defaultTitle;
		formMetaData['fieldsets'] = [];
		var formpanelItems = {};
		fItems.each(function (item)
		{
			if (item.getXType() !== 'hidden' && !item.hidden)
			{
				if (Ext.type(item.getPrintData) === 'function')
				{
					if (item.getXType() == 'panel')
					{
						formpanelItems = item.getPrintData();
						var panelObj = {};
						Ext.each(formpanelItems, function (pi)
						{
							if (pi.fields)
							{
								formMetaData['fieldsets'].push(pi);
							} else
							{
							}
						});
					} else if (item.getXType() == 'iportal-fieldset')
					{
						// alert(item.getXType());
						formpanelItems = item.getPrintData();
						formMetaData['fieldsets'].push(formpanelItems);
					} else
					{
						// alert(item.getXType());
						formpanelItems = item.getPrintData();
						var pfieldSet = {};
						pfieldSet['sectiontitle'] = '';
						pfieldSet['fields'] = [ formpanelItems ];
						formMetaData['fieldsets'].push(pfieldSet);
					}
				}
			}
		}, this);
		return formMetaData;
	}
});
Ext.override(Ext.Panel, {
	getPrintData : function ()
	{
		var pItems = this.items;
		var panelItems = [];
		var panelItem;
		pItems.each(function (item, index, length)
		{
			if (item.getXType() !== 'hidden' && !item.hidden)
			{
				if (Ext.type(item.getPrintData) === 'function')
				{
					if (item.getXType() == 'panel')
					{
						panelItem = item.getPrintData();
						var panelObj = {};
						Ext.each(panelItem, function (pi)
						{
							if (Ext.encode(pi) != '{}')
							{
								panelItems.push(pi);
							}
						});
					} else if (item.getXType() == 'iportal-fieldset')
					{
						panelItem = item.getPrintData();
						if (Ext.isArray(panelItem))
						{
							var panelObj = {};
							Ext.each(panelItem, function (pi)
							{
								if (Ext.encode(pi) != '{}')
								{
									panelItems.push(pi);
								}
								// Ext.apply(panelObj,pi);
							});
							// panelItems.push(panelObj);
						} else
						{
							panelItems.push(panelItem);
						}
					} else
					{
						panelItems.push(item.getPrintData());
					}
				}
			}
		}, this);
		return panelItems;
	}
});

/***/
Ext.override(Ext.form.RadioGroup, {
	setValueForItem : function (val)
	{
		if (val != undefined)
		{
			// :if(val != undefined){
			val = String(val).split(',')[0];
			this.eachItem(function (item)
			{
				item.setValue(val == item.inputValue);
			});
		}
	}
});

Ext.grid.RowSelectionModel.override({
	getSelectedIndex : function ()
	{
		return this.grid.store.indexOf(this.selections.itemAt(0));
	}
});

Ext.grid.CheckboxSelectionModel.override({
	onHdMouseDown : function (e, t)
	{
		if (this.selectAllRows)
		{
			if (t.className == 'x-grid3-hd-checker')
			{
				e.stopEvent();
				var hd = Ext.fly(t.parentNode);
				var isChecked = hd.hasClass('x-grid3-hd-checker-on');
				if (isChecked)
				{
					hd.removeClass('x-grid3-hd-checker-on');
					this.clearSelections();
				} else
				{
					hd.addClass('x-grid3-hd-checker-on');
					this.selectAll();
				}
			}
		} else
		{
			return;// To stop select all rows since problem for
			// singleselectional model
		}
	}

});

Ext.grid.GridView
			.override({
				getCellIndex : function (el)
				{
					if (el)
					{
						var m = el.className.match(this.colRe);
						if (m && m[1] && this.cm)
						{
							return this.cm.getIndexById(m[1]);
						}
					}
					return false;
				}
				
				// Overriden this method to pass grid object in column renderer
				,
				doRender : function (columns, records, store, startRow, colCount, stripe)
				{
					var templates = this.templates, cellTemplate = templates.cell, rowTemplate = templates.row, last = colCount - 1, tstyle = 'width:'
								+ this.getTotalWidth() + ';',

					rowBuffer = [], colBuffer = [], rowParams = {
						tstyle : tstyle
					}, meta = {}, len = records.length, alt, column, record, i, j, rowIndex;

					for (j = 0; j < len; j++)
					{
						record = records[j];
						colBuffer = [];

						rowIndex = j + startRow;

						for (i = 0; i < colCount; i++)
						{
							column = columns[i];

							meta.id = column.id;
							meta.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
							meta.attr = meta.cellAttr = '';
							meta.style = column.style;
							meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record,
										rowIndex, i, store, this.grid);

							if (Ext.isEmpty(meta.value))
							{
								meta.value = '&#160;';
							}

							if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined')
							{
								meta.css += ' x-grid3-dirty-cell';
							}

							colBuffer[colBuffer.length] = cellTemplate.apply(meta);
						}

						alt = [];

						if (stripe && ((rowIndex + 1) % 2 === 0))
						{
							alt[0] = 'x-grid3-row-alt';
						}

						if (record.dirty)
						{
							alt[1] = ' x-grid3-dirty-row';
						}

						rowParams.cols = colCount;

						if (this.getRowClass)
						{
							alt[2] = this.getRowClass(record, rowIndex, rowParams, store);
						}

						rowParams.alt = alt.join(' ');
						rowParams.cells = colBuffer.join('');

						rowBuffer[rowBuffer.length] = rowTemplate.apply(rowParams);
					}

					return rowBuffer.join('');
				},
				refreshRow : function (record)
				{
					var store = this.ds, colCount = this.cm.getColumnCount(), columns = this.getColumnData(), last = colCount - 1, cls = [ 'x-grid3-row' ], rowParams = {
						tstyle : String.format("width: {0};", this.getTotalWidth())
					}, colBuffer = [], cellTpl = this.templates.cell, rowIndex, row, column, meta, css, i;
					if (Ext.isNumber(record))
					{
						rowIndex = record;
						record = store.getAt(rowIndex);
					} else
					{
						rowIndex = store.indexOf(record);
					}
					if (!record || rowIndex < 0)
					{
						return;
					}
					for (i = 0; i < colCount; i++)
					{
						column = columns[i];
						if (i == 0)
						{
							css = 'x-grid3-cell-first';
						} else
						{
							css = (i == last) ? 'x-grid3-cell-last ' : '';
						}
						meta = {
							id : column.id,
							style : column.style,
							css : css,
							attr : "",
							cellAttr : ""
						};
						meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record,
									rowIndex, i, store, this.grid);
						if (Ext.isEmpty(meta.value))
						{
							meta.value = '&#160;';
						}
						if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined')
						{
							meta.css += ' x-grid3-dirty-cell';
						}
						colBuffer[i] = cellTpl.apply(meta);
					}
					row = this.getRow(rowIndex);
					row.className = '';
					if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0))
					{
						cls.push('x-grid3-row-alt');
					}
					if (this.getRowClass)
					{
						rowParams.cols = colCount;
						cls.push(this.getRowClass(record, rowIndex, rowParams, store));
					}
					this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
					rowParams.cells = colBuffer.join("");
					row.innerHTML = this.templates.rowInner.apply(rowParams);
					this.fireEvent('rowupdated', this, rowIndex, record);
				}
			});

/*
 * 
 * doLayout - Ext.Container Overridden to add this.layout.layout in the if check
 * 
 */
Ext.override(Ext.Container, {
	doLayout : function (shallow, force)
	{
		var rendered = this.rendered, forceLayout = force || this.forceLayout;

		if (this.collapsed || !this.canLayout())
		{
			this.deferLayout = this.deferLayout || !shallow;
			if (!forceLayout)
			{
				return;
			}
			shallow = shallow && !this.deferLayout;
		} else
		{
			delete this.deferLayout;
		}
		if (rendered && this.layout && this.layout.layout)
		{// Updated
			this.layout.layout();
		}
		if (shallow !== true && this.items)
		{
			var cs = this.items.items;
			for (var i = 0, len = cs.length; i < len; i++)
			{
				var c = cs[i];
				if (c.doLayout)
				{
					c.doLayout(false, forceLayout);
				}
			}
		}
		if (rendered)
		{
			this.onLayout(shallow, forceLayout);
		}

		this.hasLayout = true;
		delete this.forceLayout;
	},
	getComponent : function (comp)
	{
		if (Ext.isObject(comp))
		{
			comp = comp.getItemId();
		}
		try
		{
			return this.items.get(comp);
		} catch (err)
		{
			LOGGER.error('No Component is available');
		}
	}

});
/**
 * The behaviour setValueForItem method of radiogroup class sets the items rather than setting the selected value.
 * Ovveriding the setValueForItem method in radiogroup class to set the selected value explicitly which returns the
 * selected value rather than items
 */
Ext.override(Ext.form.RadioGroup, {
	setValueForItem : function (val)
	{
		if (val != undefined)
		{ 
			// :if(val != undefined){
			val = String(val).split(',')[0];
			this.eachItem(function (item)
			{
				item.setValue(val == item.inputValue);
			});
		}
	}
});
/**
 * The behaviour getValue method of CheckboxGroup class gets the items rather than getting the selected values.
 * Ovveriding the getValue method in CheckboxGroup class to get the selected value explicitly which returns the selected
 * value rather than items
 */
Ext.override(Ext.form.CheckboxGroup, {
	getValue : function ()
	{
		var out = [];
		this.eachItem(function (item)
		{
			if (item.checked)
			{
				out.push(item.inputValue);
			}
		});
		return out;
	}
});
/**
 * The behaviour onClick method of Checkbox class intended to find the element is readonly or not before setting the
 * value
 */
Ext.override(Ext.form.Checkbox, {
	onClick : function (e, o)
	{
		if (this.readOnly === true)
		{
			e.preventDefault();
		} else
		{
			if (this.el.dom.checked != this.checked)
			{
				this.setValueEvent(this.el.dom.checked);
				this.setValue(this.el.dom.checked);

			}
		}
	},

	/**
	 * Sets the checked state of the checkbox, fires the 'check' event, and calls a <code>{@link #handler}</code> (if
	 * configured).
	 * 
	 * @param {Boolean/String} checked The following values will check the checkbox:
	 *            <code>true, 'true', '1', or 'on'</code>. Any other value will uncheck the checkbox.
	 * @return {Ext.form.Field} this
	 */
					setValueEvent : function(v) {
					
						Ext.FormFieldFocused = false;     
		var checked = this.checked, inputVal = this.inputValue;

		if (v === false)
		{
			this.checked = false;
		} else
		{
			this.checked = (v === true || v === 'true' || v == '1' || (inputVal ? v == inputVal : String(v)
						.toLowerCase() == 'on'));
		}

		if (this.rendered)
		{
			this.el.dom.checked = this.checked;
			this.el.dom.defaultChecked = this.checked;
		}
		if (checked != this.checked)
		{
			this.fireEvent('check', this, this.checked);
			if (this.handler)
			{
				this.handler.call(this.scope || this, this, this.checked);
			}
		}
		return this;
	},
	/**
	 * Sets the checked state of the checkbox
	 * 
	 * @param {Boolean/String} checked The following values will check the checkbox:
	 *            <code>true, 'true', '1', or 'on'</code>. Any other value will uncheck the checkbox.
	 * @return {Ext.form.Field} this
	 */
	setValue : function (v)
	{
		var checked = this.checked, inputVal = this.inputValue;

		if (v === false)
		{
			this.checked = false;
		} else
		{
			this.checked = (v === true || v === 'true' || v == '1' || (inputVal ? v == inputVal : String(v)
						.toLowerCase() == 'on'));
		}
		/**
		 * Proper undefined checking of the element of the check box before setting the value
		 */
		if (this.rendered)
		{
			if (this.el && this.el.dom)
			{
				this.el.dom.checked = this.checked;
				this.el.dom.defaultChecked = this.checked;
			}
		}
		if (checked != this.checked)
		{
			if (this.handler)
			{
				this.handler.call(this.scope || this, this, this.checked);
			}
		}
		return this;
	}
});

Ext.override(Ext.form.HtmlEditor, {
	/*
	 * Object(Boolean) used to indicate whether the field has cleared the invalid icon or not.DEfaults to false
	 */
	addClearInvalidListener : false,
	/*
	 * The createToolbar method has been overridden here.Requirement of overriding: Default configuraion of toolbar is --
	 * var tb = new Ext.Toolbar({ renderTo : this.wrap.dom.firstChild, items : items }); where enableOverflow has set to
	 * false. But on resizing the editor to show the hidden tools we need as true. That is why the method has overridden
	 * 
	 * 
	 */
	createToolbar : function (editor)
	{
		var items = [];
		var tipsEnabled = Ext.QuickTips && Ext.QuickTips.isEnabled();

		function btn (id, toggle, handler)
		{
			return {
				itemId : id,
				cls : 'x-btn-icon',
				iconCls : 'x-edit-' + id,
				enableToggle : toggle !== false,
				scope : editor,
				handler : handler || editor.relayBtnCmd,
				clickEvent : 'mousedown',
				tooltip : tipsEnabled ? editor.buttonTips[id] || undefined : undefined,
				overflowText : editor.buttonTips[id].title || undefined,
				tabIndex : -1
			};
		}

		if (this.enableFont && !Ext.isSafari2)
		{
			var fontSelectItem = new Ext.Toolbar.Item({
				autoEl : {
					tag : 'select',
					cls : 'x-font-select',
					html : this.createFontOptions()
				}
			});

			items.push(fontSelectItem, '-');
		}

		if (this.enableFormat)
		{
			items.push(btn('bold'), btn('italic'), btn('underline'));
		}

		if (this.enableFontSize)
		{
			items.push('-', btn('increasefontsize', false, this.adjustFont), btn('decreasefontsize', false,
						this.adjustFont));
		}

		if (this.enableColors)
		{
			items.push('-', {
				itemId : 'forecolor',
				cls : 'x-btn-icon',
				iconCls : 'x-edit-forecolor',
				clickEvent : 'mousedown',
				tooltip : tipsEnabled ? editor.buttonTips.forecolor || undefined : undefined,
				tabIndex : -1,
				menu : new Ext.menu.ColorMenu({
					allowReselect : true,
					focus : Ext.emptyFn,
					value : '000000',
					plain : true,
					listeners : {
						scope : this,
						select : function (cp, color)
						{
							this.execCmd('forecolor', Ext.isWebKit || Ext.isIE ? '#' + color : color);
							this.deferFocus();
						}
					},
					clickEvent : 'mousedown'
				})
			}, {
				itemId : 'backcolor',
				cls : 'x-btn-icon',
				iconCls : 'x-edit-backcolor',
				clickEvent : 'mousedown',
				tooltip : tipsEnabled ? editor.buttonTips.backcolor || undefined : undefined,
				tabIndex : -1,
				menu : new Ext.menu.ColorMenu({
					focus : Ext.emptyFn,
					value : 'FFFFFF',
					plain : true,
					allowReselect : true,
					listeners : {
						scope : this,
						select : function (cp, color)
						{
							if (Ext.isGecko)
							{
								this.execCmd('useCSS', false);
								this.execCmd('hilitecolor', color);
								this.execCmd('useCSS', true);
								this.deferFocus();
							} else
							{
								this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isWebKit || Ext.isIE ? '#'
											+ color : color);
								this.deferFocus();
							}
						}
					},
					clickEvent : 'mousedown'
				})
			});
		}

		if (this.enableAlignments)
		{
			items.push('-', btn('justifyleft'), btn('justifycenter'), btn('justifyright'));
		}

		if (!Ext.isSafari2)
		{
			if (this.enableLinks)
			{
				items.push('-', btn('createlink', false, this.createLink));
			}

			if (this.enableLists)
			{
				items.push('-', btn('insertorderedlist'), btn('insertunorderedlist'));
			}
			if (this.enableSourceEdit)
			{
				items.push('-', btn('sourceedit', true, function (btn)
				{
					this.toggleSourceEdit(!this.sourceEditMode);
				}));
			}
		}

		var tb = new Ext.Toolbar({
			renderTo : this.wrap.dom.firstChild,
			items : items,
			enableOverflow : true
		});

		if (fontSelectItem)
		{
			this.fontSelect = fontSelectItem.el;

			this.mon(this.fontSelect, 'change', function ()
			{
				var font = this.fontSelect.dom.value;
				this.relayCmd('fontname', font);
				this.deferFocus();
			}, this);
		}

		this.mon(tb.el, 'click', function (e)
		{
			e.preventDefault();
		});

		this.tb = tb;
		this.tb.doLayout();

	},
	updateToolbar : function ()
	{

		if (this.readOnly)
		{
			return;
		}

		if (!this.activated)
		{
			this.onFirstFocus();
			return;
		}

		var btns = this.tb.items.map, doc = this.getDoc();

		if (this.enableFont && !Ext.isSafari2)
		{
			var name = (doc.queryCommandValue('FontName') || this.defaultFont).toLowerCase();
			if (name != this.fontSelect.dom.value)
			{
				this.fontSelect.dom.value = name;
			}
		}
		if (this.enableFormat)
		{
			btns.bold.toggle(doc.queryCommandState('bold'));
			btns.italic.toggle(doc.queryCommandState('italic'));
			btns.underline.toggle(doc.queryCommandState('underline'));
		}
		if (this.enableAlignments)
		{
			btns.justifyleft.toggle(doc.queryCommandState('justifyleft'));
			btns.justifycenter.toggle(doc.queryCommandState('justifycenter'));
			btns.justifyright.toggle(doc.queryCommandState('justifyright'));
		}

		Ext.menu.MenuMgr.hideAll();

		this.syncValue();
	},

	/*
	 * Private Method:markInvalid is not supported by the default html editor.To bring that functionality we added the
	 * method
	 */
	markInvalid : function ()
	{
		if (!this.rendered || this.preventMark)
		{
			return;
		}
		if (this.addClearInvalidListener)
		{
			this.on('sync', this.clearInvalid);
			this.addClearInvalidListener = false;
		}
		Ext.form.HtmlEditor.superclass.markInvalid.apply(this, arguments);
		Ext.get(this.iframe).addClass(this.invalidClass);
	},
	/* Private Method:alignErrorIcon--to allign the error icon properly */
	alignErrorIcon : function ()
	{
		try
		{
			this.errorIcon.alignTo(this.wrap, 'tl-tr', [ 2, 0 ]);
		} catch (err)
		{
		}
	},
	/*
	 * Priate Method:Default html editor has no method for clearinvalid.The method has introduced here
	 */
	clearInvalid : function ()
	{
		if (!this.rendered || this.preventMark)
		{
			return;
		}
		Ext.form.HtmlEditor.superclass.clearInvalid.apply(this, arguments);
		Ext.get(this.iframe).removeClass(this.invalidClass);
	},

	validate : function ()
	{
		if (!this.rendered || this.preventMark)
		{
			return;
		}
		if (this.allowBlank == false && !this.readOnly)
		{
			if (!this.isEmpty())
			{
				this.clearInvalid();
				return true;
			} else
			{
				this.markInvalid(this.blankText);
				return false;
			}
		} else
		{
			this.clearInvalid();
			return true;
		}
	},
	isEmpty : function ()
	{
		var value = this.getValue();
		value = value.replace(/&nbsp;/gi, "");
		value = value.replace(/<p>/gi, "");
		value = value.replace(/<p align=left>/gi, "");
		value = value.replace(/<p align=right>/gi, "");
		value = value.replace(/<p align=center>/gi, "");
		value = value.replace(/<.p>/gi, "");
		value = value.replace(/<br>/gi, "");
		value = value.trim();
		if (value != '')
			return false;
		return true;
	}
});
Ext.form.HtmlEditor.prototype.listeners = {
	sync : function (t, html)
	{
		t.validateValue();
	}
};

Ext.override(Ext.grid.HeaderDragZone, {
	getDragData : function (e)
	{
		var t = Ext.lib.Event.getTarget(e), h = this.view.findHeaderCell(t);
		var cm = this.grid.colModel;
		if (h)
		{
			
			var oldIndex = cm.grpColumns ? this.view.getGroupedCellIndex(h) : this.view.getCellIndex(h);
			
			if (cm.columns[oldIndex].moveable == false)
			{
				return false;
			}
			return {
				ddel : h.firstChild,
				header : h
			};
		}
		return false;
	}
});

Ext.override(Ext.grid.HeaderDropZone,
			{
				onNodeDrop : function (n, dd, e, data)
				{
					var h = data.header;
					if (h != n)
					{
						var cm = this.grid.colModel, x = Ext.lib.Event.getPageX(e), r = Ext.lib.Dom
									.getRegion(n.firstChild), pt = (r.right - x) <= ((r.right - r.left) / 2) ? "after"
									: "before", oldIndex = cm.grpColumns ? this.view.getGroupedCellIndex(h) : this.view
									.getCellIndex(h), newIndex = cm.grpColumns ? this.view.getGroupedCellIndex(n)
									: this.view.getCellIndex(n);
						if (cm.columns[newIndex].moveable == false)
						{
							return false;
						}

						if (pt == "after")
						{
							newIndex++;
						}
						if (oldIndex < newIndex)
						{
							newIndex--;
						}
						if (cm.grpColumns)
						{
							cbx.grid.groupingheader.GroupingHeaderModel.moveGrpClmHeader(oldIndex, newIndex, cm, n);
						} else
						{
							cm.moveColumn(oldIndex, newIndex);
						}
						return true;
					}
					return false;
				},
				getTargetFromEvent : function (e)
				{
					var t = Ext.lib.Event.getTarget(e), cindex, cm = this.grid.colModel;

					if (cm.grpColumns)
					{
						cindex = this.view.findGroupedCellIndex(t);
					} else
					{
						cindex = this.view.findCellIndex(t);
					}

					if (cindex !== false)
					{
						return this.view.getHeaderCell(cindex);
					}
				},
				prevVisible : function (h)
				{
					var v = this.view, cm = this.grid.colModel;
					h = h.prevSibling;
					while (h)
					{
						if (!cm.isHidden(cm.grpColumns ? v.getGroupedCellIndex(h) : v.getCellIndex(h)))
						{
							return h;
						}
						h = h.prevSibling;
					}
					return null;
				},
				positionIndicator : function (h, n, e)
				{
					var x = Ext.lib.Event.getPageX(e), r = Ext.lib.Dom.getRegion(n.firstChild), px, pt, py = r.top
								+ this.proxyOffsets[1], cm = this.grid.colModel;
					if ((r.right - x) <= (r.right - r.left) / 2)
					{
						px = r.right + this.view.borderWidth;
						pt = "after";
					} else
					{
						px = r.left;
						pt = "before";
					}
					var cellIndex;
					if (cm.grpColumns)
					{
						cellIndex = this.view.getGroupedCellIndex(n);
					} else
					{
						cellIndex = this.view.getCellIndex(n);
					}
					if (this.grid.colModel.isFixed(cellIndex))
					{
						return false;
					}

					px += this.proxyOffsets[0];
					this.proxyTop.setLeftTop(px, py);
					this.proxyTop.show();
					if (!this.bottomOffset)
					{
						this.bottomOffset = this.view.mainHd.getHeight();
					}
					this.proxyBottom.setLeftTop(px, py + this.proxyTop.dom.offsetHeight + this.bottomOffset);
					this.proxyBottom.show();
					return pt;
				},
				onNodeEnter : function (n, dd, e, data)
				{
					if (data.header != n)
					{
						this.positionIndicator(data.header, n, e);
					}
				},

				onNodeOver : function (n, dd, e, data)
				{
					var result = false;
					if (data.header != n)
					{
						result = this.positionIndicator(data.header, n, e);
					}
					if (!result)
					{
						this.proxyTop.hide();
						this.proxyBottom.hide();
					}
					return result ? this.dropAllowed : this.dropNotAllowed;
				},

				onNodeOut : function (n, dd, e, data)
				{
					this.proxyTop.hide();
					this.proxyBottom.hide();
				}
			});

if (Ext.isIE9)
{
	Ext.Component.prototype.originalRender = Ext.Component.prototype.render;
	Ext.override(Ext.Component, {
		render : function (container, position)
		{
			var hasIframe = (this.html && Ext.isString(this.html) && (this.html.toLowerCase().indexOf('iframe') >= 0));
			if (hasIframe)
			{
				var originalHtml = this.html;
				delete this.html;
			}
			var result = Ext.Component.prototype.originalRender.apply(this, arguments);
			if (hasIframe)
			{
				var contentTarget = this.getContentTarget();
				contentTarget.update.defer(100, contentTarget, [ Ext.DomHelper.markup(originalHtml) ]);
			}
			return result;
		}
	});
};

Ext.layout.BorderLayout.Region.prototype.getCollapsedEl = Ext.layout.BorderLayout.Region.prototype.getCollapsedEl
			.createSequence(function ()
			{
				if ((this.position == 'south') && !this.collapsedEl.titleEl)
				{
					this.collapsedEl.titleEl = this.collapsedEl.createChild({
						cls : 'x-collapsed-title',
						cn : this.panel.title
					});
				}
			});

Ext.override(Ext.grid.GridView, {
	handleHdMenuClickDefault : function (item)
	{
		var colModel = this.cm, itemId = item.getItemId(), index = colModel.getIndexById(itemId.substr(4));

		if (index != -1)
		{
			if (item.checked && colModel.getColumnsBy(this.isHideableColumn, this).length <= 1)
			{
				this.onDenyColumnHide();
				return false;
			}
			colModel.setHidden(index, item.checked);
		}
	},
	handleHdMenuClick : function (item)
	{
		var store = this.ds, dataIndex = this.cm.getDataIndex(this.hdCtxIndex);

		switch (item.getItemId())
		{
			case 'asc':
				store.sort(dataIndex, 'ASC');
				break;
			case 'desc':
				store.sort(dataIndex, 'DESC');
				break;
			default:
				var check = this.handleHdMenuClickDefault(item);
				if (false === check)
				{
					return false;
				}
		}
		return true;
	}
});

Ext.override(Ext.data.Node, {
	/**
	 * Returns true if this node is a leaf
	 * 
	 * @return {Boolean}
	 */
	isLeaf : function ()
	{
		return this.leaf == "true";
	}
});

/**
 * Override to fix  box-sizing problem in chrome latest versions
 */
if (!Ext.isDefined(Ext.webKitVersion)) {
    Ext.webKitVersion = Ext.isWebKit ? parseFloat(/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)[1], 10) : NaN;
}
/*
 * Box-sizing was changed beginning with Chrome v19.  For background information, see:
 * http://code.google.com/p/chromium/issues/detail?id=124816
 * https://bugs.webkit.org/show_bug.cgi?id=78412
 * https://bugs.webkit.org/show_bug.cgi?id=87536
 * http://www.sencha.com/forum/showthread.php?198124-Grids-are-rendered-differently-in-upcoming-versions-of-Google-Chrome&p=824367
 *
 * */
/*if (Ext.isWebKit && Ext.webKitVersion >= 535.2) { // probably not the exact version, but the issues started appearing in chromium 19
    Ext.override(Ext.grid.GridView, {
    	getScrollOffset: function () {
    		var boxAdjust = 1;
    		var defaultWidth =  Ext.getScrollBarWidth();
    		var colLength = this.cm.columns.length;
    		defaultWidth = colLength>0?(defaultWidth+(colLength*boxAdjust)):defaultWidth;
    		return Ext.num(this.scrollOffset,defaultWidth);
    	}
    });
    
}
*/

/*
 * Box-sizing was changed beginning with Chrome v19.  For background information, see:
 * http://code.google.com/p/chromium/issues/detail?id=124816
 * https://bugs.webkit.org/show_bug.cgi?id=78412
 * https://bugs.webkit.org/show_bug.cgi?id=87536
 * http://www.sencha.com/forum/showthread.php?198124-Grids-are-rendered-differently-in-upcoming-versions-of-Google-Chrome&p=824367
 *
 * */
if (Ext.isWebKit && Ext.webKitVersion >= 535.2) { // probably not the exact version, but the issues started appearing in chromium 19
    Ext.override(Ext.grid.ColumnModel, {
        getTotalWidth : function (includeHidden) {
            if (!this.totalWidth) {
                var boxsizeadj = 2;
                this.totalWidth = 0;
                for (var i = 0, len = this.config.length; i < len; i++) {
                    if (includeHidden || !this.isHidden(i)) {
                        this.totalWidth += (this.getColumnWidth(i) + boxsizeadj);
                    }
                }
            }
            return this.totalWidth;
        }
    });

   /* Ext.onReady(function () {
        Ext.get(document.body).addClass('ext-chrome-fixes');
        Ext.util.CSS.createStyleSheet('@media screen and (-webkit-min-device-pixel-ratio:0) {.x-grid3-cell{box-sizing: border-box !important;}}', 'chrome-fixes-box-sizing');
    });*/
}