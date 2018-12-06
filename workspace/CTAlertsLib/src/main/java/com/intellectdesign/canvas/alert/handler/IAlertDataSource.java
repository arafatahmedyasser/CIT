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

import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.event.Event;

/**
 * This interface provides the option to extend the alert configuration to get the subscribed users and to format the alert data to send alert messages
 */
public interface IAlertDataSource
{
	/**
	 * This method will be invoked by the Alert framework to retrieve the potential list of users to whom the alert
	 * should be sent out. Implementing classes should keep in mind that the framework may decide to use a sub set of
	 * this list based on the alert subscription preferences that each user has setup.
	 * 
	 * @param anEvent Event object to which the alert is linked
	 * @param alertConfig AlertDetail object that contains the alert configuration details
	 * @param eventData HashMap of the event raised and the event data 
	 * 
	 * @return AllTargetRecipients List object of the list of all users to whom the alert should be sent out. 
	 * 
	 * @throws AlertHandlerException Throwable exception if any error occurs while fetching the list of users.
	 */
	List<String> getAllTargetRecipients(Event anEvent, AlertDetail alertConfig, Map eventData)
			throws AlertHandlerException;

	/**
	 * This method will be invoked by the Alert framework to provide an option for the data source to format the alert
	 * data with custom attributes
	 * 
	 * @param anEvent Event object that contains the event raised
	 * @param alertConfig AlertDetail object that contains the alert configuration
	 * @param eventData HashMap of the Alert Data
	 * 
	 * @throws AlertHandlerException Throwable exception if any error occurs while enriching the data.
	 */
	void enrichAlertData(Event anEvent, AlertDetail alertConfig, Map eventData) throws AlertHandlerException;
}
