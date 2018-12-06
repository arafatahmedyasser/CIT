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

import com.intellectdesign.canvas.event.Event;

/**
 * The interface models and encapsulates all processes and objects required for sending alert messages over a channel.
 * 
 * @version 1.0
 */
public interface IChannelHandler
{
	/**
	 * This method is used to send messages through appropriate channel
	 * 
	 * @param event Event object that contains the event raised
	 * @param alertDetail AlertDetail object that contain the alert configuration and alert data
	 * @param hmMsgData Hash map data of the Alert Message
	 *  
	 * @throws AlertHandlerException
	 */
	public void sendMessage(Event event, AlertDetail alertDetail, Map hmMsgData) throws AlertHandlerException;

	/**
	 * This method is used to set the ChannelId
	 * 
	 * @param sChannelId String value of the Channel Id
	 */
	public void setChannelId(String sChannelId);

	/**
	 * This method is used to get the ChannelId
	 * 
	 * @return Channelid String value of the ChannelId
	 */
	public String getChannelId();

	/**
	 * This method is used to set the Channel Name
	 * 
	 * @param sChannelName String value of the channel name
	 */
	public void setChannelName(String sChannelName);

	/**
	 * This method is used to get the Channel Name
	 * 
	 * @return channelName String value of the Channel Name
	 */
	public String getChannelName();

	/**
	 * This method is used to post the alert messages to the appropriate channels 
	 * 	  
	 * @param eventDetails Event object that contains the event details
	 * @param alertDetails AlertDetail object that contain the alert configuration and alert data 
	 * @param alertData Hash map data of the Alert Message
	 * 
	 * @throws AlertHandlerException
	 */
	public void postMessage(Event eventDetails, AlertDetail alertDetails, Map alertData)
			throws AlertHandlerException; // CHCR

}