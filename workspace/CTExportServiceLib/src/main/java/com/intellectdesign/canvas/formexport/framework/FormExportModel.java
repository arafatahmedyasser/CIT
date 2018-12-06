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

package com.intellectdesign.canvas.formexport.framework;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.properties.MessageManager;

/**
 * The Class is incharge of storing the current forms form definition and screen view. When the item needs the
 * configuration for printing , it combines the both giving priority over the screenview and returns it.
 * 
 * 
 * @version 1.0
 */
public class FormExportModel
{

	/** screen view configuration **/
	Map screenFormData = new HashMap();

	/** form definitions **/
	Map formMetaData = new HashMap();

	UserValue userInfo = null;

	List widgetList = null;

	Map widgetMapUrl = new HashMap();

	List exportUniqueIdList = new ArrayList();
	boolean attachScreenPrinting=false; 

	String exportFormat ;
	/**
	 * @return the exportFormat
	 */
	public String getExportFormat() {
		return exportFormat;
	}

	/**
	 * @param exportFormat the exportFormat to set
	 */
	public void setExportFormat(String exportFormat) {
		this.exportFormat = exportFormat;
	}
	/**
	 * To set the screen view configuration
	 * 
	 * @param Map formData
	 */
	public void setScreenFormData(Map formData)
	{

		this.screenFormData.putAll(formData);

	}

	/**
	 * To set the form definitions
	 * 
	 * @param Map formDefns
	 */
	public void setFormMetaData(Map formDefns)
	{

		this.formMetaData.putAll(formDefns);

	}

	/**
	 * This method is used to get Export Header.
	 * 
	 * @param language
	 * @return String
	 */
	public String getExportHeader(String language)
	{
		String reportTitle = null;

		String formId = (String) screenFormData.get("parentFormId");
		Map svcObject = (Map) screenFormData.get("SVC");
		Map parentFormMap = (Map) svcObject.get(formId);
		String bundleKey = (String) parentFormMap.get("bundleKey");

		reportTitle = (String) screenFormData.get("windowTitle");
		if (reportTitle == null || "".equals(reportTitle))
		{
			reportTitle = MessageManager.getMessage(bundleKey, "LBL_" + formId, language);
		}
		return reportTitle;
	}

	/**
	 * To get the screen view configuration
	 * 
	 * @return Map formData
	 */
	public Map getScreenFormData()
	{

		return (Map) screenFormData.get("SVC");
	}

	/**
	 * To get the form definitions
	 * 
	 * @return Map formMetaData
	 */

	public Map getFormMetaData()
	{

		return formMetaData;
	}

	/**
	 * To get the ExportHeader
	 * 
	 * @return Returns the ExportHeader
	 */

	public String getExportHeader()
	{

		return (String) screenFormData.get("windowTitle");
	}

	/**
	 * To get the UserInfo
	 * 
	 * @return the userInfo
	 */
	public UserValue getUserInfo()
	{
		return userInfo;
	}

	/**
	 * To set the UserInfo
	 * 
	 * @param userInfo the userInfo to set
	 */
	public void setUserInfo(UserValue userInfo)
	{
		this.userInfo = userInfo;
	}

	/**
	 * To set the WidgetList
	 * 
	 * @param widgetList the widgetList to set
	 */

	public void setWidgetList(List widgetList)
	{

		this.widgetList = widgetList;
	}

	/**
	 * To get the WidgetList
	 * 
	 * @return the WidgetList
	 */

	public List getWidgetList()
	{

		return widgetList;
	}

	/**
	 * To get the WidgetMapUrl
	 * 
	 * @return the widgetMapUrl
	 */
	public Map getWidgetMapUrl()
	{
		return widgetMapUrl;
	}
	
	/**
	 * @return the attachScreenPrinting
	 */
	public boolean isAttachScreenPrinting() {
		return attachScreenPrinting;
	}
	/**
	 * @param attachScreenPrinting the attachScreenPrinting to set
	 */
	public void setAttachScreenPrinting(boolean attachScreenPrinting) {
		this.attachScreenPrinting = attachScreenPrinting;
	}

	/**
	 * To set the WidgetMapUrl
	 * 
	 * @param widgetMapUrl the widgetMapUrl to set
	 */
	public void setWidgetMapUrl(Map widgetMapUrl)
	{
		this.widgetMapUrl = widgetMapUrl;
	}

	/**
	 * This is used to combine the details of formdefinition of the item and the screen view configuration for the
	 * particular item.
	 * 
	 * @param itemId
	 * @return Map metaItemInfo
	 */
	public Map getItemData(String itemId)
	{

		Map metaItemInfo = (Map) getFormMetaData().get(itemId);

		Map screenItemInfo = (Map) getScreenFormData().get(itemId);

		if (metaItemInfo == null && screenItemInfo == null)
		{
			return null;
		}
		if (metaItemInfo != null)
		{
			metaItemInfo.putAll(screenItemInfo);
			updateLabelKey(metaItemInfo);
			updateWidgetInfo(metaItemInfo);
		}

		return metaItemInfo;
	}

	/**
	 * This is used to update the details of widget in the screen view configuration for the particular item.
	 * 
	 * @param Map metaItemInfo
	 */

	private void updateWidgetInfo(Map metaItemInfo)
	{
		if ("cbx-widgetpanel".equals(metaItemInfo.get("itemType")))
		{
			for (int widgetIndex = 0, len = widgetList.size(); widgetIndex < len; widgetIndex++)
			{
				if (metaItemInfo.get("screenViewData").equals(((Map) widgetList.get(widgetIndex)).get("widgetID")))
				{
					Map widgetData = (Map) widgetList.get(widgetIndex);
					String exportUniqueId = (String) widgetData.get("exportFileName");
					exportUniqueIdList.add(exportUniqueId);
					widgetData.put("exportFileName", widgetMapUrl.get(exportUniqueId));
					metaItemInfo.put("WIDGET_DATA", widgetData);
					break;
				}
			}
		}
	}

	/**
	 * This is used to update the labels of the items in the screen view
	 * configuration for the particular item.
	 * 
	 * The Preference of the label for the form export
	 * 
	 * 1) Plain Label
	 * 2) LBL_(DISP_NAME_KEY)_PRINT 
	 * 3) LBL_DISPLAY_NM_KEY
	 * 
	 * @param Map
	 *            metaItemInfo
	 */

	private void updateLabelKey(Map metaItemInfo) {

		String fieldLabel = "";
		if ("cbx-lazzyformpanel".equals(metaItemInfo.get("itemType"))) {

			fieldLabel = "";
		} else if (!(metaItemInfo.get("PLAIN_LBL")).equals(null)
				&& !("").equals(metaItemInfo.get("PLAIN_LBL"))) {
			fieldLabel = (String) metaItemInfo.get("PLAIN_LBL");
		} else {
			fieldLabel = MessageManager.getMessage(
					(String) metaItemInfo.get("bundleKey"), "LBL_"
							+ metaItemInfo.get("DISPLAY_NM_KEY") + "_PRINT",
					userInfo.getLangId());
			if (fieldLabel.startsWith("?") & fieldLabel.endsWith("?")) {
				
				if("".equals(metaItemInfo.get("DISPLAY_NM_KEY")) || metaItemInfo.get("DISPLAY_NM_KEY").equals(null)){
					fieldLabel = "";
				}
				else{
					fieldLabel = MessageManager.getMessage(
							(String) metaItemInfo.get("bundleKey"), "LBL_"
									+ metaItemInfo.get("DISPLAY_NM_KEY"),
							userInfo.getLangId());
				}
				
			}
		}
		metaItemInfo.put("FIELD_LABEL", fieldLabel);
	}

	/**
	 * To get the ExportUniqueIdList
	 * 
	 * @return the exportUniqueIdList
	 */
	public List getExportUniqueIdList()
	{
		return exportUniqueIdList;
	}
}
