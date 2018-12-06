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
 * */
package com.intellectdesign.canvas.formdefinition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formdefinition.addinfo.AdditionalDataCodeValue;
import com.intellectdesign.canvas.formdefinition.addinfo.IAdditionalDataSupport;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.ChannelUtils;

/**
 * This class is responsible for getting form configuration data from Database and render the form 
 * 
 * @version 1.0
 */
public class FormManager
{
	/**
	 * An instance of Logger
	 */
	private static final Logger LOGGER = Logger.getLogger(FormManager.class);

	/**
	 * This method is the form meta data aggtregator, intended to collect meta data for the passed formId and all it
	 * children form to any level of hierarchy and return in a linear List object.
	 * 
	 * @param formId - String value of Form Id for which the meta data is needed to be retrieved.
	 * @param UserValue - UserValue object containing the logged in user detail
	 * @param includeAdditionalData - Boolean value to mark true if addional data also needs to be retieved with meta data.
	 * @return populatedFormDefs - Linear list containing the Form Definition meta data 
	 * @throws FormDefinitionException
	 */
	public List getFormDefinition(String formId, HashMap params, UserValue userValue, boolean includeAdditionalData)
			throws FormDefinitionException
	{
		LOGGER.ctinfo("CTFDF00062");
		List<FormDefinition> formDefs = null;
		String device = (String) params.get("deviceType");
		List populatedFormDefs = null;
		CacheManager cacheManager = CacheManager.getFWInstance();
		List formsMetaList = cacheManager.getDataFromCache(null, FormDefinitionConstants.CACHE_KEY_FORM_META_CACHE);
		LOGGER.ctdebug("CTFDF00063");

		if (formsMetaList != null)
		{
			formDefs = new ArrayList<FormDefinition>();
			HashMap<String, FormDefinition> formDefMap = (HashMap) formsMetaList.get(0);
			if (formDefMap != null)
			{
				/**
				 * Checks if the metdata data of the requested formId is already cached, If not, fetch it from the
				 * database.
				 */

				FormDefinition formDefn = formDefMap.get(formId);
				formDefs.add(formDefn);
				if (formDefn != null && formDefn.getChildren() != null)
				{
					for (int i = 0; i < formDefn.getChildren().size(); i++)
					{
						if (ChannelUtils.getDeviceFilter(formDefn.getChannelId(), device))
						{
							formDefs.add(formDefMap.get(formDefn.getChildren().get(i)));
						}

					}
				}
			}

		} else
		{
			throw new FormDefinitionException(FormDefinitionConstants.CACHE_KEY_FORM_META_CACHE + " cache is Empty");
		}

		LOGGER.ctdebug("CTFDF00064");
		if (includeAdditionalData)
		{
			populatedFormDefs = populateAdditionalData(formDefs, params, userValue);
		}

		LOGGER.ctinfo("CTFDF00065");
		return populatedFormDefs;
	}

	/**
	 * This method retuns the list of FormDefinition objects with their additional data populated. The methods is expected to
	 * accumulate the addional data info for all the item defs passed as a parameter to it.
	 * 
	 * @param formDefs - List object containing the Form Definition object
	 * @param params - Hashmap of the cached client side data 
	 * @param userValue - UserValue object containing the detail of the logged on User
	 * @return populatedFormDefs - List object containing the additional data info for all the items
	 * 
	 * @throws FormDefinitionException
	 */
	public List populateAdditionalData(List<FormDefinition> formDefs, HashMap params, UserValue userValue)
			throws FormDefinitionException
	{
		LOGGER.ctinfo("CTFDF00066");
		List<BaseFormDefinition> populatedFormDefs = new ArrayList<BaseFormDefinition>();
		FormDefinition formDef = null;
		String device = (String) params.get("deviceType");
		for (BaseFormDefinition def : formDefs)
		{
			if (def != null)
			{
				// Requesting additional data population only if the form's children components need them.
				if (((FormDefinition) def).getAddDataDrivenItems() == null)
				{
					formDef = getChannelBasedItems((FormDefinition) def, params);
					if (ChannelUtils.getDeviceFilter(formDef.getChannelId(), device))
						populatedFormDefs.add(formDef);
				} else
				{
					formDef = getChannelBasedItems((FormDefinition) def, params);
					if (ChannelUtils.getDeviceFilter(formDef.getChannelId(), device))
						populatedFormDefs.add(populateAdditionalData(formDef.getItemId(), params, userValue));
				}
			}
		}
		LOGGER.ctinfo("CTFDF00066");

		return populatedFormDefs;
	}

	/**
	 * This method is intended to return the FormDefinition object populated with the additional inforamtion for all the fields that
	 * needs it. The method expects the formId for which all its immidiate children that needs data will taken in
	 * consideration and their associated data will be loaded in the Object's additionalDataMap. The method will retieve
	 * the FormDefinition object from the application cache and add the additional Data in its clone so that the cache
	 * data doesn't get disturbed.
	 * 
	 * The data retrieval will be done by the instance of any class that supports IAdditionalDataSupport interface. By
	 * default this is : DefaultAdditionalDataSupport. In case the app layer wants to override the default data support
	 * process, the formId passed should have its associated dataSourceClass property set in the FORM_DEFINITION table.
	 * 
	 * @param formId - String value of the form id for which AdditionalData needs to be fetched
	 * @param params - Hashmap of cached client input params data 
	 * @param userValue - UserValue object containing the logged user
	 * @return populatedAdditionalData - FormDefinition object populated with the additional inforamtion for all the fields 
	 *
	 * @throws FormDefinitionException
	 */
	public FormDefinition populateAdditionalData(String formId, HashMap params, UserValue userValue)
			throws FormDefinitionException
	{
		LOGGER.ctinfo("CTFDF00066");
		CacheManager cacheManager = CacheManager.getFWInstance();
		FormDefinition formDefn = null;
		List formsMetaList = cacheManager.getDataFromCache(null, FormDefinitionConstants.CACHE_KEY_FORM_META_CACHE);
		if (formsMetaList != null)
		{
			HashMap<String, BaseFormDefinition> formDefMap = (HashMap) formsMetaList.get(0);
			if (formDefMap != null)
			{
				formDefn = (FormDefinition) formDefMap.get(formId);
				formDefn = getChannelBasedItems(formDefn, params);
				LOGGER.ctdebug("CTFDF0067", formDefn);
				LOGGER.ctinfo("CTFDF00103");
				return populateAdditionalData(formDefn, params, userValue);
			}
		} else
		{
			throw new FormDefinitionException(FormDefinitionConstants.CACHE_KEY_FORM_META_CACHE + " cache is Empty");
		}
		LOGGER.ctinfo("CTFDF00103");
		return null;
	}

	/**
	 * This method provides the channel based form items.
	 * 
	 * @param formDefn - FormDefinition object that contains device based items
	 * @param params - Hashmap of cached client input params data
	 * @return formDefnition - FormDefinition object containing
	 */
	public FormDefinition getChannelBasedItems(FormDefinition formDefn,HashMap params){
		String device = (String) params.get("deviceType");
		//CT_MOBILITY_CHGv1.1 -- Ends
		FormDefinition formDefnition=null;
		List<String> check=new ArrayList<String>();
		
		try{
		 formDefnition=(FormDefinition) formDefn.clone();
				
		 if(ChannelUtils.getDeviceFilter(formDefnition.getChannelId(), device )/* || formDefnition.getChannelId().equals("A")*/){
		 check.add(formDefnition.getItemId());}
		 
		 
		 
		 
		List<BaseFormDefinition> childItems=formDefnition.getChildItems();
	    java.util.Iterator<BaseFormDefinition> channelIt = childItems.iterator();
	    List<BaseFormDefinition> channeltems=new ArrayList<BaseFormDefinition>();
	    List<BaseFormDefinition> channeltems2;
	    FormItemDefinition fid2=null;
		  while(channelIt.hasNext()){
            	 channeltems2=new ArrayList<BaseFormDefinition>();
			FormItemDefinition fid=(FormItemDefinition)channelIt.next();
			if(ChannelUtils.getDeviceFilter(formDefnition.getChannelId(), device )){
			if(!(fid.getItemType().equals(FormDefinitionConstants.ITEM_TYPE_FORM))){
			
				if(fid.getChildItems()==null || fid.getChildItems().isEmpty() && ChannelUtils.getDeviceFilter(fid.getChannelId(), device )){
				
					channeltems.add(fid);
			}else if(fid.getChildItems()!=null && ChannelUtils.getDeviceFilter(fid.getChannelId(), device )){
				channeltems.add(fid);
				List<BaseFormDefinition> childItems2=fid.getChildItems();
				 java.util.Iterator<BaseFormDefinition> channelIt2 = childItems2.iterator();
				 while(channelIt2.hasNext()){
					 
					 fid2=(FormItemDefinition)channelIt2.next();
					 formChannelBasedSubItems(fid2,device,channeltems2);
					
				 }
				
				 fid.setChildItems(channeltems2);
				}
		  }else {       
			  
			  if(ChannelUtils.getDeviceFilter(fid.getChannelId(), device ) && check.contains(fid.getParentId())){				  
				  check.add(fid.getItemId());
				  
				  if(fid.getChildItems()==null  && !(fid.getChildItems().isEmpty()) && ChannelUtils.getDeviceFilter(fid.getChannelId(), device )){
						
						channeltems.add(fid);
				}if(fid.getChildItems()!=null && !(fid.getChildItems().isEmpty()) && ChannelUtils.getDeviceFilter(fid.getChannelId(), device )){
					channeltems.add(fid);
					List<BaseFormDefinition> childItems2=fid.getChildItems();
					 java.util.Iterator<BaseFormDefinition> channelIt2 = childItems2.iterator();
					 while(channelIt2.hasNext()){
						 
						 fid2=(FormItemDefinition)channelIt2.next();
						 if(ChannelUtils.getDeviceFilter(fid2.getChannelId(), device )){
							 channeltems2.add(fid2);
							
						 }
						
					 }
					
					 fid.setChildItems(channeltems2);
					}else if(fid.getFormMetaData()!=null && ChannelUtils.getDeviceFilter(fid.getChannelId(), device )) {
						formChannelBasedSubItems(fid,device,channeltems);
						FormDefinition formmetadatadef=(FormDefinition)fid.getFormMetaData(); 
						formmetadatadef.setChildItems(fid.getChildItems());
						
					}
				  
			  }
		  }
			
			}
		}				
		  formDefnition.setChildItems(channeltems);
		}catch(CloneNotSupportedException ex){
			LOGGER.cterror("CTFDF00068", ex);
			
			
		} 
		 return formDefnition;
	}

	/**
	 * This method is for getting the channel based form subitems.
	 * 
	 * @param fid - FormItemDefinition object containing the all the items 
	 * @param device - Str
	 * @param channeltems
	 */
	public void formChannelBasedSubItems(FormItemDefinition fid, String device, List<BaseFormDefinition> channeltems)
	{
		List<BaseFormDefinition> childItems;
		if (ChannelUtils.getDeviceFilter(fid.getChannelId(), device))
		{
			channeltems.add(fid);
		}
		FormDefinition formmetadatadef = (FormDefinition) fid.getFormMetaData();
		if (formmetadatadef != null)
		{
			childItems = formmetadatadef.getChildItems();
		} else
		{
			childItems = fid.getChildItems();
		}
		if (childItems != null && !(childItems.isEmpty()) && ChannelUtils.getDeviceFilter(fid.getChannelId(), device))
		{
			FormItemDefinition fidn = null;
			java.util.Iterator<BaseFormDefinition> channelIt = childItems.iterator();
			List<BaseFormDefinition> subItems = new ArrayList<BaseFormDefinition>();
			while (channelIt.hasNext())
			{
				fidn = (FormItemDefinition) channelIt.next();
				formChannelBasedSubItems(fidn, device, subItems);
			}
			fid.setChildItems(subItems);
		}
	}

	/**
	 * Intended to return the FormDefinition object populated with the additional inforamtion for all the fields that
	 * needs it. The method expects the formId for which all its immidiate children that needs data will taken in
	 * consideration and their associated data will be loaded in the Object's additionalDataMap. The method will retieve
	 * the FormDefinition object from the application cache and add the additional Data in its clone so that the cache
	 * data doesn't get disturbed.
	 * 
	 * The data retrieval will be done by the instance of any class that supports IAdditionalDataSupport interface. By
	 * default this is : DefaultAdditionalDataSupport. In case the app layer wants to override the default data support
	 * process, the formId passed should have its associated dataSourceClass property set in the FORM_DEFINITION table.
	 * 
	 * @param formDefn - FormDefinition object for which AdditionalData needs to be fetched
	 * @param params - Hashmap of cached client input params data 
	 * @param userValue - UserValue object containing the logged in user details
	 * @return populatedAdditonalData - FormDefinition object containing additional data for the fields that needs it.
	 * @throws FormDefinitionException
	 */
	public FormDefinition populateAdditionalData(FormDefinition formDefn, HashMap params, UserValue userValue)
			throws FormDefinitionException
	{
		LOGGER.ctinfo("CTFDF00066");
		IAdditionalDataSupport dataSupport = null;
		if (formDefn != null)
		{
			try
			{
				if (formDefn.getAddDataDrivenItems() == null && formDefn.getAddDataDrivenItems().size() == 0)
				{
					LOGGER.ctdebug("CTFDF00069", formDefn.getFormId());
				} else
				{ // Clone on when additional data needs to be populated
					formDefn = (FormDefinition) formDefn.clone();
					// data support class instance
					dataSupport = getAdditionalDataSupport(formDefn);
					LOGGER.ctdebug("CTFDF00070");
					Map<String, List<AdditionalDataCodeValue>> additionalData = new HashMap<String, List<AdditionalDataCodeValue>>();
					FormItemDefinition itemDefn = null;
					// populating data map for all the form items that needs additional data.
					for (BaseFormDefinition baseItemDefn : formDefn.getAddDataDrivenItems())
					{
						itemDefn = (FormItemDefinition) baseItemDefn;
						additionalData.put(itemDefn.getItemId(),
								dataSupport.getAdditionalDataFor(itemDefn, userValue, params));
					}
					formDefn.setAdditionalData(additionalData);

				}
			} catch (CloneNotSupportedException ex)
			{
				LOGGER.cterror("CTFDF00068", ex);
				throw new FormDefinitionException(ex);
			}
		}
		LOGGER.ctinfo("CTFDF00103");
		return formDefn;
	}

	/**
	 * This method is intended to return additional data to be displayed for the items 
	 * 
	 * @param formId - String value of the Form Id containing the additional data-support class
	 * @param itemIds - Lenier list of Item Ids that needs the additional data
	 * @param params - Hashmap of cached client input params data
	 * @param userValue - UserValue object containing the logged in User details
	 * @return itemDataMap - Hashmap of the additional data for the items
	 * @throws FormDefinitionException
	 */
	public HashMap getAdditionalDataForItem(String formId, List<String> itemIds, HashMap params, UserValue userValue)
			throws FormDefinitionException
	{
		LOGGER.ctinfo("CTFDF00071");
		CacheManager cacheManager = CacheManager.getFWInstance();
		FormDefinition formDefn = null;
		List formsMetaList = cacheManager.getDataFromCache(null, FormDefinitionConstants.CACHE_KEY_FORM_META_CACHE);
		HashMap itemDataMap = new HashMap();
		if (formsMetaList != null)
		{
			HashMap<String, BaseFormDefinition> formDefMap = (HashMap) formsMetaList.get(0);
			if (formDefMap != null)
			{
				formDefn = (FormDefinition) formDefMap.get(formId);
				LOGGER.ctdebug("CTFDF00067", formDefn);
				if (formDefn != null)
				{
					IAdditionalDataSupport dataSupport = getAdditionalDataSupport(formDefn);
					FormItemDefinition itemDefn = null;
					for (String itemId : itemIds)
					{
						for (BaseFormDefinition item : formDefn.getAddDataDrivenItems())
						{
							if (item.getItemId().equals(itemId))
							{
								itemDefn = (FormItemDefinition) item;
								break;
							}
						}
						if (null == itemDefn)
						{
							LOGGER.cterror("CTFDF00072", itemId);
							throw new FormDefinitionException(itemId + " is not mapped under " + formId
									+ " or the itemId doesnt need additional data");
						} else
						{
							itemDataMap.put(itemDefn.getItemId(),
									dataSupport.getAdditionalDataFor(itemDefn, userValue, params));
						}
					}
				}
			}
		} else
		{
			throw new FormDefinitionException(FormDefinitionConstants.CACHE_KEY_FORM_META_CACHE + " cache is Empty");
		}
		LOGGER.ctinfo("CTFDF00073");

		return itemDataMap;
	}

	/**
	 * This method is intended to return an instance of the dataSupport class 
	 * that should be associated with the passed FormDefinition
	 * 
	 * @param formDefn - FormDefinition object that contains the data support class
	 * @return IAdditionalDataSupport - IAdditionalDataSupport object that contains implemented data support class
	 * 
	 * @throws FormDefinitionException
	 */
	private IAdditionalDataSupport getAdditionalDataSupport(FormDefinition formDefn) throws FormDefinitionException
	{
		String supportClassName = "com.intellectdesign.canvas.formdefinition.addinfo.DefaultAdditionalDataSupport";
		if (formDefn.getDatasourceClass() != null
				&& !FormDefinitionConstants.EMPTY_STRING.equals(formDefn.getDatasourceClass()))
		{
			supportClassName = formDefn.getDatasourceClass();
		}
		try
		{
			IAdditionalDataSupport support = (IAdditionalDataSupport) Class.forName(supportClassName).newInstance();
			return support;
		} catch (Exception ex)
		{
			// What ever be the type of exception, basically it indicates that the object cannot be created. So
			// Log the details and thrown an exception
			LOGGER.cterror("CTFDF00074", supportClassName);
			LOGGER.cterror("CTFDF00075", supportClassName, ex);
			throw new FormDefinitionException(ex);
		}
	}
}
