package com.intellectdesign.canvas.formexport.framework;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.properties.MessageManager;

public class FormExportData{
	
	/** screen view configuration **/
	Map screenFormData = new HashMap();

	/** form definitions **/
	Map formMetaData = new HashMap();
	
	UserValue userInfo = null;
	
	List widgetList = null;

	/**
	 * To set the screen view configuration
	 * 
	 * @param Map
	 *            formData
	 */
	public void setScreenFormData(Map formData) {

		this.screenFormData.putAll(formData);

	}

	/**
	 * To set the form definitions
	 * 
	 * @param Map
	 *            formDefns
	 */
	public void setFormMetaData(Map formDefns) {

		this.formMetaData.putAll(formDefns);

	}

	/**
	 * To get the screen view configuration
	 * 
	 * @return Map formData
	 */
	public Map getScreenFormData() {

		return (Map) screenFormData.get("SVC");
	}

	/**
	 * To get the form definitions
	 * 
	 * @return Map formDefns
	 */

	public Map getFormMetaData() {

		return formMetaData;
	}
	
	public String getExportHeader(){

		return (String) screenFormData.get("windowTitle");
	}

	/**
	 * @return the userInfo
	 */
	public UserValue getUserInfo() {
		return userInfo;
	}

	/**
	 * @param userInfo the userInfo to set
	 */
	public void setUserInfo(UserValue userInfo) {
		this.userInfo = userInfo;
	}
	
	
	public void setWidgetList(List widgetList){
		
		this.widgetList = widgetList;
	}
	
	
	public List getWidgetList(){
		
		return widgetList;
	}
	
	/**
	 * This is used to combine the details of formdefinition of the item and the
	 * screen view configuration for the particular item.
	 * 
	 * @param itemId
	 * @return itemConfig
	 */
	public Map getItemData(String itemId) {

		Map metaItemInfo = (Map) getFormMetaData().get(itemId);

		Map screenItemInfo = (Map) getScreenFormData().get(itemId);
		
		if(metaItemInfo == null && screenItemInfo == null){
			return null;
		}
		
		metaItemInfo.putAll(screenItemInfo);
		
		updateLabelKey(metaItemInfo);
		
		updateWidgetInfo(metaItemInfo);

		return metaItemInfo;

	}
	
	private void updateWidgetInfo(Map metaItemInfo ){
		
		if ("cbx-widgetpanel".equals(metaItemInfo.get("itemType"))){
			
			for(int widgetIndex=0,len = widgetList.size();widgetIndex<len; widgetIndex++){
		         
				if(metaItemInfo.get("screenViewData").equals(((Map)widgetList.get(widgetIndex)).get("widgetID"))){
						
					metaItemInfo.put("WIDGET_DATA", ((Map)widgetList.get(widgetIndex)));

					break;
					
				}
				
		      }
		}
		
		
		
	}
	
		
	private void updateLabelKey(Map metaItemInfo ){
		
		String fieldLabel ="";
		if ("cbx-lazzyformpanel".equals(metaItemInfo.get("itemType"))){
		
			fieldLabel =(String) metaItemInfo.get("FORM_TITLE");
		}
		else if (!(metaItemInfo.get("PLAIN_LBL")).equals(null) && !("").equals(metaItemInfo.get("PLAIN_LBL"))) {
				fieldLabel = (String)metaItemInfo.get("PLAIN_LBL");
		}  else {
				fieldLabel = MessageManager.getMessage((String)metaItemInfo.get("bundleKey"),"LBL_" + metaItemInfo.get("DISPLAY_NM_KEY")+"_PRINT",
						userInfo.getLangId());
				if(fieldLabel.startsWith("?") & fieldLabel.endsWith("?")){
					fieldLabel = MessageManager.getMessage((String)metaItemInfo.get("bundleKey"),"LBL_" + metaItemInfo.get("DISPLAY_NM_KEY"),
											userInfo.getLangId());
				}
		}
		metaItemInfo.put("FIELD_LABEL", fieldLabel);
		
	}

		

}
