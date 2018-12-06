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
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for collecting all the alerts to be delivered through SMS Channel.
 * Based on the SMS Deliver state, this class arhives the delivered messages in the History through {@link SMSHelper} 
 *  
 * @version 1.0
 */
public class SMSDeliveryManager
{

	private static final Logger logger = Logger.getLogger(SMSDeliveryManager.class);

	/**
	 * This class is responsible for processing the list of SMS Details
	 * 
	 * @param listSMSDetails list of SMS Details
	 * @return void
	 */
	public void process(List listSMSDetails)
	{
		String cmName = "SMSDeliveryManager.process()";
		logger.ctdebug("CTALT00409");
		String refNo = null;
		String userNo = null;
		String mobileNo = null;
		String msg = null;
		String retryCount = null;

		HashMap hmAlertMap = new HashMap();
		HashMap dataObject = null;
		HashMap requestData = new HashMap();
		logger.ctdebug("CTALT00410", cmName);

		try
		{

			listSMSDetails = retrieveAllSMS();
			logger.ctdebug("CTALT00411", listSMSDetails);
			SMSHelper deliveryhelper = new SMSHelper();

			for (int i = 0; i < listSMSDetails.size(); i++)
			{
				hmAlertMap = (HashMap) listSMSDetails.get(i);
				refNo = (String) hmAlertMap.get(AlertConstants.OD_REF_ID);
				userNo = (String) hmAlertMap.get(AlertConstants.OD_USER_NO);
				mobileNo = (String) hmAlertMap.get(AlertConstants.OD_MOBILE_NO);
				msg = (String) hmAlertMap.get(AlertConstants.OD_LONG_MSG);
				retryCount = (String) hmAlertMap.get(AlertConstants.SMS_RETRY_COUNT);

				requestData.put(AlertConstants.USER_NO, userNo);
				requestData.put(AlertConstants.MOBILE_NO, mobileNo);
				requestData.put(AlertConstants.LANG_CD, AlertConstants.LANG_CODE);
				requestData.put(AlertConstants.SMS_MSG, msg);

				// Variables used for to connect Communicator
				logger.ctdebug("CTALT00412");

				if (dataObject.get(AlertConstants.RES_STATUS) != null)
				{
					if ((AlertConstants.RES_STATUS_VALUE).equals(dataObject.get(AlertConstants.RES_STATUS).toString()))
					{
						if ((AlertConstants.RESULT_CODE_VALUE).equals(dataObject.get(AlertConstants.RESULT_CD_KEY)
								.toString()))
						{
							logger.ctdebug("CTALT00413");
							deliveryhelper.updateDeliverySuccess(hmAlertMap);
							deliveryhelper.updateDeliveryPending(refNo);
						} else
						{
							logger.ctdebug("CTALT00414");
							deliveryhelper.updateDeliveryFailure(refNo);
						}
					} else
					{
						logger.ctdebug("CTALT00415");
						deliveryhelper.updateDeliveryFailure(refNo);
					}
				} else
				{
					logger.ctdebug("CTALT00416");
					deliveryhelper.updateDeliveryFailure(refNo);
				}
			}
		} catch (Exception e)
		{
			logger.cterror("CTALT00417", e);
		}

	}

	/**
	 * This class is responsible for retrieving the list of SMS Details
	 * 
	 * @return List list of SMS Details
	 * @throws DatabaseException
	 */
	public List retrieveAllSMS() throws DatabaseException
	{
		String lsModName = " [SMSDeliveryManager.retrieveAllSMS] ";
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;
		logger.ctdebug("CTALT00410", lsModName);

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
			logger.ctdebug("CTALT00418", dbEx);
			throw dbEx;
		}
		logger.ctdebug(lsModName, "CTALT00419");
		return returnList;
	}

}
