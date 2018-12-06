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
 * <pre>
 * ==============================================================================================
 * CHANGE CODE 		AUTHOR 			DESCRIPTION 								DATE 
 * CHG00TAB			Gagandeep Singh	Code changes brought in after the			29/05/2012
 * 									introduction of the tab panel and
 * 									its events.
 * CBX_FW_Q112F_013    Arafat			Q1 issue fixes								25/07/2012 		
 * CBXR12Q312F04    Gagandeep Singh  Forms - More white space between the Field         24/12/12
 *                                    set border.R12 #76
 *                                    
 * CBXR12Q312F04_UPD Gagandeep Singh  Forms - More white space between the Field        28/12/12
 *                                     set border.R12 #76
 * CBXR12Q113F07_UPD Priyanka Roy    Alignment problem in form fields for tabs     07/05/13
 * ===============================================================================================
 * </pre>
 */
Ext.namespace("Ext.ux.layout");

Ext.ux.layout.TableFormLayout = Ext.extend(Ext.layout.TableLayout, {
	monitorResize : true,
	setContainer : function (){
		Ext.layout.FormLayout.prototype.setContainer.apply(this, arguments);
		this.currentRow = 0;
		this.currentColumn = 0;
		this.cells = [];
	},

	renderItem : function (c, position, target){
		if (c && !c.rendered) {
			var cell = Ext.get(this.getNextCell(c));
			cell.addClass("x-table-layout-column-" + this.currentColumn);
			cell.dom.vAlign = 'top';
			/**
			 * Gagan: Code added to set the vertical alignment
			 * of all the
			 * <td> to top
			 */
			Ext.layout.FormLayout.prototype.renderItem.call(this, c, 0, cell);
		}
	},
	getLayoutTargetSize : Ext.layout.AnchorLayout.prototype.getLayoutTargetSize,
	// getTemplateArgs :
	// Ext.layout.FormLayout.prototype.getTemplateArgs,
	getLabelStyle : function (s, field){
		var labelStyle = this.labelStyle;
		if (this.labelAlign !== 'top') {
			if (field.labelWidth) {
				labelStyle = 'width:' + field.labelWidth + 'px;';
			}
		}
		var ls = '', items = [ labelStyle, s ];
		for ( var i = 0, len = items.length; i < len; ++i) {
			if (items[i]) {
				ls += items[i];
				if (ls.substr(-1, 1) != ';') {
					ls += ';';
				}
			}
		}
		return ls;
	},

	getElementStyle : function (field){
		/*
		 * if (this.labelAlign === 'top' || !field.labelWidth) {
		 * return this.elementStyle; } else { var pad =
		 * Ext.isNumber(this.labelPad) ? this.labelPad : 5;
		 * return 'padding-left:' + (field.labelWidth + pad) +
		 * 'px; margin-bottom : 40px'; }
		 */
		if (Ext.isIE6) {
			return '';
		}
		return 'padding-right:30px';
	},

	getTemplateArgs : function (field){
		var noLabelSep = !field.fieldLabel || field.hideLabel;
		// field.labelStyle = 'padding-left:30px'
		return {
			id : field.id,
			label : field.fieldLabel,
			itemCls : (field.itemCls || this.container.itemCls || '') + (field.hideLabel ? ' x-hide-label' : ''),
			clearCls : field.clearCls || 'x-form-clear-left',
			labelStyle : this.getLabelStyle(field.labelStyle, field) + ';padding-left:0px ',
			elementStyle : this.getElementStyle(field) + ';padding-left:0px ' || '',
			labelSeparator : noLabelSep ? '' : (Ext.isDefined(field.labelSeparator) ? field.labelSeparator
						: this.labelSeparator)
		};
	},
	onLayout : function (ct, target){
		Ext.ux.layout.TableFormLayout.superclass.onLayout.call(this, ct, target);
		if (!target.hasClass("x-table-form-layout-ct")) {
			target.addClass("x-table-form-layout-ct");
		}
		var viewSize = this.getLayoutTargetSize(ct, target);
		var aw, ah;
		if (ct.anchorSize) {
			if (typeof ct.anchorSize == "number") {
				aw = ct.anchorSize;
			} else {
				aw = ct.anchorSize.width;
				ah = ct.anchorSize.height;
			}
		} else {
			aw = ct.initialConfig.width;
			ah = ct.initialConfig.height;
		}

		var cs = this.getRenderedItems(ct), len = cs.length, i, c, a, cw, ch, el, vs, boxes = [];
		var x, w, h, col, colWidth, offset;
		for (i = 0; i < len; i++) {
			c = cs[i];
			// get table cell
			x = c.getEl().parent(".x-table-layout-cell");
			if (this.columnWidths) {
				// get column
				col = parseInt(x.dom.className.replace(/.*x\-table\-layout\-column\-([\d]+).*/, "$1"));
				// get cell width (based on column widths)
				colWidth = 0, offset = 0;
				for (j = col; j < (col + (c.colspan || 1)); j++) {
					colWidth += this.columnWidths[j];
					offset += 10;
				}
				w = (viewSize.width * colWidth) - offset;
			} else {
				// get cell width
				w = (viewSize.width / this.columns) * (c.colspan || 1);
				// LOGGER.info("("+viewSize.width+" /
				// "+this.columns+") * ("+c.colspan+" || 1) :
				// ",(viewSize.width / this.columns) *
				// (c.colspan || 1));
			}
			// set table cell width
			x.setWidth(w);
			// get cell width (-10 for spacing between cells) &
			// height to be base width of anchored component
			// w = w - 10; // Gagan: commented this statement as
			// this was bringing extra space when another
			// container with tableform layout was added
			h = x.getHeight();
			// If a child container item has no anchor and no
			// specific width, set the child to the default
			// anchor size
			if (!c.anchor && c.items && !Ext.isNumber(c.width) && !(Ext.isIE6 && Ext.isStrict)) {
				c.anchor = this.defaultAnchor;
			}

			if (c.anchor) {
				a = c.anchorSpec;
				if (!a) { // cache all anchor values
					vs = c.anchor.split(' ');
					c.anchorSpec = a = {
						right : this.parseAnchor(vs[0], c.initialConfig.width, aw),
						bottom : this.parseAnchor(vs[1], c.initialConfig.height, ah)
					};
				}
				cw = a.right ? this.adjustWidthAnchor(a.right(w), c) : undefined;
				ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h), c) : undefined;
         // CBXR12Q113F07_UPD  STARTS
			//} else {  
		//CBXR12Q113F07_UPD ENDS
				if (cw || ch) {
					/**
					 * Gagan: added code to reduce the width by
					 * 17 pixels to bring the invalid marker
					 * icon adjacent to the field
					 */
					if (cw != undefined) {
						// cw= c.isFormField?cw-25:cw;
						//CHG00TAB Added tabpanel and tab_wrapper to give 100% width for tab panel
						//CBXR12Q312F04_UPD starts
						// CBXR12Q312F04 starts
						//LOGGER.info("c.itemType: ", c.itemType, c)
						if ((c.ownerCt.itemType === "FIELD-SET" && c.formInd === 'Y') || c.formInd === 'Y'
									|| (c.itemType === "WIDGET") || (c.itemType === "TITLE")
									|| (c.itemType === "TABPANEL") || (c.itemType === "PANEL")
									|| (c.itemType === "TAB_WRAPPER") || (c.itemType === 'FIELD-SET'))
						// CBXR12Q312F04 ends
						//CBXR12Q312F04_UPD ends
						{
							cw = parseInt(c.getPositionEl().up('td').dom.style.width);

						} else {

							if (c.itemType === "RADIO_GROUP" || c.itemType === "CHECKBOX_GROUP") {
								cw = parseInt(c.getPositionEl().up('td').dom.style.width) - 19;
								if (c.anchor) {
									cw = (parseInt(c.anchor) / 100) * cw;
								}
							}
							// CBX_FW_Q112F_013 Starts
							/*
							 * else if (c.itemType === "DATE") {
							 * 
							 * cw = c.width = 120; }
							 */
							// CBX_FW_Q112F_013 Ends
							else if (c.itemType === "BUTTON") {
							//Anchor For Button Starts		
								//cw = c.autoWidth = true;
								cw = parseInt(c.getPositionEl().up('td').dom.style.width);

								if (c.anchor) {
									cw = (parseInt(c.anchor) / 100) * cw;
								}
							//Anchor For Button Ends
							} else {
								cw = parseInt(c.getPositionEl().up('td').dom.style.width) - 17;

								if (c.anchor) {
									cw = (parseInt(c.anchor) / 100) * cw;
								}
							}
						}
					}
					boxes.push({
						comp : c,
						width : cw || undefined,
						height : ch || undefined
					});
				}
			}
		}
		var str = "";
		for (i = 0, len = boxes.length; i < len; i++) {
			c = boxes[i];
			c.comp.setSize(c.width, c.height);
			str += (c.comp.formId + ", " + c.comp.plainLabel + ", " + c.comp.itemId + ", " + c.comp.itemType + ", "
						+ Ext.encode(c.comp.getSize()) + "\n");
		}
		if (str != "") {// alert(str);

		}

	},

	parseAnchor : function (a, start, cstart){
		if (a && a != "none") {
			var last;
			if (/^(r|right|b|bottom)$/i.test(a)) {
				var diff = cstart - start;
				return function (v){
					if (v !== last) {
						last = v;
						return v - diff;
					}
				};
			} else if (a.indexOf("%") != -1) {
				var ratio = parseFloat(a.replace("%", "")) * .01;
				return function (v){
					if (v !== last) {
						last = v;
						return Math.floor(v * ratio);
					}
				};
			} else {
				a = parseInt(a, 10);
				if (!isNaN(a)) {
					return function (v){
						if (v !== last) {
							last = v;
							return v + a;
						}
					};
				}
			}
		}
		return false;
	},
	adjustWidthAnchor : function (value, comp){
		return value - (comp.isFormField ? (comp.hideLabel ? 0 : this.labelAdjust) : 0);
	},
	adjustHeightAnchor : function (value, comp){
		return value;
	},
	// private
	isValidParent : function (c, target){
		return c.getPositionEl().up('table', 6).dom.parentNode === (target.dom || target);
	},
	getLabelStyle : Ext.layout.FormLayout.prototype.getLabelStyle,
	labelSeparator : Ext.layout.FormLayout.prototype.labelSeparator,
	trackLabels : Ext.layout.FormLayout.prototype.trackLabels,
	onFieldShow : Ext.layout.FormLayout.prototype.onFieldShow,
	onFieldHide : Ext.layout.FormLayout.prototype.onFieldHide
});
Ext.Container.LAYOUTS['tableform'] = Ext.ux.layout.TableFormLayout;
