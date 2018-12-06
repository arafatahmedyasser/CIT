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

package com.intellectdesign.canvas.alert.sms;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.processor.AlertProcessor;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for sending the pending status SMS to the subscribed Users using the {@link AlertProcessor}. 
 *  
 * @version 1.0
 */
public class SMSPostingManager
{

	private static final Logger logger = Logger.getLogger(SMSPostingManager.class);

	/**
	 * This method sends the SMS passed to the list of subscribed users.
	 * 
	 * @param listSMSDetails - List object that contains the Message data as SMS and Subscribed User Mobile Number
	 */

	public void process(List listSMSDetails)
	{
		String cmName = "SMSDeliveryManager.process()";
		logger.ctdebug("CTALT00432");
		String refNo = null;
		String userNo = null;
		String mobileNo = null;
		String msg = null;
		String retryCount = null;

		HashMap hmAlertMap = new HashMap();
		HashMap dataObject = null;
		HashMap requestData = new HashMap();
		logger.ctdebug("CTALT00433", cmName);

		try
		{

			logger.ctdebug("CTALT00434", listSMSDetails);

			for (int i = 0; i < listSMSDetails.size(); i++)
			{
				hmAlertMap = (HashMap) listSMSDetails.get(i);
				refNo = (String) hmAlertMap.get(AlertConstants.OD_REF_ID);
				userNo = (String) hmAlertMap.get(AlertConstants.OD_USER_NO);
				mobileNo = (String) hmAlertMap.get(AlertConstants.OD_MOBILE_NO);
				msg = (String) hmAlertMap.get(AlertConstants.OD_LONG_MSG);
				retryCount = (String) hmAlertMap.get(AlertConstants.SMS_RETRY_COUNT);

				requestData.put(AlertConstants.OD_REF_ID, refNo);
				requestData.put(AlertConstants.USER_NO, userNo);
				requestData.put(AlertConstants.MOBILE_NO, mobileNo);
				requestData.put(AlertConstants.LANG_CD, AlertConstants.LANG_CODE);
				requestData.put(AlertConstants.SMS_MSG, msg);

				// Variables used for to connect Communicator
				logger.ctdebug("CTALT00435");
				logger.ctdebug("CTALT00436");

				AlertProcessor smsProcessor = new AlertProcessor();
				smsProcessor.updateTables(dataObject, refNo, userNo, mobileNo, msg, retryCount);

			}
		} catch (Exception e)
		{
			logger.cterror("CTALT00437", e);
		}

	}

	/**
	 * This class is responsible for retrieving all the pending status SMS 
	 * that are less than the configured SMS Retry Sending value
	 * 
	 * @return List - List object that contains all the delivery pending SMS
	 * 
	 * @throws DatabaseException
	 */
	public List retrieveAllSMS() throws DatabaseException
	{
		String lsModName = " [SMSDeliveryManager.retrieveAllSMS] ";
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;
		logger.ctdebug("CTALT00433", lsModName);

		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(AlertConstants.SMS_FRMWRK_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(AlertConstants.PENDING_SMS_DELIVERED);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();

		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00438", dbEx);
			throw dbEx;
		}
		logger.ctdebug("CTALT00439", lsModName);
		return returnList;
	}

}
