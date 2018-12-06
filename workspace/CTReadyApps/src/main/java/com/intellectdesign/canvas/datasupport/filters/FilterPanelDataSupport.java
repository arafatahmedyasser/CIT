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
package com.intellectdesign.canvas.datasupport.filters;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormItemDefinition;
import com.intellectdesign.canvas.formdefinition.addinfo.AdditionalDataCodeValue;
import com.intellectdesign.canvas.formdefinition.addinfo.IAdditionalDataSupport;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.value.IUserValue;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewManager;
/**
 * This class is  used to FilterPanelDataSupport and AdditionalDataSupport
 * 
 * @version 1.0
 */
public class FilterPanelDataSupport implements IAdditionalDataSupport
{

	/**
	 * Method used for getting the data from database and displayed in ComboBox
	 * 
	 * @param itemDefn,userValue,inputParams
	 * @return ArrayList
	 * @throws FormDefinitionException
	 */
	public ArrayList<AdditionalDataCodeValue> getAdditionalDataFor(FormItemDefinition itemDefn, IUserValue userValue,
			HashMap inputParams) throws FormDefinitionException
	{
		ArrayList<AdditionalDataCodeValue> dataList = null;
		List filters = null;
		try
		{
			String langId = userValue.getLangId();
			if (langId == null)
			{
				langId = "en_US";
			}
			String viewId = (String) inputParams.get("VIEW_ID");

			String widgetId = (String) inputParams.get("WIDGET_ID");

			ViewManager manager = new ViewManager();

			ViewDefinition definition = manager.getViewDefinition(widgetId, viewId, inputParams);

			dataList = new ArrayList<AdditionalDataCodeValue>();
			HashMap filterMap = null;

			if ("FILTER_COMBO".equals(itemDefn.getItemId()))
			{
				filters = definition.getPossibleDateFilters();
				if (filters != null)
				{
					for (int i = 0; i < filters.size(); i++)
					{
						filterMap = (HashMap) filters.get(i);
						dataList.add(new AdditionalDataCodeValue(filterMap.get("FROM_DATE").toString() + "|"
								+ filterMap.get("TO_DATE").toString() + "|" + i, MessageManager.getMessage(
								itemDefn.getBundleKey(), (String) filterMap.get("DISPLAY_NM_KEY"), langId)));
					}
				}
			}
		} catch (Exception e)
		{
			LOGGER.cterror("CTRDY00001", e);
		}
		return dataList;
	}

	private static final Logger LOGGER = Logger.getLogger(FilterPanelDataSupport.class);
}
