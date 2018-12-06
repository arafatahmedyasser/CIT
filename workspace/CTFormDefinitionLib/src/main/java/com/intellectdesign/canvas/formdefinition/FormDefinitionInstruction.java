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
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This instruction class provides the form defintion and form item definition related meta data from Database.
 * 
 * @version 1.0
 */
public class FormDefinitionInstruction
{
	/**
	 * An instance of Logger
	 */
	private Logger logger = Logger.getLogger(FormDefinitionInstruction.class);

	/**
	 * This method provides all the data from the FORM_DEFINITION table as a List.
	 * 
	 * @return List - List object containing the Form definition data
	 * @throws FormDefinitionException
	 */
	public List getFormDefinition() throws FormDefinitionException
	{
		String cname = "getFormDefinition";
		logger.ctinfo("CTFDF00052", cname);

		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.DB_DAM_KEY_FORM_MANAGER);
			dbRequest.setOperationExtension(FormDefinitionConstants.DB_EXT_KEY_GET_FORM_DEFN);
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00053", dbExp);
			throw new FormDefinitionException(dbExp);
		}
		logger.ctinfo("CTFDF00054", cname);
		return itemList;
	}

	/**
	 * This method provides a list of all the form item and their relational data as form meta data. 
	 * This meta data will exclude the item types 18 - Form Panel and 30 - Form Detail.  
	 * 
	 * @return List - List object containing the Form Item Definition data for the given Form Id
	 * @throws FormDefinitionException
	 */
	public List getFormMetaData(String formId) throws FormDefinitionException
	{
		String cname = "getFormMetaData";
		logger.ctinfo("CTFDF00055", cname, formId);

		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.DB_DAM_KEY_FORM_MANAGER);
			dbRequest.setOperationExtension(FormDefinitionConstants.DB_EXT_KEY_GET_FORM_META_DATA);
			dbRequest.addFilter(FormDefinitionConstants.FORM_ID, formId);
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00056", dbExp, formId);
			throw new FormDefinitionException(dbExp);
		}
		logger.ctinfo("CTFDF00057", cname, formId);
		return itemList;
	}

	/**
	 * This method returns the mapping of the form definitions and form item definitions meta data 
	 * 
	 * @return formDefExport - Map object containing the formId and its form item definition 
	 * 
	 * @throws FormDefinitionException
	 */
	public Map getFormMetaDataForExport(List formIds) throws FormDefinitionException
	{

		String cname = "getFormMetaData";
		logger.ctinfo("CTFDF00055", cname, formIds);

		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List formList = null;
		Map formDefExport = new HashMap();

		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.DB_DAM_KEY_FORM_MANAGER);
			dbRequest.setOperationExtension(FormDefinitionConstants.GET_FORM_DEFN_EXPORT);
			dbRequest.addFilter(FormDefinitionConstants.FORM_IDS, formIds);
			dbRequest.setQueryAsMap(true);
			dbRequest.setKeyProperty(FormDefinitionConstants.ITEM_KEY);
			dbRequest.setValueProperty(FormDefinitionConstants.METADATA);
			dbResult = dbRequest.execute();
			formList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00058", dbExp, formIds);
			throw new FormDefinitionException(dbExp);
		}
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.DB_DAM_KEY_FORM_MANAGER);
			dbRequest.setOperationExtension(FormDefinitionConstants.DB_EXT_KEY_GET_FORM_META_DATA_EXPORT);
			dbRequest.addFilter(FormDefinitionConstants.FORM_IDS, formIds);
			dbRequest.setQueryAsMap(true);
			dbRequest.setKeyProperty(FormDefinitionConstants.ITEM_KEY);
			dbRequest.setValueProperty(FormDefinitionConstants.METADATA);

			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00059", dbExp, formIds);
			throw new FormDefinitionException(dbExp);
		}
		formDefExport.putAll((Map) formList.get(0));
		formDefExport.putAll((Map) itemList.get(0));

		logger.ctinfo("CTFDF00057", cname, formIds);
		return formDefExport;
	}

	/**
	 * This method provides the list of Form Item Types that need additional data from caching 
	 * 
	 * @return itemList - List object containing Form Item Types that need additional data
	 * @throws FormDefinitionException
	 */
	public List getDataDrivenFieldTypes() throws FormDefinitionException
	{
		String cname = "getFormMetaData";
		logger.ctinfo("CTFDF00052", cname);

		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.DB_DAM_KEY_FORM_MANAGER);
			dbRequest.setOperationExtension(FormDefinitionConstants.DB_EXT_KEY_GET_DATA_DRIVEN_FIELD_TYPES);
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00101", dbExp);
			throw new FormDefinitionException(dbExp);

		}
		logger.ctinfo("CTFDF00054", cname);
		return itemList;
	}

	/**
	 * This method provides the valid mime types for validating the user images
	 * 
	 * @param userImageSupportedFormats - List object containing the image formats without the dot 
	 * @return mimeTypesList - List object containing the suppported MIME Types for the formats passed as param
	 * @throws FormDefinitionException
	 */
	public List getUserImageMimeTypes(List userImageSupportedFormats) throws FormDefinitionException
	{
		logger.ctinfo("CTFDF00060");

		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List<HashMap<String, String>> mimeList = null;
		List<String> mimeTypesList = null;

		try
		{
			mimeList = new ArrayList<HashMap<String, String>>();
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.DB_DAM_KEY_FORM_MANAGER);
			dbRequest.setOperationExtension(FormDefinitionConstants.GET_USERIMAGE_MIME_TYPES);
			dbRequest.addFilter(FormDefinitionConstants.GET_USERIMAGE_SUPPORTED_FORMATS, userImageSupportedFormats);

			dbResult = dbRequest.execute();
			mimeList = dbResult.getReturnedList();
			mimeTypesList = new ArrayList<String>();
			for (int k = 0; k < mimeList.size(); k++)
			{
				mimeTypesList.add(mimeList.get(k).get("MIME_TYPE"));
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00102", dbExp);
			throw new FormDefinitionException(dbExp);

		}
		logger.ctinfo("CTFDF00061");
		return mimeTypesList;
	}
}
