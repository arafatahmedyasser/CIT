/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 

 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.notes.instruction;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.constants.notes.NotesConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is used to NotesInstruction class provides support for CRUD operations for the Notes library maintenance.
 * 
 * @version 1.0
 */
@SuppressWarnings("rawtypes")
public class NotesInstruction
{
	private String[] damNames;
	private Map data;

	/**
	 * NotesInstruction class provides support for CRUD operations for the Notes library maintenance
	 */
	public NotesInstruction()
	{
		String[] damNames = new String[1];
		damNames[0] = NotesConstants.NOTES_DAM;
		this.damNames = damNames;
	}

	/**
	 * This method checks DAM name value and Based on the DAM name returns key name by which specific child DAM/table's
	 * data is stored in parent HashMap.
	 * 
	 * @param damName DAM Name
	 * @return String - Key name
	 */
	public String getDataKeyNameFor(String damName)
	{
		String keyName = null;
		if (NotesConstants.NOTES_DAM.equals(damName))
		{
			keyName = NotesConstants.NOTES_DAM_DTLS;
		}
		return keyName;
	}

	/**
	 * This method is used to perform the database operation for the action .
	 * 
	 * @params inputMap Map of input values
	 * @return List returnDatalist
	 * @exception DatabaseException
	 */
	public List get(Map inputMap) throws DatabaseException
	{
		List returnDatalist = new ArrayList();
		try
		{
			DatabaseRequest databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(NotesConstants.NOTES_DAM);
			databaseRequest.addFilter("INPUT_GCIF", inputMap.get("INPUT_GCIF"));
			databaseRequest.addFilter("INPUT_USER_NO", inputMap.get("INPUT_USER_NO"));
			// databaseRequest.addFilter("CURRENT_DATE", inputMap.get("CURRENT_DATE"));
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			DatabaseResult databaseResult = databaseRequest.execute();
			returnDatalist = databaseResult.getReturnedList();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTNTS0011", dbException);
			throw dbException;
		}
		return returnDatalist;
	}

	/**
	 * This method is used to perform the HashMap operation for the action .
	 * 
	 * @params Map of inputMap values
	 * @return List returnDatalist
	 * @exception DatabaseException
	 */
	public HashMap getMessage(Map inputMap) throws DatabaseException
	{
		List returnDatalist = new ArrayList();
		Object data = null;
		DatabaseResult dbResult = new DatabaseResult();
		String message = null;
		HashMap dataMap = null;
		try
		{
			DatabaseRequest databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(NotesConstants.NOTES_DAM);
			databaseRequest.addFilter("INPUT_GCIF", inputMap.get("INPUT_GCIF"));
			databaseRequest.addFilter("INPUT_USER_NO", inputMap.get("INPUT_USER_NO"));
			// databaseRequest.addFilter("CURRENT_DATE", inputMap.get("CURRENT_DATE"));
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension("FOR_INIT");
			dbResult = databaseRequest.execute();
			returnDatalist = dbResult.getReturnedList();
			if (returnDatalist.isEmpty())
			{
				dataMap = new HashMap();
			} else
			{
				dataMap = (HashMap) returnDatalist.get(0);
			}
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTNTS0012", dbException);
			throw dbException;
		}
		return dataMap;
	}

	/**
	 * Gets list of keys in data HashMap to be auditted for a specific library.
	 * 
	 * @return List
	 */
	public List getAuditDataKeys()
	{

		List auditKeys = new ArrayList();
		return auditKeys;
	}

	/**
	 * Formats the data returned by Instruction for display/presentation purpose for each specific library.
	 * 
	 * @param dataList
	 * @return Map
	 */
	public Map formatSelectData(List dataList)
	{
		return null;
	}

	/**
	 * Gets list of keys in Instruction's data HashMap whose values will be returned/shown to confirmation page after
	 * completion of library operation for the specific library. In case of select operation, library record(s) fetched
	 * will be put by the key - LIB_RECORD_LIST which maps to ArrayList of HashMap. Each HashMap would contain one row
	 * of data. Hence select operation's row specific keys neednot be mentioned in this API.
	 * 
	 * @return List
	 */
	public List getReturnDataKeys()
	{

		List dataKeys = new ArrayList();
		dataKeys.add(NotesConstants.FIELD_NOTES_DATE);
		dataKeys.add(NotesConstants.STATUS);
		return dataKeys;
	}

	/**
	 * This method gets list of fields/columns for a particular DAM i.e. table.
	 * 
	 * @param damName DAM/table name
	 * @return List of fields/columns
	 */
	public List getFieldsFor(String damName)
	{
		List fieldNames = new ArrayList();
		if (NotesConstants.NOTES_DAM.equals(damName))
		{
			fieldNames.add("INPUT_GCIF");
			fieldNames.add("INPUT_USER_NO");
			fieldNames.add("CURRENT_DATE");
			// For Example,
			// fieldNames.add(NotesConstants.PHONE_NO);
			// fieldNames.add(NotesConstants.ADDRESS);
		}
		/**
		 * else if (NotesConstants.NOTES_DAM.equals(damName)) {
		 * 
		 * fieldNames.add(NotesConstants.NOTES_ID); fieldNames.add(NotesConstants.FIELD_OD_GCIF);
		 * fieldNames.add(NotesConstants.FIELD_STATUS); fieldNames.add(NotesConstants.PRODUCTCUSER);
		 * fieldNames.add(NotesConstants.SUBPRODUCTCUSER); //Add necessary fields needed for this library or used in
		 * this library //For Example, //fieldNames.add(NotesConstants.BRANCH_NAME);
		 * //fieldNames.add(NotesConstants.ACCOUNT_NO); }
		 */
		return fieldNames;
	}

	/**
	 * This method gets list of primary fields/columns for a particular DAM i.e. table.
	 * 
	 * @param damName DAM/table name
	 * @return List of primary fields/columns
	 */
	public List getPrimaryKeysFor(String damName)
	{
		List pkList = new ArrayList();
		if (NotesConstants.NOTES_DAM.equals(damName))
		{
			pkList.add("INPUT_GCIF");
			pkList.add("INPUT_USER_NO");
			pkList.add("CURRENT_DATE");
		}
		return pkList;
	}

	/**
	 * This method is used to perform the database operation for the action SAVE_NOTE.
	 * 
	 * @params inputMap Map of input values
	 * @return List returnDatalist
	 * @exception DatabaseException
	 */
	public void saveNote(Map inputMap) throws DatabaseException
	{
		try
		{
			DatabaseRequest databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(NotesConstants.NOTES_DAM);
			/**
			 * Add the necessary filter statement needed to perform the action ${action} For Ex,
			 * databaseRequest.addFilter(NotesConstants.FIELD_OD_GCIF,(String)
			 * inputMap.get(NotesConstants.FIELD_OD_GCIF));
			 */
			databaseRequest.setOperation(DatabaseConstants.INSERT);
			databaseRequest.setData(inputMap);
			databaseRequest.execute();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTNTS0013", dbException);
			throw dbException;
		}

	}

	/**
	 * This metod is ref to SetDataMap
	 * 
	 * @param data
	 */
	public void setData(Map data)
	{
		this.data = data;
	}

	/**
	 * This method is for ref to delete DB Request
	 * 
	 * @return null
	 * @throws OnlineException
	 */
	public void delete() throws OnlineException

	{
		DatabaseRequest dbreq = new CanvasDatabaseRequest();
		try

		{
			// Checking if DAM names is null
			if (damNames == null)
				throw new OnlineException("ERR_GLOBAL", "DAM Names is null");
			/**
			 * Constructing a Database request object, setting various parameters and invoking delete on parent table
			 * 
			 * The first element of damNames String is the DAM name of the parent
			 */
			dbreq.setDataAccessMapKey(damNames[0]);
			dbreq.setOperation(DatabaseConstants.DELETE);
			setFilterData(dbreq, damNames[0], data, null);
			dbreq.execute();
		} catch (DatabaseException dex)
		{

			LOGGER.cterror("CTNTS0014" + dex.getMessage());
			throw new OnlineException(dex);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTNTS0015" + ex.getMessage());
			throw new OnlineException(ex);
		}
	}

	/**
	 * Sets filter data(data passed for where clause in a query) for a DAM/table. Assumes the list of filters for a
	 * 
	 * table is same as list of Primary keys for the table.
	 * 
	 * @param DatabaseRequest DBRequest object to which filters are to be added
	 * 
	 * @param damName table name for which filter data is to be set
	 * 
	 * @param damMap child table's data as key/value pairs
	 * 
	 * @param parentMap parent table's data as key/value pairs
	 */
	protected void setFilterData(DatabaseRequest dbreq, String damName, Map damMap, Map parentMap)

	{

		// Gets list of primary key for the DAM i.e filters for a DAM's

		// update/delete query
		List filterList = getPrimaryKeysFor(damName);
		String fldKey = null;
		int fldLoop = 0;
		for (fldLoop = 0; fldLoop < filterList.size(); fldLoop++)
		{
			fldKey = (String) filterList.get(fldLoop);
			/**
			 * Checks if the child HashMap contain the key and and if present, adds it as a filter to database request
			 * 
			 * object
			 */
			if (damMap.containsKey(fldKey))
			{
				dbreq.addFilter(fldKey, damMap.get(fldKey));
			} else
			{
				if (parentMap != null)
					/**
					 * Checks if the parent HashMap contain the key and and if present, adds it as a filter to database
					 * 
					 * request object
					 */
					if (parentMap.containsKey(fldKey))
						dbreq.addFilter(fldKey, parentMap.get(fldKey));
			}
		}
	}

	/**
	 * Sets filter data(data passed for where clause in a query) for a DAM/table. Assumes the list of filters for a
	 * table is same as list of Primary keys for the table.
	 * 
	 * @param DatabaseRequest DBRequest object to which filters are to be added
	 * 
	 * @param damName table name for which filter data is to be set
	 * 
	 * @param damMap child table's data as key/value pairs
	 * 
	 * @param parentMap parent table's data as key/value pairs
	 */

	protected void setFilterDataLib(DatabaseRequest dbreq, String damName, Map damMap, Map parentMap)

	{

		// Gets list of primary key for OD_LIB_MASTER update/delete query
		List filterList = new ArrayList<String>();
		filterList.add("OD_LIB_ID");
		filterList.add("BENE_ID");
		filterList.add("OD_LIB_NAME");
		// filterList.add("OD_REF_NO");
		filterList.add("INPUT_GCIF");
		filterList.add("INPUT_FUNCTION_CODE");
		filterList.add("INPUT_PRODUCT");
		filterList.add("INPUT_SUB_PRODUCT");
		filterList.add("STATUS");
		filterList.add("INPUT_USER_NO");
		filterList.add("OLD_STATUS");
		filterList.add("OD_REF_NO");
		String fldKey = null;
		int fldLoop = 0;
		for (fldLoop = 0; fldLoop < filterList.size(); fldLoop++)
		{
			fldKey = (String) filterList.get(fldLoop);
			if (damMap.containsKey(fldKey))
			{
				dbreq.addFilter(fldKey, damMap.get(fldKey));
			}
		}
	}

	private static Logger LOGGER = Logger.getLogger(NotesInstruction.class);
}
