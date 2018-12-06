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

package com.intellectdesign.canvas.alert.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.alert.inbox.InboxMessageRecipient;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This class is used to test ChannelHandler and also extends GenericChannelHandler
 * 
 * @version 1.0
 */
public class TestChannelHandler extends GenericChannelHandler
{

	/**
	 * Method to get the RecipientsInfoFromDB
	 * 
	 * @param listUserIDs
	 * @throws AlertHandlerException
	 * @return ArrayList of Recipients details
	 */

	protected ArrayList getRecipientsInfoFromDB(ArrayList listUserIDs) throws AlertHandlerException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listRecipients = null;
		ArrayList alistRecipients = null;
		InboxMessageRecipient inboxMessageRecipient = null;
		HashMap hmRecipientDetails = null;
		logger.ctinfo("CTALT00159");
		for (int i = 0; i < listUserIDs.size(); i++)
		{
			try
			{
				// Go to the DB and fetch all the Recipients details
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.SELECT);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_RECIPIENT_DTLS);
				databaseRequest.addFilter(AlertConstants.USER_ID, listUserIDs.get(i));
				databaseResult = databaseRequest.execute();
				listRecipients = databaseResult.getReturnedList();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00160", dbEx, listUserIDs.get(i));
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
			}
		}
		logger.ctdebug("CTALT00161", listRecipients);
		// If the array list of recipients is null, throw exception
		if (listRecipients != null && !listRecipients.isEmpty())
		{
			alistRecipients = new ArrayList();
			for (int i = 0; i < listRecipients.size(); i++)
			{
				hmRecipientDetails = (HashMap) listRecipients.get(i);
				logger.ctdebug("CTALT00162", hmRecipientDetails);
				inboxMessageRecipient = new InboxMessageRecipient();
				inboxMessageRecipient.setUserId((String) hmRecipientDetails.get(AlertConstants.USER_ID));
				inboxMessageRecipient.setGcif((String) hmRecipientDetails.get(AlertConstants.GCIF));
				alistRecipients.add(inboxMessageRecipient);
			}
		} else
		{
			logger.cterror("CTALT00163");
			throw new AlertHandlerException(AlertConstants.ERR_RECIPIENTS_NULL,
					prptReader.retrieveProperty(AlertConstants.ERR_RECIPIENTS_NULL));
		}
		logger.ctdebug("CTALT00164", alistRecipients);
		logger.ctinfo("CTALT00165");
		return alistRecipients;
	}

	/**
	 * Method to send the message (single recipient)
	 * 
	 * @param msg
	 * @param recipient
	 * @param sSender
	 * @param sAlertId
	 * @return void
	 * @throws AlertHandlerException
	 * 
	 */

	protected void send(IMessage msg, IRecipient recipient, String sSender, String sAlertId)
			throws AlertHandlerException
	{
		logger.ctinfo("CTALT00166");
		logger.ctdebug("CTALT00167");
		logger.ctinfo("CTALT00168");

	}

	/**
	 * Method to send the message (multiple recipient)
	 * 
	 * @param msg
	 * @param listRecipients
	 * @param sSender
	 * @param sAlertId
	 * @return void
	 * @throws AlertHandlerException
	 * 
	 */

	protected void send(IMessage msg, ArrayList listRecipients, String sSender, String sAlertId)
			throws AlertHandlerException
	{
		logger.ctinfo("CTALT00169");
		logger.ctdebug("CTALT00170");
		logger.ctinfo("CTALT00171");

	}

	private static final Logger logger = Logger.getLogger(TestChannelHandler.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;

	@Override
	/**
	 * Method to post the message 
	 * @param event
	 * @param AlertDetail
	 * @param DataMap
	 * @return void
	 * @throws AlertHandlerException
	 * 
	 */
	public void postMessage(Event event, AlertDetail alertDetails, Map DataMap) throws AlertHandlerException
	{

	}

}
