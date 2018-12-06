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

package com.intellectdesign.canvas.audit.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * Instruction class for Audit Handler Framework to interact with Database Access Layer
 *  
 * @version 1.0
 */
public class AuditHandlerInstruction
{
	private static final Logger logger = Logger.getLogger(AuditHandlerInstruction.class);

	/**
	 * This is the entry point for inserting any audit data into the audit tables.
	 * 
	 * @param event The event against which audit should happen
	 * @param auditData The audit data + metadata
	 * @throws DatabaseException thrown if any exception occurs while accessing database.
	 */
	public void insertAuditData(AuditData auditData) throws DatabaseException
	{
		logger.ctinfo("CTAUD00139", auditData);

		// First check if the audit data recieved is complete.
		if (!AuditData.isComplete(auditData))
		{
			logger.cterror("CTAUD00140", auditData);
			DatabaseException ex = new DatabaseException(mReader.retrieveProperty("AUD003"));
			// Log the exception scenario and then throw it.
			logException(ex, "AUD003");
			throw ex;
		}

		logger.ctinfo("CTAUD00141");
		// Step 1: First generate a new id for this Audit
		String auditId = getNewAuditId();

		auditData.setAuditId(auditId);

		// Step 2: Second insert the audit meta data
		insertAuditMetaData(auditData);

		// Step 3: Now insert the audit details itself.
		// insertAuditDetails( auditData );
		logger.ctinfo("CTAUD00142");
	}

	/**
	 * Helper method to get the new audit id from the db sequence.
	 * 
	 * @return long the newly generated audit id
	 * @throws DatabaseException Thrown if any error occurs while fetching the next valye from sequence
	 */
	private String getNewAuditId() throws DatabaseException
	{

		String auditId = null;
		logger.ctinfo("CTAUD00143");
		auditId = UUID.randomUUID().toString().replaceAll("-", "");
		logger.ctinfo("CTAUD00145", auditId);
		return auditId;
	}

	/**
	 * Helper method to insert the Audit meta data.
	 * 
	 * @param auditData
	 * @throws DatabaseException
	 */
	private void insertAuditMetaData(AuditData auditData) throws DatabaseException
	{
		// First prepare the hashmap for passing to the db layer.
		DatabaseRequest dbRequest = null;
		HashMap dataMap = new HashMap();

		logger.ctinfo("CTAUD00146");
		// Remove the setting of Audit Id as this will be set as part of the insert query
		dataMap.put(AuditConstants.AUDIT_ID, auditData.getAuditId());

		dataMap.put(AuditConstants.EVENT_ID, auditData.getEventIdAsString());
		dataMap.put(AuditConstants.APP_SERVER, auditData.getAppServerIP());
		dataMap.put(AuditConstants.CLIENT_IP_ADDR, auditData.getClientIP());
		dataMap.put(AuditConstants.WEB_SERVER, auditData.getWebserverIP());
		dataMap.put(AuditConstants.REFERENCE, auditData.getReferenceNo());
		dataMap.put(AuditConstants.REFERENCE_KEY,
				StringUtils.ensureExists(auditData.getReferenceKey(), auditData.getReferenceNo()));
		dataMap.put(AuditConstants.SESSION_ID, auditData.getSessionId());
		dataMap.put(AuditConstants.OD_LOGIN_ID, auditData.getLoginId());
		dataMap.put(AuditConstants.USER_NO, auditData.getUserNo());
		dataMap.put(AuditConstants.OD_GCIF, auditData.getGCIF());
		dataMap.put(AuditConstants.OD_PARENT_GCIF, auditData.getParentGCIF());
		dataMap.put(AuditConstants.SIMULATION_MODE, new Boolean(auditData.getSimulationMode()));
		dataMap.put(AuditConstants.CHANNEL, auditData.getChannel());
		dataMap.put(AuditConstants.BROWSER_NAME, auditData.getBrowserName());
		dataMap.put(AuditConstants.AUDIT_DATA, auditData.getAuditData());
		dataMap.put(AuditConstants.DSA_DATA, auditData.getDSAData());
		dataMap.put(AuditConstants.DEVICE_BAND_ID, auditData.getDeviceBandId());
		dataMap.put(AuditConstants.USER_AGENT, auditData.getUserAgent());
		dataMap.put(AuditConstants.WORKSPACE_ID, auditData.getWorkspaceId());
		dataMap.put(AuditConstants.LAYOUT_ID, auditData.getLayoutId());
		dataMap.put(AuditConstants.WIDGET_ID, auditData.getWidgetId());
		dataMap.put(AuditConstants.GEO_LOCATION, auditData.getGeoLocation());
		dataMap.put(AuditConstants.REQUEST_ID, auditData.getRequestId());
		dataMap.put(AuditConstants.REQUEST_URI, auditData.getRefererUrl());
		dataMap.put(AuditConstants.UDF1, auditData.getUDF1());
		dataMap.put(AuditConstants.UDF2, auditData.getUDF2());
		dataMap.put(AuditConstants.UDF3, auditData.getUDF3());
		dataMap.put(AuditConstants.UDF4, auditData.getUDF4());
		dataMap.put(AuditConstants.UDF5, auditData.getUDF5());
		dataMap.put(AuditConstants.UDF6, auditData.getUDF6());
		dataMap.put(AuditConstants.UDF7, auditData.getUDF7());
		dataMap.put(AuditConstants.UDF8, auditData.getUDF8());
		dataMap.put(AuditConstants.UDF9, auditData.getUDF9());
		dataMap.put(AuditConstants.UDF10, auditData.getUDF10());

		// Now execute the query.
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(AuditConstants.AUDIT_HANDLER_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setOperationExtension(AuditConstants.AUDIT_EXT_META_DATA);
			dbRequest.setData(dataMap);

			dbRequest.execute();
			logger.ctdebug("CTAUD00147");
		} catch (DatabaseException dbException)
		{
			logException(dbException, "AUD009");
			throw dbException;
		} finally
		{
			logger.ctinfo("CTAUD00148");
		}
	}

	/**
	 * Methode retrives the audit data based on the audit id.
	 * 
	 * @ returns LIST.(auidt data)
	 * 
	 * @param auditId
	 * @throws DatabaseException
	 */

	protected AuditData selectAuditData(String auditId) throws DatabaseException
	{
		List auditDataList = null;
		AuditData auditData = null;
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		try
		{
			logger.ctinfo("CTAUD00149", auditId);
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AuditConstants.AUDIT_HANDLER_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AuditConstants.AUDIT_EXT_DATA);
			databaseRequest.addFilter(AuditConstants.AUDIT_ID, String.valueOf(auditId));
			databaseResult = databaseRequest.execute();
			auditDataList = databaseResult.getReturnedList();
			if (!auditDataList.isEmpty())
			{
				auditData = (AuditData) auditDataList.get(0);
			}
			return auditData;
		} catch (DatabaseException dbException)
		{
			logException(dbException, "AUD009");
			throw dbException;
		} finally
		{
			logger.ctinfo("CTAUD00150");
		}

	}

	/**
	 * This API fetches the Audit Data for the given Event Id and Transaction reference number
	 * 
	 * @param eventID
	 * @param sTxnRefNo
	 * @return AuditData
	 * @throws DatabaseException
	 */
	public AuditData selectAuditData(Long eventID, String sTxnRefNo) throws DatabaseException
	{
		List auditDataList = null;
		AuditData auditData = null;
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		logger.ctinfo("CTAUD00151", eventID, sTxnRefNo);

		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AuditConstants.AUDIT_HANDLER_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AuditConstants.AUDIT_EXT_DATA_FOR_EVENT_AND_REFERENCE);
			databaseRequest.addFilter(AuditConstants.EVENT_ID, eventID);
			databaseRequest.addFilter(AuditConstants.REFERENCE, sTxnRefNo);
			databaseResult = databaseRequest.execute();
			auditDataList = databaseResult.getReturnedList();
			if (!auditDataList.isEmpty())
			{
				auditData = (AuditData) auditDataList.get(0);
			}
		} catch (DatabaseException dbException)
		{
			logException(dbException, "AUD009");
			throw dbException;
		}
		logger.ctinfo("CTAUD00152", auditData);
		return auditData;

	}

	/**
	 * Methode extract the transaction data audited from the AuditList using the value object.
	 * 
	 * @return String.
	 * @param auditId
	 */
	public String resolveAuditTxnData(String auditId)
	{
		String auditTxnData = null;
		String orgAccNo = null;
		HashMap orgAccNoMap = null;
		StringBuffer strBuf = new StringBuffer(); // concatenates strings using + in a loop
		try
		{
			AuditData auditData = selectAuditData(auditId);
			auditTxnData = auditData.getAuditData();

			auditTxnData = preProcessAuditData(auditTxnData);
			String auditTxnDataList[] = auditTxnData.split(";");
			String finalauditTxnData = "";
			for (int i = 0; i < auditTxnDataList.length; i++)
			{
				String auditTxnDataTxt = auditTxnDataList[i];
				if (auditTxnDataTxt.contains("ACCOUNT_NUM"))
				{
					String accTxt[] = auditTxnDataTxt.split(":");
					String accNo = accTxt[1].replaceAll("\t", "");
					orgAccNoMap = getOrgAccNoMap(accNo);
					orgAccNo = getOrgAccNo(orgAccNoMap, accNo);
					auditTxnDataTxt = accTxt[0] + ":" + orgAccNo;
				}
				// concatenates strings using + in a loop
				// finalauditTxnData = finalauditTxnData + auditTxnDataTxt + ";" ;
				strBuf.append(auditTxnDataTxt).append(";");
				finalauditTxnData = strBuf.toString();
				// concatenates strings using + in a loop
			}
			auditTxnData = finalauditTxnData;

		} catch (DatabaseException exception)
		{
			logException(exception, "AUD006");
		} catch (Exception e)
		{
			logException(e, "AUD006");
		}
		logger.ctdebug("CTAUD00153", auditTxnData);
		return auditTxnData;
	}

	/**
	 * This method checks with the Audit framework on parsing the audit data and giving it in a linear form that can be
	 * rendered in the current manner
	 * 
	 * @param auditData The audit content from audit repository
	 * @return String The processed audit content
	 * @throws AuditHandlerException thrown if any error occurs while processing the audit content
	 */
	private String preProcessAuditData(String auditData) throws AuditHandlerException
	{
		AuditDataConfiguration config = AuditDataConfiguration.getInstance();
		Map<String, Object> processedAudit = config.parseAuditContent(auditData, ParseOutputFormat.FIELDS_LIST,
				ParseOutputMode.OLD_AND_NEW_VALUES);
		StringBuffer processedBuffer = new StringBuffer();
		if (processedAudit == null || processedAudit.size() == 0)
		{
			processedBuffer.append(auditData);
		} else if (processedAudit.containsKey("UNPARSED_CONTENT"))
		{
			// If the data could not be parsed, then the current audit data is in the old audit format.
			// Use it as it is.
			processedBuffer.append(auditData);
		} else
		{
			ArrayList<String> oldValuesList = (ArrayList<String>) processedAudit.get("OLD_VALUES");
			ArrayList<String> newValuesList = (ArrayList<String>) processedAudit.get("NEW_VALUES");
			boolean oldValuesPresent = checkOldValuesPresent(oldValuesList);
			String oldPrefix = AuditConstants.EVENT_PROP_READER.retrieveProperty("PREFIX_OLD") + " ";
			String newPrefix = AuditConstants.EVENT_PROP_READER.retrieveProperty("PREFIX_NEW") + " ";
			String fieldDelimiter = AuditConstants.EVENT_PROP_READER.retrieveProperty("FORMAT_NEXT_FIELD_DELIMITER");
			String anOldValue;
			String aNewValue;
			// No need to add the prefix in case it is found that the old values are empty
			if (!oldValuesPresent)
				newPrefix = "";
			for (int count = 0; count < newValuesList.size(); count++)
			{
				if (oldValuesPresent)
				{
					// Safety check
					anOldValue = (count < oldValuesList.size()) ? oldValuesList.get(count) : "";
					if (anOldValue != null && !"".equals(anOldValue))
					{
						// If there is no field delimiter, could be due to the fact that this is a map, or due to fact
						// that this is a list of values.
						if (anOldValue.indexOf(":") == -1)
							anOldValue = "Item :\t" + anOldValue;
						processedBuffer.append(oldPrefix + anOldValue + fieldDelimiter);
					}
				}
				aNewValue = newValuesList.get(count);
				if (!StringUtils.isEmpty(aNewValue))
				{
					if (aNewValue.startsWith("*"))
						aNewValue = aNewValue.substring(1);
					// If there is no field delimiter, could be due to the fact that this is a map, or due to fact that
					// this is a list of values.
					if (aNewValue.indexOf(":") == -1)
						aNewValue = "Item :\t" + aNewValue;
					processedBuffer.append(newPrefix + aNewValue + fieldDelimiter);
				}
			}
		}
		return processedBuffer.toString();
	}

	/**
	 * Helper method to check if there were any old values
	 * 
	 * @param oldValuesList
	 * @return true if there are no old values
	 */
	private boolean checkOldValuesPresent(ArrayList<String> oldValuesList)
	{
		// Old values are present if any of the strings is not empty. So check for the same.
		ArrayList<String> temp = new ArrayList<String>();
		temp.addAll(oldValuesList);
		ArrayList<String> removeList = new ArrayList<String>();
		removeList.add("");
		temp.removeAll(removeList);
		return temp.size() > 0;
	}

	/**
	 * Methode extract the meta data audited from the AuditList using the value object.
	 * 
	 * @return String.
	 * @param auditId
	 */
	public String resolveAuditMetadata(String auditId)
	{
		String auditMetaData = null;
		try
		{
			AuditData auditData = selectAuditData(auditId);
			auditMetaData = auditData.toString();
		} catch (DatabaseException exception)
		{
			logException(exception, "AUD006");
		}
		logger.ctdebug("CTAUD00154", auditMetaData);
		return auditMetaData;
	}

	/**
	 * Helper method to log the exception
	 * 
	 * @param ex The exception to be logged
	 * @param errorCode The error code to
	 */
	private void logException(Exception ex, String errorCode)
	{
		logger.cterror("CTAUD00155", ex, ex.getMessage(), mReader.retrieveProperty(errorCode));
	}

	/**
	 * method to get the orgaccNoMap
	 * 
	 * @return HashMap
	 * @param AccNo
	 * @throws Exception
	 * 
	 */
	public HashMap getOrgAccNoMap(String AccNo) throws Exception
	{
		String cmName = "AuditHandlerInstruction::getorgaccNoMap";
		/*
		 * PreparedStatement ps = null; ResultSet rs = null; String strQuery = null; Connection con = null;
		 */

		DatabaseRequest databaseRequest = null;
		HashMap orgAccNoMap = new HashMap();
		HashMap accMap = new HashMap();
		String portalAccId = null;
		String orgAccNo = null;
		try
		{
			/*
			 * con = getConnection(); strQuery=
			 * "SELECT OD_ACC_NO, OD_PORTAL_ACC_ID  FROM OD_PORTAL_ACCT_MASTER_VW  WHERE OD_PORTAL_ACC_ID = ?  "; ps =
			 * con.prepareStatement(strQuery); ps.setString(1,AccNo); rs = ps.executeQuery(); if(rs.next()){ portalAccId
			 * = rs.getString("OD_PORTAL_ACC_ID"); orgaccNo = rs.getString("OD_ACC_NO"); orgaccNo = (orgaccNo == null ||
			 * orgaccNo == "")? portalAccId : orgaccNo; orgaccNoMap.put(portalAccId,orgaccNo); }
			 */

			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AuditConstants.AUDIT_HANDLER_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AuditConstants.AUDIT_EXT_GET_ORG_ACC_NO);
			databaseRequest.addFilter(AuditConstants.OD_PORTAL_ACC_ID, AccNo);
			List orgList = databaseRequest.execute().getReturnedList();
			Iterator itr = orgList.iterator();
			if (!orgList.isEmpty())
			{
				while (itr.hasNext())
				{
					accMap = (HashMap) itr.next();
					portalAccId = (String) accMap.get("OD_PORTAL_ACC_ID");
					orgAccNo = (String) accMap.get("OD_ACC_NO");
					orgAccNo = (orgAccNo == null || orgAccNo == "") ? portalAccId : orgAccNo;
					orgAccNoMap.put(portalAccId, orgAccNo);
				}
			}

		} catch (Exception e)
		{
			logger.cterror("CTAUD00157", e, cmName);
			throw e;
		}
		return orgAccNoMap;
	}

	/**
	 * method to get the orgaccNo
	 * 
	 * @return orgaccNo
	 * @param accNo
	 * @param orgaccNoMap
	 * @throws Exception
	 */
	public String getOrgAccNo(HashMap orgaccNoMap, String accNo)
	{
		String cmName = "CorpUserData::getorgaccNo";
		String orgAccNo = null;
		try
		{
			orgAccNo = (String) orgaccNoMap.get(accNo);
			if (orgAccNo == null)
				orgAccNo = accNo;
		} catch (Exception e)
		{
			logger.cterror("CTAUD00156", e, cmName);
			orgAccNo = accNo;
		}
		return orgAccNo;
	}

	private static PropertyReader mReader = new PropertyReader("CTevent_properties");// Renaming Property File
}
