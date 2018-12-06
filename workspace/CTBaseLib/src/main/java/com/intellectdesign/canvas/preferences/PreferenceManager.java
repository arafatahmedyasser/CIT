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
package com.intellectdesign.canvas.preferences;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.value.IUserValue;
import com.intellectdesign.canvas.value.ListValue;

/**
 * This class is the entry point for retrieving the preference information at system and user level
 * 
 * @version 1.0
 */
public class PreferenceManager
{
	/**
	 * This method retrieves the preference value details for the specific code value within a preferencetype
	 * 
	 * @param preferenceType The Preference Criteria Type
	 * @param codeValue The code value for which details are required
	 * @return The ListValue having the details. Else null
	 */
	public ListValue getPreferenceValueFor(String preferenceType, String codeValue)
	{
		ListValue returnValue = null;
		CacheManager cacheMgr = CacheManager.getFWInstance();
		List cacheData = cacheMgr.getDataFromCache(null, PreferenceConstants.CACHE_KEY_ALL_PREF_DATA);
		// Position 0 contains the List of Preference definitions.
		// Position 1 contains a Map with the Key having the Attribute Type and Value as the List of ListValue.
		// Position 2 contains a Map where the Key is the Attribute type and Value is an Index map with Key as Attribute
		// code and value as Map having Attribute description + any other data retrieved.
		// So here we use 2
		Map<String, Map<String, ListValue>> indexedValues = (Map<String, Map<String, ListValue>>) cacheData.get(2);
		Map<String, ListValue> prefIndex = indexedValues.get(preferenceType);
		if (prefIndex != null)
		{
			returnValue = prefIndex.get(codeValue);
		}
		return returnValue;
	}

	/**
	 * This method retrieves the Preference configuration setup by the user.
	 * 
	 * @param userNumber
	 * @return
	 * @throws PreferenceException
	 */
	public ListValue[] getAllUserPreferences(String userNumber) throws PreferenceException
	{
		if (isEmpty(userNumber))
		{
			throw new PreferenceException("PREF_ERR_01",
					"UserNumber should be provided for retrieving the User Preferences.");
		}
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DAM_KEY_GET_ALL_USER_PREFERENCES);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION);
		dbRequest.addFilter(PreferenceConstants.USER_PREF_FLD_USER_NUMBER, userNumber.trim());

		// Execute the query.
		List<ListValue> selectedRecords = null;
		try
		{
			selectedRecords = dbRequest.execute().getReturnedList();
		} catch (DatabaseException e)
		{
			throw new PreferenceException("PREF_DB_ERR",
					"Error occured while fetching data from database for userNo = '" + userNumber + "'", e);
		}
		// Convert the list into an array
		ListValue[] returnValue = new ListValue[selectedRecords.size()];
		// For each of the values, also update any additional data that would be present in the original list of values
		// at the Preference criteria level
		ListValue sysDefinitionValue;
		for (int count = 0; count < selectedRecords.size(); count++)
		{
			returnValue[count] = selectedRecords.get(count);
			//Amount and Date format details not saved in the Cache
			if(returnValue[count].getCode().equalsIgnoreCase("AMOUNT")
					|| returnValue[count].getCode().equalsIgnoreCase("DATEFORMAT")){
					ListValue lv = new ListValue();
					lv.setCode(returnValue[count].getDesc()); 
					sysDefinitionValue = lv;
				
					
			}else{
				sysDefinitionValue = getPreferenceValueFor(returnValue[count].getCode(), returnValue[count].getDesc());
			}
			if (sysDefinitionValue != null)
			{
				returnValue[count].setValue(sysDefinitionValue.getDesc());
				returnValue[count].setAdditionalProperties(sysDefinitionValue.getAdditionalProperties());
			}
		}

		return returnValue;
	}

	/**
	 * This method retrieves a single User Preference setup for the given user and Preference type combination
	 * 
	 * @param userNumber The user Number
	 * @param preferenceType The preference type
	 * @return The List Value having the details of the preference
	 * @throws PreferenceException Thrown if any error occurs while fetching the preference information
	 */
	public ListValue getUserPreference(String userNumber, String preferenceType) throws PreferenceException
	{
		if (isEmpty(userNumber) || isEmpty(preferenceType))
		{
			throw new PreferenceException("PREF_ERR_01",
					"UserNumber and PreferenceType should be provided for retrieving the User Preferences.");
		}
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DAM_KEY_GET_ALL_USER_PREFERENCES);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION);
		dbRequest.addFilter(PreferenceConstants.USER_PREF_FLD_USER_NUMBER, userNumber.trim());
		dbRequest.addFilter(PreferenceConstants.USER_PREF_FLD_PREF_TYPE, preferenceType.trim());

		List<ListValue> selectedRecords = null;
		try
		{
			selectedRecords = dbRequest.execute().getReturnedList();
		} catch (DatabaseException e)
		{
			throw new PreferenceException("PREF_DB_ERR",
					"Error occured while fetching data from database for userNo = '" + userNumber + "'", e);
		}

		ListValue returnValue = null;
		// Expect only a single result for the given combination.
		if (selectedRecords.size() > 0)
		{
			returnValue = selectedRecords.get(0);
			// For each of the values, also update any additional data that would be present in the original list of
			// values
			// at the Preference criteria level
			ListValue sysDefinitionValue;
			// Update the list value with the actual description of the code value as well as the additional properties
			// associated with it
			sysDefinitionValue = getPreferenceValueFor(returnValue.getCode(), returnValue.getDesc());
			if (sysDefinitionValue != null)
			{
				returnValue.setValue(sysDefinitionValue.getDesc());
				returnValue.setAdditionalProperties(sysDefinitionValue.getAdditionalProperties());
			}

		} else
		{
			LOGGER.ctinfo("CTBAS00029", userNumber, preferenceType);
		}

		return returnValue;
	}

	/**
	 * This method retrieves the Preference Criteria of the Corporate based on the provided GCIF or the GCIF of the user
	 * number. If both values are provided, then GCIF is given the priority.
	 * 
	 * @param gcif The GCIF for which the preferences are to be retrieved
	 * @param userNumber The user Number with which the GCIF is to be identified for retrieving the preferences
	 * @return The List of preferences set up for the GCIF
	 * @throws PreferenceException Thrown if any error occurs while retrieving the Preferences
	 */
	public ListValue[] getAllCorporatePreferences(String gcif, String userNumber) throws PreferenceException
	{
		if (isEmpty(gcif) && isEmpty(userNumber))
		{
			throw new PreferenceException("PREF_ERR_01",
					"Either GCIF or UserNumber should be provided for retrieving the Corporate Preferences.");
		}
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DAM_KEY_GET_ALL_CORP_PREFERENCES);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION);
		// Add the GCIF or User Number filter with first priority to GCIF
		if (!isEmpty(gcif))
			dbRequest.addFilter(PreferenceConstants.CORP_PREF_FLD_GCIF, gcif.trim());
		else
			dbRequest.addFilter(PreferenceConstants.CORP_PREF_FLD_USER_NUMBER, userNumber.trim());

		// Execute the query.
		List<ListValue> selectedRecords = null;
		try
		{
			selectedRecords = dbRequest.execute().getReturnedList();
		} catch (DatabaseException e)
		{
			throw new PreferenceException("PREF_DB_ERR", "Error occured while fetching data from database for gcif = '"
					+ gcif + "', userNo = '" + userNumber + "'", e);
		}
		// Convert the list into an array
		ListValue[] returnValue = new ListValue[selectedRecords.size()];
		// while converting to the array, get the display value for the criteria from its source and get update the
		// same.
		ListValue prefData;
		for (int count = 0; count < selectedRecords.size(); count++)
		{
			returnValue[count] = selectedRecords.get(count);
			prefData = getPreferenceValueFor(returnValue[count].getCode(), returnValue[count].getDesc());
			// Just for safety purposes do a null check. But this can never happen
			if (prefData != null)
			{
				returnValue[count].setValue(prefData.getDesc());
				// Transfer any additional properties if present
				returnValue[count].setAdditionalProperties(prefData.getAdditionalProperties());
			}
		}

		return returnValue;
	}

	/**
	 * This method retrieves the Preference Criteria of the Corporate based on the provided GCIF or the GCIF of the user
	 * number. If both values are provided, then GCIF is given the priority.
	 * 
	 * @param gcif The GCIF for which the preferences are to be retrieved
	 * @param userNumber The user Number with which the GCIF is to be identified for retrieving the preferences
	 * @param preferenceType The Exact Preference criteria to retrieve
	 * @return The value for the preference type at the GCIF level
	 * @throws PreferenceException Thrown if any error occurs while retrieving the Preferences
	 */
	public ListValue getCorporatePreference(String gcif, String userNumber, String preferenceType)
			throws PreferenceException
	{
		if (isEmpty(gcif) && isEmpty(userNumber))
		{
			throw new PreferenceException("PREF_ERR_01",
					"Either GCIF or UserNumber should be provided for retrieving the Corporate Preferences.");
		}
		if (isEmpty(preferenceType))
		{
			throw new PreferenceException("PREF_ERR_01",
					"PreferenceType should be provided for retrieving the Corporate Preferences.");
		}
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DAM_KEY_GET_ALL_CORP_PREFERENCES);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION);
		// Add the GCIF or User Number filter with first priority to GCIF
		if (!isEmpty(gcif))
			dbRequest.addFilter(PreferenceConstants.CORP_PREF_FLD_GCIF, gcif.trim());
		else
			dbRequest.addFilter(PreferenceConstants.CORP_PREF_FLD_USER_NUMBER, userNumber.trim());
		// Add the preference Type filter
		dbRequest.addFilter(PreferenceConstants.CORP_PREF_FLD_PREF_TYPE, preferenceType.trim());

		// Execute the query.
		List<ListValue> selectedRecords = null;
		try
		{
			selectedRecords = dbRequest.execute().getReturnedList();
		} catch (DatabaseException e)
		{
			throw new PreferenceException("PREF_DB_ERR", "Error occured while fetching data from database for gcif = '"
					+ gcif + "', userNo = '" + userNumber + "'", e);
		}
		ListValue returnValue = null;
		// Expect only a single result for the given combination.
		if (selectedRecords.size() > 0)
		{
			returnValue = selectedRecords.get(0);
			// For each of the values, also update any additional data that would be present in the original list of
			// values at the Preference criteria level
			// Update the list value with the actual description of the code value as well as the additional properties
			// associated with it
			ListValue sysDefinitionValue = getPreferenceValueFor(returnValue.getCode(), returnValue.getDesc());
			if (sysDefinitionValue != null)
			{
				returnValue.setValue(sysDefinitionValue.getDesc());
				returnValue.setAdditionalProperties(sysDefinitionValue.getAdditionalProperties());
			}
		} else
		{
			LOGGER.ctinfo("CTBAS00030", gcif, userNumber, preferenceType);
		}

		return returnValue;
	}

	/**
	 * This method gets the list all possible values for a given System preference criteria
	 * 
	 * @param preferenceType The preference criteria
	 * @return The possible list of values
	 */
	public ListValue[] getSystemPreferenceValues(String preferenceType, IUserValue userValue)
	{
		CacheManager cacheMgr = CacheManager.getFWInstance();
		List cacheData = cacheMgr.getDataFromCache(null, PreferenceConstants.CACHE_KEY_ALL_PREF_DATA);
		// Position 0 contains the List of Preference definitions.
		// Position 1 contains a Map with the Key having the Attribute Type and Value as the List of ListValue.
		// Position 2 contains a Map where the Key is the Attribute type and Value is an Index map with Key as Attribute
		// code and value as Map having Attribute description + any other data retrieved.
		// So here we return 1
		Map<String, List<ListValue>> indexMap = (Map<String, List<ListValue>>) cacheData.get(1);
		List<ListValue> valuesList = indexMap.get(preferenceType);
		List userRoleList = null;
		List listRolesbyUser = null;
		if(PreferenceConstants.USER_PREF_USER_ROLE.equals(preferenceType)){
			userRoleList = new ArrayList();
			userRoleList = getUserRolesPrefByUser(userValue);
			listRolesbyUser = new ArrayList();
			if(userRoleList.size()>0){
				for(int i=0; i<userRoleList.size();i++){
					String sMappedUserRole = (String) ((HashMap)userRoleList.get(i)).get(PreferenceConstants.USER_PREF_USER_ROLE);
					for(int j =0; j<valuesList.size();j++){
						if(sMappedUserRole.equals(valuesList.get(j).getCode())){
							listRolesbyUser.add(valuesList.get(j));
						}
					}
				}
			}
			valuesList = listRolesbyUser;
		}
		// Convert the list to an array
		return valuesList.toArray(new ListValue[0]);
	}

	/**
	 * This method returns the list of System Preference Definition information
	 * 
	 * @return The list of system preference definitions
	 */
	public List<SystemPreferenceDefinition> getAllSystemPreferenceDefinitions()
	{
		CacheManager cacheMgr = CacheManager.getFWInstance();
		List cacheData = cacheMgr.getDataFromCache(null, PreferenceConstants.CACHE_KEY_ALL_PREF_DATA);
		// Position 0 contains the List of Preference definitions.
		// Position 1 contains a Map with the Key having the Attribute Type and Value as the List of ListValue.
		// Position 2 contains a Map where the Key is the Attribute type and Value is an Index map with Key as Attribute
		// code and value as Map having Attribute description + any other data retrieved.
		// So here we return 0
		List<SystemPreferenceDefinition> valuesList = (List<SystemPreferenceDefinition>) cacheData.get(0);

		return valuesList;
	}

	/**
	 * To update all the preferences as per the arguments.
	 * 
	 * @param attribiteType
	 * @param attributeValue
	 * @param userNo
	 * @return
	 * @throws PreferenceException
	 */
	public boolean updateAllPreferences(List<String> attribiteType, List<Object> attributeValue, String userNo)
			throws PreferenceException
	{
		boolean status = false;
		List<HashMap> userPref = new ArrayList<HashMap>();
		deletePreference(userNo);
		for (int i = 0; i < attribiteType.size(); i++)
		{
			if(attributeValue.size() > i && attributeValue.get(i) != null){
				HashMap pref = new HashMap();
				pref.put(PreferenceConstants.USER_PREF_FLD_USER_NUMBER, userNo);
				if(attributeValue.get(i).equals("GUEST")){
					continue;
				}
				pref.put(PreferenceConstants.USER_PREF_FLD_ATTRIBUTE_TYPE, attribiteType.get(i));
				pref.put(PreferenceConstants.USER_PREF_FLD_ATTRIBUTE_VALUE, attributeValue.get(i));
				userPref.add(pref);
			}
		}
		insertUserPreferences(userPref, userNo);
		status = true;
		return status;
	}

	/**
	 * To insert preferences for a specific user.
	 * 
	 * @param userPref
	 * @param userNo
	 * @return
	 * @throws PreferenceException
	 */

	private boolean insertUserPreferences(List<HashMap> userPref, String userNo) throws PreferenceException
	{
		boolean insertStatus = false;
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DB_OPERATION_EXTENSION);
		dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
		dbRequest.setOperationExtension(PreferenceConstants.INSERT_USER_PREFERENCES);
		dbRequest.setBatchData(userPref);
		try
		{
			dbRequest.execute();
		} catch (DatabaseException dbexp)
		{
			throw new PreferenceException(dbexp);

		}
		insertStatus = true;
		return insertStatus;
	}

	/**
	 * Delete all the preferences for a user.
	 * 
	 * @param userNo
	 * @return
	 * @throws PreferenceException
	 */
	private boolean deletePreference(String userNo) throws PreferenceException
	{
		boolean deleteStatus = false;
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DB_OPERATION_EXTENSION);
		dbRequest.setOperation(DatabaseConstants.DELETE);
		dbRequest.setOperationExtension(PreferenceConstants.DELETE_USER_PREFERENCES);
		dbRequest.addFilter(PreferenceConstants.USER_PREF_FLD_USER_NUMBER, userNo);
		try
		{
			dbRequest.execute();
		} catch (DatabaseException dbexp)
		{
			throw new PreferenceException(dbexp);
		}
		return deleteStatus;

	}

	/**
	 * Helper method to retrieve the Preference data from the Cache
	 * 
	 * @return The indexed preference data from cache
	 */
	private Map<String, Map<String, ListValue>> getIndexedPreferenceData()
	{
		CacheManager cacheMgr = CacheManager.getFWInstance();
		List cacheData = cacheMgr.getDataFromCache(null, PreferenceConstants.CACHE_KEY_ALL_PREF_DATA);
		// Position 0 contains the List of Preference definitions.
		// Position 1 contains a Map with the Key having the Attribute Type and Value as the List of ListValue.
		// Position 2 contains a Map where the Key is the Attribute type and Value is an Index map with Key as Attribute
		// code and value as Map having Attribute description + any other data retrieved.
		// So here we return 2
		return (Map<String, Map<String, ListValue>>) cacheData.get(2);
	}
	
	/**
	 * Method used to fetch the roles which are mapped to the logged in user.
	 * @param userNo
	 * @return List of Roles.
	 */
	private List getUserRolesPrefByUser(IUserValue userValue){
		List roleList = null;
		DatabaseRequest dbRequest = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(PreferenceConstants.DB_OPERATION_EXTENSION);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION_ROLES_BY_USER);
			dbRequest.addFilter(PreferenceConstants.USER_PREF_FLD_USER_NUMBER, userValue.getUserNo());
			dbRequest.addFilter(PreferenceConstants.USER_PREF_FLD_GCIF, userValue.getPrimaryGcif());
			roleList = dbRequest.execute().getReturnedList();
		} 
		catch (DatabaseException e)
		{
			LOGGER.cterror("CTBAS00081",  e);
		}
		return roleList;
	}

	/**
	 * Utility method for checking whether a string is empty
	 * 
	 * @param aValue
	 * @return
	 */
	private static boolean isEmpty(String aValue)
	{
		return aValue == null || "".equals(aValue.trim());
	}

	private static final Logger LOGGER = Logger.getLogger(PreferenceManager.class);
}
