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

import java.util.Map;

import com.intellectdesign.canvas.event.handler.IData;

/**
 * This class contains the setter and getter methods for handling the AlertDataKey of an alert id.  
 * 
 * The alert data keys for alert and alert Ids are handled in the ALERT_MASTER and ALERT_DATA tables. 
 * 
 * This class implements the canvas IData interface;
 * 
 * @see com.intellectdesign.canvas..handler.IData
 * 
 * 
 * @version 1.0
 */
public class AlertData implements IData
{

	/**
	 * This is an internal constant for serialization purposes
	 * 
	 */
	private static final long serialVersionUID = -4510956434508828750L;

	/**
	 * This method is responsible for getting the hasmap of the AlertData 
	 * 
	 * @return mapAlertData HashMap of AlertData
	 */
	public Map getAlertData()
	{
		return mapAlertData;
	}

	/**
	 * This method is responsible for setting Hashmap of AlertData
	 * 
	 * @param mapAlertData Hashmap of AlertData to set
	 */

	public void setAlertData(Map mapAlertData)
	{
		this.mapAlertData = mapAlertData;
	}

	private Map mapAlertData = null;

}
