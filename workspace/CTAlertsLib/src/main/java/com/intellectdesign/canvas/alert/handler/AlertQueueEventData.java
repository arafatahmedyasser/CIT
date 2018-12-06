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

import java.io.Serializable;

import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.handler.IData;

/**
 * AlertQueueEventData is a simple POJO which encapsulate the data needed to update alert related tables. This object
 * will be stored in AlertMessageQueue and will be retrieved later to raise the appropriate event asynchronously.
 *  
 * @version 1.0
 */
public class AlertQueueEventData implements Serializable
{

	/**
	 * to verify that the sender and receiver of a serialized object have loaded classes for that object that are
	 * compatible with respect to serialization
	 */
	private static final long serialVersionUID = -8246473418823193834L;
	private Event mEvent;
	private IData mFormattedData;

	/**
	 * This method returns the event object
	 * 
	 * @return mEvent Event object
	 */
	public Event getMEvent()
	{
		return mEvent;
	}

	/**
	 * This method sets the event object to the event details of the alert 
	 * 
	 * @param mEvent to set
	 */
	public void setMEvent(Event event)
	{
		mEvent = event;
	}

	/**
	 * This method returns the Formatted Event Data 
	 *
	 *@See com.intellectdesign.canvas.event.handler.IData
	 * 
	 * @return MFormattedData IData value of the Event Data
	 */
	public IData getMFormattedData()
	{
		return mFormattedData;
	}

	/**
	 * This method sets the formatted event data to the objects Event Data
	 * 
	 * @See com.intellectdesign.canvas.event.handler.IData
	 * 
	 * @param MFormattedData IData object
	 */
	public void setMFormattedData(IData formattedData)
	{
		mFormattedData = formattedData;
	}
}
