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
cbx.namespace("iportal.menuitems");
/**
 * @class iportal.menuitems.metadata Used to hold all the menu tool items available for loged in user, This class is a
 *        singleton and cannot be created directly. The class will provide helper methods for the developers aswell as
 *        from framework components to get references of specific meu items and also provide complete menu of a specific
 *        workspace.
 */
iportal.menuitems.metadata = function ()
{
	/**
	 * 
	 */
	var menuStructJSON = canvas.metadata.menu.getMenuMetaData();
	/**
	 * 
	 */
	var IWMC = iportal.workspace.menu.constant;

	return Ext.apply(new Ext.util.Observable, {
		/**
		 * 
		 */
		getItems : function ()
		{
			var menuDecodedJSON = eval(menuStructJSON);
			return menuDecodedJSON;
		},

		/**
		 * 
		 */
		getMenuToolById : function (itemId)
		{
			var menuItem = "";
			if (iportal.workspace.metadata.getCurrentWorkspace())
			{
				menuItem = (iportal.workspace.metadata.getCurrentWorkspace()).find("itemId", itemId);
			}
			if (menuItem != null && menuItem.length > 0)
			{
				return menuItem[0];
			} else
			{
				return null;
			}
		},

		/**
		 * All the singular menu tool items will be calling this handler when their 'afterrender' event is raised, which
		 * will inturn try to execute the method registered with iportal.workspace.menu.handler instance.
		 */
		buttonLoadHandler : function (btnObj)
		{
			IWMH.executeHandler(btnObj.itemId, IWMC.EVENT_LOAD, {
				srcObj : btnObj,
				wsId : btnObj.wsId,
				productCode : btnObj.productCode,
				subProductCode : btnObj.subProductCode,
				functionCode : btnObj.functionCode,
				containerId : btnObj.containerId
			});
		},
		/**
		 * All the menu tool items will be calling this handler on click event, which will inturn try to execute the
		 * method registered with iportal.workspace.menu.handler instance.
		 */
		eventRasiedTimeStamp : null,

		/**
		 * 
		 */
		menuclickHandler : function (menuObj)
		{
			var dt = new Date();
			if (this.eventRasiedTimeStamp == null)
			{
				this.eventRasiedTimeStamp = dt;
			}

			if (dt == this.eventRasiedTimeStamp || dt >= this.eventRasiedTimeStamp.add(Date.SECOND, MENUCLICKTIMESET))
			{
				this.eventRasiedTimeStamp = dt;
				/**
				 * In the presence of Container ID wired with the Workspace Menus the Container, the default handler to
				 * call the container is executed.
				 */
				if (menuObj.containerId != undefined && menuObj.containerId != null && menuObj.containerId !== "")
				{
					iportal.menuitems.metadata.callFormContainerHandler(menuObj);

				} else
				{
					IWMH.executeHandler(menuObj.itemId, IWMC.EVENT_CLICK, {
						wsId : menuObj.wsId,
						productCode : menuObj.productCode,
						subProductCode : menuObj.subProductCode,
						functionCode : menuObj.functionCode,
						containerId : menuObj.containerId
					});
				}
			}
		},

		/**
		 * This method is a member function of getMenuTools() to used give the flag for continue the align of menus.
		 * 
		 * @params current menu node Number, size of the menus nodes and RTL enable status flag
		 * @return boolean variable that denote the continue status for Right & left Array of menu align
		 */
		hasNextMenu : function (currentValue, length, isRTL)
		{
			var check = true;
			if (isRTL == true)
			{
				check = currentValue > -1; // eg: 5 > -1
			} else
			{
				check = currentValue < length; // eg: 0 < 6
			}
			return check;
		},

		/**
		 * This method is intended to read the Menu metada data received from the cache and accordingly return the
		 * instance of the menu tool objects
		 * 
		 * @params Id of the workspace for which menu items are needed
		 * @return [lArr, cArr, rArr], Array of left aligned menus, Arrays of center aligned menus and another array of
		 *         right aligned menu
		 */
		getMenuTools : function (ws_id)
		{
			var wsObj = null;
			var toolsArr = null;
			var lToolArr = [];
			var rToolArr = [];
			var cToolArr = [];
			var rb = CRB.getBundle(iportal.workspace.metadata.getWorkSpaceById(ws_id)["BUNDLE_KEY"]);
			var menu_items = this.getItems();

			if (cbx.isEmpty(menu_items))
			{
				LOGGER.info("The current workspace doesn't have workspace menus.");
				return [ lToolArr, cToolArr, rToolArr ];
			}

			for (var i = 0; i < menu_items.length; i++)
			{
				if (menu_items[i].item_id == ws_id)
				{
					wsObj = menu_items[i];
					break;
				}
			}
			if (wsObj != null && !Ext.isEmpty(wsObj.child_nodes))
			{
				var bWidth, bLabel, bIcon, displayLabel;
				var i = 0;
				var isRTL = iportal.preferences.isLangDirectionRTL();
				if (isRTL)
				{
					/**
					 * Logic Information: if RTL enabled, the menus position needs to be render from (n-1) to 0 else
					 * (ie) LTR : the menus position needs to be render from 0 to (n-1)
					 */
					i = wsObj.child_nodes.length - 1;
				}

				while (iportal.menuitems.metadata.hasNextMenu(i, wsObj.child_nodes.length, isRTL))
				{
					if (wsObj.child_nodes[i] != null)
					{
						width = 10;
						displayLabel = rb[wsObj.child_nodes[i].display_key_nm] != null
									? rb[wsObj.child_nodes[i].display_key_nm] : wsObj.child_nodes[i].display_key_nm;
						bLabel = wsObj.child_nodes[i].label_ind === 'Y' ? displayLabel : null;
						bIcon = wsObj.child_nodes[i].icon_ind === 'Y' ? wsObj.child_nodes[i].item_id : null;
						/** Calculating the width as per the label and icon */
						if (bLabel != null)
						{
							width += iportal.util.stringnumber.getInstance().getNeededWidthNoEl(bLabel);
						}
						if (bIcon != null)
						{
							width += 15;
						}
						/** blockPosition with be used for determining the left/right position of the tool */
						var blockPosition = wsObj.child_nodes[i].block_position;
						blockPosition = (blockPosition == null || blockPosition === "") ? "LEFT" : blockPosition;
						if (blockPosition === "LEFT")
						{
							toolsArr = lToolArr;
						} else if (blockPosition === "CENTER")
						{
							toolsArr = cToolArr;
						} else
						{
							toolsArr = rToolArr;
						}
						if (wsObj.child_nodes[i].child_nodes == null || Ext.isEmpty(wsObj.child_nodes[i].child_nodes))
						{
							/**
							 * Step 1 : Get the customMenu space's blockPosition from workspace.metadata Step 2 : Check
							 * if it is same as current processing 'blockPosition' Step 2.1 : Then get the
							 * custom_menu_space's components from the CMSHR.executeHandler() and assign it to the
							 * 'toolsArray' object. Step 2.2 : Else continue the next else if block.
							 */
							var customMenu_block = iportal.workspace.metadata.getCustomMenuSpaceValue(ws_id);
							if (customMenu_block != undefined && !Ext.isEmpty(customMenu_block)
										&& customMenu_block != 'null' && blockPosition === customMenu_block)
							{
								toolsArr[toolsArr.length] = CMSHR.executeHandler();
							} else if (wsObj.child_nodes[i].container_flag === 'N')
							{
								/** Creating instance of a singular button that will raise both load and click event */
								toolsArr[toolsArr.length] = new Ext.Button({
									// style:'padding-'+blockPosition+': 20px',
									// padding:'0 20 0 20',
									// margins:'0 20',
									wsId : ws_id,
									itemId : wsObj.child_nodes[i].item_id,
									blockPosition : blockPosition,
									productCode : wsObj.child_nodes[i].od_product_code,
									subProductCode : wsObj.child_nodes[i].od_subprod_code,
									functionCode : wsObj.child_nodes[i].od_function_code,
									tooltip : displayLabel,
									iconCls : bIcon,
									text : bLabel,
									// height:45,
									// width: bWidth,
									// scale:'large',
									cls : 'noborder-icon-text',
									listeners : {
										"afterrender" : iportal.menuitems.metadata.buttonLoadHandler
									},
									handler : iportal.menuitems.metadata.menuclickHandler,
									containerId : wsObj.child_nodes[i].container_id
								});
							}
						} else
						{
							/**
							 * Creating instance dropdown menu button that will use click event for openign the dropdown
							 * menu
							 */

							toolsArr[toolsArr.length] = new Ext.Button({
								wsId : ws_id,
								// style:'padding: 5px',
								// margins: '4 5',
								itemId : wsObj.child_nodes[i].item_id,
								blockPosition : blockPosition,
								tooltip : displayLabel,
								iconCls : bIcon,
								// cls:'noborder-icon-text',
								text : bLabel,
								// height:30,
								// width: bWidth,
								// cls:'iportal-menu-item',
								menu : {},// giving empty to brign the down arrow mark on the button

								handler : function ()
								{
									var menu = iportal.menuitems.metadata.initiateMenuGeneration(menu_items, this.wsId,
												this.itemId, this.el.id);
									var id = this.el.id; 
									IWMH.executeHandler(this.itemId, IWMC.EVENT_DRILL_DOWN_MENU, {
										menu : menu
									//	, id : id
									});
									menu.show(id);
								}
							});
						}
					}
					if (isRTL == true)
					{
						i--; // For RTL
					} else
					{
						i++; // For LTR
					}
				}
			}
			return [ lToolArr, cToolArr, rToolArr ];
		},
		/**
		 * The method is inteded to kick start the dropdown menu generation process, This will take a recursive path,
		 * will traverse through the entire menu hierarchy and return an instance of a menu object that can intrun have
		 * any level of sub menus
		 */
		initiateMenuGeneration : function (menu_items, ws_id, item_id)
		{
			var wsObj = null;
			var menuData = null;

			if (Ext.getCmp(item_id) != null)
			{
				Ext.getCmp(item_id).destroy();
			}

			for (var i = 0; i < menu_items.length; i++)
			{
				if (menu_items[i].item_id == ws_id)
				{
					wsObj = menu_items[i];
					break;
				}
			}
			if (wsObj != null && !Ext.isEmpty(wsObj.child_nodes))
			{

				for (var i = 0; i < wsObj.child_nodes.length; i++)
				{
					if (wsObj.child_nodes[i].item_id == item_id)
					{
						menuData = wsObj.child_nodes[i];
						break;
					}
				}
			}

			if (menuData != null)
			{
				var menuObj = this.generateMenu(menuData, ws_id);

				return menuObj;

			}

		},

		/**
		 * 
		 */
		generateMenu : function (menuData, ws_id, menuObj)
		{

			var rb = CRB.getBundle(iportal.workspace.metadata.getWorkSpaceById(ws_id)["BUNDLE_KEY"]), displayLabel;
			if (menuObj == null)
			{
				menuObj = new Ext.menu.Menu({
					id : menuData.item_id
				});
			}
			if (menuData != null && menuData.child_nodes != null)
			{
				for (var i = 0; i < menuData.child_nodes.length; i++)
				{
					displayLabel = rb[menuData.child_nodes[i].display_key_nm] != null
								? rb[menuData.child_nodes[i].display_key_nm] : menuData.child_nodes[i].display_key_nm;

					if (menuData.child_nodes[i] != null && menuData.child_nodes[i].child_nodes != null
								&& !Ext.isEmpty(menuData.child_nodes[i].child_nodes))
					{
						menuObj.add({
							text : displayLabel,
							menu : this.generateMenu(menuData.child_nodes[i], ws_id)
						})
					} else
					{
						if (menuData.child_nodes[i].container_flag === 'N')
						{
							/**
							 * Adding menu item that will raise the click event to be captured and targeted to the
							 * iportal.workspace.menu.handler
							 */
							menuObj.add({
								text : displayLabel,
								wsId : ws_id,
								itemId : menuData.child_nodes[i].item_id,
								productCode : menuData.child_nodes[i].od_product_code,
								subProductCode : menuData.child_nodes[i].od_subprod_code,
								functionCode : menuData.child_nodes[i].od_function_code,
								handler : iportal.menuitems.metadata.menuclickHandler,
								containerId : menuData.child_nodes[i].container_id
							});
						}
					}
				}
			}
			return menuObj;
		},

		/**
		 * This function calls the container whose ID is wired to the workspace menu clicked.
		 */
		callFormContainerHandler : function (menuObj)
		{

			CBXFORMCONTAINER.getWindow(menuObj.containerId);
		}
	})
}();
