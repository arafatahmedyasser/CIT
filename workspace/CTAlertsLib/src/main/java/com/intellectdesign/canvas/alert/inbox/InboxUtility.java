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

package com.intellectdesign.canvas.alert.inbox;

import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;
import java.util.regex.PatternSyntaxException;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.handler.Message;
import com.intellectdesign.canvas.alert.handler.Severity;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This is a utility class used within the Inbox channel handler / instruction
 *
 * @version 1.0
 */
public class InboxUtility
{

	/**
	 * This method splits the detailed alert message string into a hashmap of data keys and values for a given
	 * alert.
	 * 
	 * @param sData - String value of the raw data containing keys and values 
	 * as specified in the DETAILED_MESSAGE column in OD_MESSAGE Table 
	 * @param sAlertId - String value of the Alert ID containing the datakey 
	 * @param sLocale - String value of the locale ID of User No.
	 * @return hmDataMap - HashMap containing datakeys and data values with placeholders \
	 * 
	 */
	public HashMap<String, String> formDataMap(String sData, String sAlertId, String sLocale)
	{
		logger.ctinfo("CTALT00337");
		HashMap<String, String> hmDataMap = null;
		logger.ctdebug("CTALT00338", sData, sAlertId, sLocale);

		String sAssignmentKey = prptReader.retrieveProperty(AlertConstants.ASSIGNMENT_KEY);
		String sDelimiterKey = prptReader.retrieveProperty(AlertConstants.DELIMITER_KEY);
		sDelimiterKey = sDelimiterKey.trim();
		sAssignmentKey = sAssignmentKey.trim();
		if (sData == null || sData.length() == 0 || sData.indexOf(sAssignmentKey) == -1)
			return null;
		else
		{
			hmDataMap = new HashMap<String, String>();
			List<HashMap<String, String>> listDataKeys = null;
			// Get the alert data keys for the given alert id from the cache
			List listCachedDataKeys = CacheManager.getFWInstance().getDataFromCache(null,
					AlertConstants.ALERT_DATA_KEYS);
			if (listCachedDataKeys != null && listCachedDataKeys.size() > 0)
			{
				HashMap alertDataKeyMap = (HashMap) listCachedDataKeys.get(0);
				logger.ctdebug("CTALT00339", alertDataKeyMap);
				listDataKeys = (List) alertDataKeyMap.get(sAlertId);
			}
			if (listDataKeys != null && listDataKeys.size() > 0)
			{
				HashMap<String, String> listTempMap = null;
				String aKey;
				logger.ctdebug("CTALT00340", listDataKeys);
				int listDataKeySize = listDataKeys.size();
				String dataValue;
				// Split the sData into a Map and pull out only the data keys
				// that are configured against the Alert.
				HashMap<String, String> dataMap = splitDetailMessage(sData, sAssignmentKey, sDelimiterKey);

				// Loop through the data keys and check if same is available in
				// detail message. If yes copy to output map.
				for (int i = 0; i < listDataKeySize; i++)
				{
					listTempMap = listDataKeys.get(i);
					aKey = listTempMap.get(AlertConstants.DATA_KEY);
					if (dataMap.containsKey(aKey))
					{
						dataValue = dataMap.get(aKey);
						// Check if it needs translation, then handle the same
						if ("Y".equals(listTempMap.get(AlertConstants.INTERPRET_AS_KEY_FLAG)))
						{
							// If datakey's value to be interpreted as a flag this value
							// to be taken from the respective bundle
							hmDataMap.put(aKey, MessageManager.getMessage(
									listTempMap.get(AlertConstants.RESOURCE_BUNDLE_NAME), "LBL_" + dataValue, sLocale));
						} else
						{
							// Otherwise associate this datavalue with corresponding key
							hmDataMap.put(aKey, dataValue);
						}
					} else
					{
						hmDataMap.put(listTempMap.get(AlertConstants.DATA_KEY), "NA");
						logger.ctdebug("CTALT00341");
					}
				}

			}
		}
		logger.ctdebug("CTALT00342", hmDataMap);
		logger.ctinfo("CTALT00343");
		return hmDataMap;
	}

	/**
	 * This method splits the detailed string message into a map containing datakey and its value.
	 * 
	 * @param sData - String value Detailed message data.
	 * @param sAssignmentKey  - String value of the Assignment value to identify a datakey and its value in detailed message.
	 * @param sDelimiterKey  - String value of the Delimiter to identify a datakey-value pair in detailed message.
	 * @return retVal - Hashmap of datakey and value pairs.
	 */
	private HashMap<String, String> splitDetailMessage(String sData, String sAssignmentKey, String sDelimiterKey)
	{
		logger.ctinfo("CTALT00344");
		HashMap<String, String> retVal = new HashMap<String, String>();
		StringTokenizer st = new StringTokenizer(sData, sDelimiterKey);
		try
		{
			while (st.hasMoreTokens())
			{
				String[] pair = st.nextToken().split(sAssignmentKey);
				if (pair.length == 2)
				{
					retVal.put(pair[0], pair[1]);
				} else if (pair.length == 1)
				{
					retVal.put(pair[0], "");
				}
			}
		} catch (PatternSyntaxException psEx)
		{
			logger.cterror("CTALT00345", psEx);
		}

		logger.ctinfo("CTALT00346");
		return retVal;
	}

	/**
	 * This method return a hashmap containing the message based on the FORMATTED_MSG_FLAG
	 * 
	 * @param hmMessageDetails
	 * @param sLocale
	 * @param sChannelName
	 * @return HashMap
	 */

	public HashMap formMessage(HashMap hmMessageDetails, String sLocale, String sChannelName)
	{
		if (!"Y".equals((hmMessageDetails.get(AlertConstants.FORMATTED_MSG_FLAG))))
		{
			// This means that the message is not formatted. Hence calling the formatMessage method to get the formatted
			// short and detailed messages
			Message message = new Message();
			message.formatMessage((String) hmMessageDetails.get(AlertConstants.DETAILED_MESSAGE),
					(String) hmMessageDetails.get(AlertConstants.ALERT_ID), sChannelName, sLocale);

			hmMessageDetails.put(AlertConstants.DETAILED_MESSAGE, message.getDetailedMessage());
			hmMessageDetails.put(AlertConstants.SHORT_MESSAGE, message.getShortMessage());
		}
		return hmMessageDetails;
	}

	/**
	 * This method converts the hashmap of message to message object for the inbox channel using  
	 * 
	 * @param message - Message object which should be converted
	 * @param hmMessageDetails - Hashmap of the message data
	 * @param sLocale - String value of the user Locale Id
	 * @param sChannelName - String value of the Alert Channel Id
	 * @return Message - Message object that contains the alert message data
	 */
	public Message formMessage(Message message, HashMap hmMessageDetails, String sLocale, String sChannelName)
	{
		logger.ctinfo("CTALT00347");
		message = new Message();
		logger.ctdebug("CTALT00348", hmMessageDetails);
		message.setAlertId((String) hmMessageDetails.get(AlertConstants.ALERT_ID));
		message.setDuration((String) hmMessageDetails.get(AlertConstants.STR_MESSAGE_DURATION));
		message.setMessageId((String) hmMessageDetails.get(AlertConstants.MESSAGE_ID));
		message.setChannelName(sChannelName);
		if ("Y".equals((hmMessageDetails.get(AlertConstants.FORMATTED_MSG_FLAG))))
		{
			message.setShortMessage((String) hmMessageDetails.get(AlertConstants.SHORT_MESSAGE));
			message.setDetailedMessage((String) hmMessageDetails.get(AlertConstants.DETAILED_MESSAGE));
		} else
		{
			// This means that the message is not formatted. Hence calling the formatMessage method to get the formatted
			// short and detailed messages
			message.formatMessage((String) hmMessageDetails.get(AlertConstants.DETAILED_MESSAGE), sLocale);
		}
		message.setSender((String) hmMessageDetails.get(AlertConstants.FROM_USER_ID));

		message.setDraft("Y".equals(hmMessageDetails.get(AlertConstants.DRAFT_INDICATOR)));
		message.setStrMessageTimeStamp((String) hmMessageDetails.get(AlertConstants.STR_MESSAGE_TS));
		message.setFormatted("Y".equals(hmMessageDetails.get(AlertConstants.FORMATTED_MSG_FLAG)));
		message.setArchived("Y".equals(hmMessageDetails.get(AlertConstants.ARCHIVED_INDICATOR)));
		message.setRead("Y".equals(hmMessageDetails.get(AlertConstants.READ_INDICATOR)));
		message.setDeleted("Y".equals(hmMessageDetails.get(AlertConstants.DELETED)));
		message.setAssociatedActionCompleted("Y".equals(hmMessageDetails.get(AlertConstants.ACTIONED_INDICATOR)));
		message.setNotified("Y".equals(hmMessageDetails.get(AlertConstants.IS_NOTIFICATION)));

		message.setSubProdCode((String) hmMessageDetails.get(AlertConstants.SUB_PRODUCT_CODE));
		// Evaluate the severity
		Severity msgSeverity = Severity.evaluate((String) hmMessageDetails.get(AlertConstants.SEVERITY));
		// In case there was no match, then always stamp it as Low.
		if (msgSeverity == null)
			msgSeverity = Severity.LOW;
		message.setSeverity(msgSeverity);
		message.setProductCode((String) hmMessageDetails.get(AlertConstants.PRODUCT_CODE));
		message.setProductDispval((String) hmMessageDetails.get(AlertConstants.SUB_PRODUCT_CODE_DISPVAL));
		message.setSubProdCode((String) hmMessageDetails.get(AlertConstants.SUB_PRODUCT_CODE));
		message.setFunctionCode((String) hmMessageDetails.get(AlertConstants.FUNCTION_CODE));

		// Add the Enrich set of fields
		message.setEnrichBankName((String) hmMessageDetails.get(AlertConstants.KEY_ENRICH_BANK_NAME));
		message.setEnrichBranchName((String) hmMessageDetails.get(AlertConstants.KEY_ENRICH_BRANCH_NAME));
		message.setEnrichCcy((String) hmMessageDetails.get(AlertConstants.KEY_ENRICH_CCY));
		message.setEnrichCountryName((String) hmMessageDetails.get(AlertConstants.KEY_ENRICH_COUNTRY_NAME));
		message.setEnrichSubProduct((String) hmMessageDetails.get(AlertConstants.KEY_ENRICH_SUBPROD_DESC));
		message.setHasAttachment((String) hmMessageDetails.get(AlertConstants.KEY_HAS_ATTACHMENT));
		logger.ctdebug("CTALT00349", message);
		logger.ctinfo("CTALT00350");
		return message;
	}

	private static final Logger logger = Logger.getLogger(InboxUtility.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
}
