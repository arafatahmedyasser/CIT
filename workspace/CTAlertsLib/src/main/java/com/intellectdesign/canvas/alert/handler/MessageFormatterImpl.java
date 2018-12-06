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

import java.util.HashMap;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;

/** 
 * This class provides the implmentation for the message formatter.
 * This class is responsible for providing the formatted short and detailed messages 
 * as per the definition in the message template property for the event raised.
 *  
 * @version 1.0
 */
public class MessageFormatterImpl extends MessageFormatter
{

	/**
	 * This method formats the raw hashmap of data as the formatted short and detailed message 
	 * as per the format defined in the message template property file.  
	 * 
	 * @param hmData Hashmap of the data that contains the event and alert data 
	 * @param event Event object that contains the events raised
	 * @param alertDetail AlertDetail object that contains the Alert Definitions and Alert Key values
	 * @param sChannelName String value of the channel for which the message must be formatted
	 * @param sLocale String value of the language locale Id
	 * 
	 * @return IMessage serialized IMessage object that contains the formatted Short and Detailed Messages 
	 */
	public IMessage format(HashMap hmData, Event event, AlertDetail alertDetail, String sChannelName, String sLocale)
	{
		logger.ctinfo("CTALT00142");
		Message message = null;
		String sShortMessage = null;
		String sDetailedMessage = null;

		// The key to get the short message template is formed using the Alert Id, Channel Id and the constant
		// AlertConstants.SHORT_DESCRIPTION_TEMPLATE.
		String sShortMsgTemplateKey = new StringBuffer(alertDetail.getAlertId()).append(sChannelName)
				.append(AlertConstants.SHORT_DESCRIPTION_TEMPLATE).toString();
		// The key to get the detailed message template is formed using the Alert Id, Channel Id and the constant
		// AlertConstants.DETAILED_DESCRIPTION_TEMPLATE.
		String sDetailedMsgTemplateKey = new StringBuffer(alertDetail.getAlertId()).append(sChannelName)
				.append(AlertConstants.DETAILED_DESCRIPTION_TEMPLATE).toString();
		logger.ctdebug("CTALT00143", sShortMsgTemplateKey, sDetailedMsgTemplateKey);

		// Get the short message
		sShortMessage = format(sPropertyFileName, sShortMsgTemplateKey, sLocale, hmData);
		// Get the detailed Message
		sDetailedMessage = format(sPropertyFileName, sDetailedMsgTemplateKey, sLocale, hmData);
		logger.ctdebug("CTALT00145", sShortMessage, sDetailedMessage);

		// Form message object
		message = new Message();
		message.setShortMessage(sShortMessage);
		message.setDetailedMessage(sDetailedMessage);

		logger.ctinfo("CTALT00147");
		return message;
	}

	private ConfigurationManager confMngr = ConfigurationManager.getInstance();
	private SystemPreferenceDescriptor sysDscr = confMngr.getSystemPrefDescriptor();

	private static Logger logger = Logger.getLogger(MessageFormatterImpl.class);
	private String sPropertyFileName = sysDscr.getAlertTemplateFile();

}
