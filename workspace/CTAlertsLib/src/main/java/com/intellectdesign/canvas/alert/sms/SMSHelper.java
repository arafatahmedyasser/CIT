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

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;

/**
 * This class contains methods to update SMS Delivery Status, to archive the delivered sms and to delete the delivery failure messages.
 * 
 * @version 1.0
 */
public class SMSHelper
{

	/**
	 * This method is responsible to move the successfully delivered sms to SMS History table OD_UNDELIVERED_ALERTS_HB
	 * 
	 * @param dataMap - Hashmap of the SMS Data that contains the delivered SMS
	 * 
	 */
	public void updateDeliverySuccess(HashMap dataMap)
	{
		String cmName = "SMSHelper.updateDeliverySuccess()";
		logger.ctinfo("CTALT00402", cmName);
		DatabaseRequest databaseRequest = null;

		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.SMS_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.UPDATE);
			databaseRequest.setOperationExtension(AlertConstants.SMS_MOVE_HISTORY);
			databaseRequest.setData(dataMap);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00420", dbEx, dataMap.get(AlertConstants.OD_REF_ID));
		}
		logger.ctinfo(cmName, "CTALT00421");
	}

	/**
	 * This method updates the Retry Count by one to indicate the SMS delivery failure status of an SMS Reference Id  
	 * 
	 * @param refNo - String value of the SMS which failed to deliver.
	 * 
	 */

	public void updateDeliveryFailure(String refNo) throws DatabaseException
	{
		logger.ctdebug("CTALT00425");

		HashMap inputData = new HashMap();
		inputData.put("OD_REF_ID", refNo);

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;

		dbRequest.setDataAccessMapKey("SMS_FRMWRK_MNT_UPDATE_SMS_FAIL_STATUS");
		dbRequest.setOperation(DatabaseConstants.UPDATE);
		dbRequest.setData(inputData);
		dbResult = dbRequest.execute();
		int rowsUpdated = dbResult.getNoOfRowsAffected();
		logger.ctdebug("CTALT00426", "" + rowsUpdated);
	}

	/**
	 * This method deletes the SMS those are delivery failed or pending.   
	 * 
	 * @param refNo - String value of the SMS Reference No
	 *  
	 */

	public void updateDeliveryPending(String refNo)
	{

		String cmName = "SMSHelper.updateDeliveryHistory()";
		logger.ctinfo("CTALT00961", cmName);
		DatabaseRequest databaseRequest = null;

		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.SMS_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.DELETE);
			databaseRequest.setOperationExtension(AlertConstants.SMS_EXT_PENDING_UPDATE);
			databaseRequest.addFilter(AlertConstants.OD_REF_ID, refNo);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00428", dbEx, refNo);
		}
		logger.ctinfo("CTALT00960", cmName);
	}

	/**
	 * This method gets the value from the <code>CT.properties</code> file for the Property Key passed as parameter.
	 *  
	 * @param propertyName - String value of the Property Key  
	 * @return null - a <code>null</code> value
	 */

	public static String getString(String propertyName)
	{

		logger.ctdebug("CTALT00429");

		try
		{

			return CTProperties.getProperty(propertyName);

		} catch (Exception exception)
		{
			logger.cterror("CTALT00430", exception, propertyName);
		}

		return null;

	}

	private static Logger logger = Logger.getLogger("deliverylog");
	private final String MAX_MAIL_RETRY = "MAX_MAIL_RETRY";
}
