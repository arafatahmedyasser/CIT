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
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.PhraseVariable;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This is an abstract class that models the message formatting. 
 * The class that extends this class should provide implmentation for abstract method 'format' 
 * 
 * @version 1.0
 */
public abstract class MessageFormatter
{

	public abstract IMessage format(HashMap hmData, Event event, AlertDetail alertDetail, String sChannelName,
			String sLocale);

	/**
	 * This method does the following: 
	 * <li> 1. Gets the property file name, the template key and the data hashmap 
	 * <li> 2. Forms an arraylist of PhraseVariable objects 
	 * <li> 3. Calls the getMessage() method of MessageManager class to get 
	 * the readable message after translating the phrasal variables 
	 * <li> 4. Returns the actual mesasge.
	 * 
	 * @param sPropertyFileName String value of the message template property file name 
	 * @param sTemplateKey String value of the message key 
	 * @param sLocale String value of the language locale 
	 * @param hmData Hash Map of the alert event data
	 * 
	 * @return sMessage String value of message in the readable format
	 */
	public String format(String sPropertyFileName, String sTemplateKey, String sLocale, HashMap hmData)
	{
		String sMessage = null;
		List listPhraseVariables = new ArrayList();
		PhraseVariable phraseVariable = null;
		logger.ctinfo("CTALT00123");
		// The Start Place holder - needs to be retrieved from the property file
		String sStartDelimiter = prptReader.retrieveProperty(AlertConstants.MSG_PLACEHOLDER_START_DELIMITER);
		// The End Place holder - needs to be retrieved from the property file
		String sEndDelimiter = prptReader.retrieveProperty(AlertConstants.MSG_PLACEHOLDER_END_DELIMITER);
		logger.ctdebug("CTALT00124", sStartDelimiter, sEndDelimiter);
		// if the hmData is null, there are no keys to replace
		// Otherwise, form PhraseVariable object for each key/value and form an ararylist of all such PhraseVariavles
		if (hmData != null && !hmData.isEmpty())
		{
			Iterator itData = hmData.keySet().iterator();
			String sKey = null;
			while (itData.hasNext())
			{
				sKey = (String) itData.next();
				phraseVariable = new PhraseVariable(sKey, (String) hmData.get(sKey));
				listPhraseVariables.add(phraseVariable);
			}
		}
		// get the actual message which needs to be sent
		sMessage = MessageManager.getMessage(sPropertyFileName, sTemplateKey, sLocale, listPhraseVariables,
				sStartDelimiter, sEndDelimiter);
		logger.ctdebug("CTALT00126", sMessage);
		// logger.log(EXITLevel.EXIT, "Exited from format method");
		logger.ctinfo("CTALT00127");
		return sMessage;
	}

	private static Logger logger = Logger.getLogger(MessageFormatter.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
}
