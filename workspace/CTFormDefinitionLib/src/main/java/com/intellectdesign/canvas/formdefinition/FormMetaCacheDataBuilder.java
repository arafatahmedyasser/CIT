/**

 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class collects the Form Meta data and makes it available in the 
 * in cache.
 * 
 * @version 1.0
 */
public class FormMetaCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(FormMetaCacheDataBuilder.class);

	private List<String> addDataDrivenFields = null;

	/**
	 * This method initializes the cache.
	 * 
	 * @param hashMap - Hashmap of cached client data
	 * @return formList - List object containing all the forms and their form items
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected List initializeCache(HashMap hashMap)
	{
		List<Map<String, BaseFormDefinition>> formList = new ArrayList<Map<String, BaseFormDefinition>>(1);

		Map<String, BaseFormDefinition> formDef = getFormDefinition();
		populateAdditionalDataDrivenFields();
		updateFormMetaData(formDef);
		formList.add(formDef);

		return formList;
	}

	/**
	 * This method is provided as hook to validate the parameters.
	 * 
	 * @param params - Hashmap of cached client data
	 * @return null
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	/**
	 * This method checks whether Form Meta data is uptodate or not.
	 * 
	 * @return boolean value
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#isCacheUptoDate()
	 */
	@Override
	protected boolean isCacheUptoDate()
	{
		logger.ctinfo("CTFDF00076");
		return false;
	}

	/**
	 * This method retrieves the list of all the item types that need addition data support from the database and
	 * updates the private array list for the handler to use it while preparing the meta data.
	 */
	private void populateAdditionalDataDrivenFields()
	{
		FormDefinitionInstruction formInstruction = new FormDefinitionInstruction();
		try
		{
			List resultSet = formInstruction.getDataDrivenFieldTypes();
			if (resultSet != null)
			{
				Iterator i = resultSet.iterator();
				HashMap result = null;
				addDataDrivenFields = new ArrayList<String>();
				while (i.hasNext())
				{
					result = (HashMap) i.next();
					addDataDrivenFields.add((String) result.get(FormDefinitionConstants.TYPE_NAME));
				}
			}
		} catch (FormDefinitionException e)
		{
			logger.cterror("CTFDF00077", e);
		}
	}

	/**
	 * This private method intended update the cache if form meta data is 
	 * not initialized in the cahce. 
	 * 
	 * @param formDef
	 */
	private void updateFormMetaData(Map<String, BaseFormDefinition> formDef)
	{
		logger.ctinfo("CTFDF00078");
		String formId = null;
		List metadata = null;
		Map<String, String> dataMap = null;
		FormItemDefinition itemDef = null;
		BaseFormDefinition formMetadata = null;
		Map<String, BaseFormDefinition> fieldmap = new HashMap<String, BaseFormDefinition>();
		FormDefinitionInstruction formInstruction = new FormDefinitionInstruction();
		for (Map.Entry<String, BaseFormDefinition> defMap : formDef.entrySet())
		{
			formId = defMap.getKey();
			try
			{
				if (null != formDef.get(formId) && formDef.get(formId).isInitialized())
				{
					continue;
				}
				metadata = formInstruction.getFormMetaData(formId);
				if (metadata != null)
				{
					for (int i = 0; i < metadata.size(); i++)
					{
						if (metadata.get(i) != null)
						{
							dataMap = (HashMap) metadata.get(i);

							if (dataMap.get(FormDefinitionConstants.ITEM_TYPE).equals(
									FormDefinitionConstants.ITEM_TYPE_FORM) || dataMap.get(FormDefinitionConstants.ITEM_TYPE).equals(
											FormDefinitionConstants.ITEM_TYPE_FORM_DETAIL))
							{

								/**
								 * Setting the form meta data if the item type is form ,which is necessary to append the
								 * attributes like rowspan and colspan for the form if present.
								 */
								itemDef = new FormItemDefinition(dataMap);
								formMetadata = formDef.get(dataMap.get(FormDefinitionConstants.ITEM_ID));
								if(formMetadata!=null)
								formMetadata.setItemType(dataMap.get(FormDefinitionConstants.ITEM_TYPE));
								itemDef.setFormMetaData(formMetadata);
								formDef.get(formId).addForm(dataMap.get(FormDefinitionConstants.ITEM_ID));
								fieldmap.put(dataMap.get(FormDefinitionConstants.ITEM_ID), itemDef);
								if (fieldmap.get(dataMap.get(FormDefinitionConstants.PARENT_ID)) == null)
								{
									fieldmap.put(dataMap.get(FormDefinitionConstants.PARENT_ID),
											formDef.get(dataMap.get(FormDefinitionConstants.PARENT_ID)));
								}
								fieldmap.get(dataMap.get(FormDefinitionConstants.PARENT_ID)).addChild(itemDef);

								fieldmap.get(dataMap.get(FormDefinitionConstants.PARENT_ID)).addForm(
										dataMap.get(FormDefinitionConstants.ITEM_ID));

							} else
							{
								if (formDef.get(dataMap.get(FormDefinitionConstants.PARENT_ID)) != null
										&& formDef.get(dataMap.get(FormDefinitionConstants.PARENT_ID)).isInitialized())
								{
									continue;
								}
								itemDef = new FormItemDefinition(dataMap);
								logger.ctdebug("CTFDF00079", itemDef);
								fieldmap.put(itemDef.getItemId(), itemDef);
								updateDataDrivenFields(formDef, itemDef);
								if (itemDef.getParentId() != null)
								{
									if (fieldmap.get(itemDef.getParentId()) == null)
									{
										fieldmap.put(itemDef.getParentId(), formDef.get(itemDef.getParentId()));
									}
									logger.ctdebug("CTFDF00080", itemDef.getParentId());
									fieldmap.get(itemDef.getParentId()).addChild(itemDef);
								}
							}
						}
					}
				}
				formDef.get(formId).setInitialized(true);
			} catch (FormDefinitionException e)
			{
				logger.cterror("CTFDF00081", e, formId);
				logger.cterror("CTFDF00082", defMap);
			}
		}
		logger.ctinfo("CTFDF00083");
	}

	/**
	 * This method updates the data driven fields in the cache
	 * 
	 * @param formDef - Mapping of Form Definition object
	 * @param item - FormItemDefinition object containing the form items 
	 */
	private void updateDataDrivenFields(Map formDef, FormItemDefinition item)
	{
		if (item != null && item.getFormId() != null)
		{

			if (addDataDrivenFields.contains(item.getItemType()))
			{
				if (formDef.get(item.getFormId()) != null && formDef.get(item.getFormId()) instanceof FormDefinition)
				{
					((FormDefinition) formDef.get(item.getFormId())).addDataDrivenItems(item);
				}
			}
		}
	}

	/**
	 * This private method intended return a map of all the unique forms provided in the FORM_DEFINITION table
	 * 
	 * @return Map<String, BaseFormDefinition> formMap
	 */
	private Map<String, BaseFormDefinition> getFormDefinition()
	{
		logger.ctinfo("CTFDF00084");
		Map<String, BaseFormDefinition> formMap = new HashMap<String, BaseFormDefinition>();
		FormDefinitionInstruction formInstruction = new FormDefinitionInstruction();
		List formDefs = null;
		try
		{
			formDefs = formInstruction.getFormDefinition();
			if (formDefs != null)
			{
				Map defMap = null;
				for (int i = 0; i < formDefs.size(); i++)
				{
					if (formDefs.get(i) != null)
					{
						defMap = (HashMap) formDefs.get(i);
						formMap.put((String) defMap.get("FORM_ID"), new FormDefinition(defMap));
					}
				}
			}
		} catch (FormDefinitionException e)
		{
			logger.cterror("CTFDF00077", e);
		}
		logger.ctinfo("CTFDF00085");
		return formMap;
	}
}
