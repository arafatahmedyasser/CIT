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
 */
package com.intellectdesign.canvas.report.vo;

import com.intellectdesign.canvas.alert.handler.IChannelHandler;
import com.intellectdesign.canvas.common.IBaseDefinition;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.notification.handler.ReportNotificationChannelHandlerFactory;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * this is a class ReportNotification implements IBaseDefinition
 * 
 * @version 1.0
 */
public class ReportNotification implements IBaseDefinition
{

	private static final long serialVersionUID = 5140417562392734199L;
	/**
	 * The notification id for the report instance generated.
	 */
	private String notificationId;
	/**
	 * the notification name for the report instance generated.
	 */
	private String notificationName;
	/**
	 * the notification handler class for the report instance generated.
	 */
	private String notificationHandlerClass;

	@Override
	/**
	 * 
	 * @return String null
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return null;
	}

	/**
	 * gets the notification id for the report instance generated.
	 * 
	 * @return notificationId.
	 */
	public String getNotificationId()
	{
		return notificationId;
	}

	/**
	 * sets the notificationId for the report instance generated.
	 * 
	 * @param notificationId The unique id for the notification.
	 */
	public void setNotificationId(String notificationId)
	{
		this.notificationId = notificationId;
	}

	/**
	 * gets the notification name for the report instance generated.
	 * 
	 * @return notificationName for the report instance generated.
	 */
	public String getNotificationName()
	{
		return notificationName;
	}

	/**
	 * sets the notification name for the report instance generated.
	 * 
	 * @param notificationName for the report instance generated.
	 */
	public void setNotificationName(String notificationName)
	{
		this.notificationName = notificationName;
	}

	/**
	 * gets the notification handler class for the report instance generated.
	 * 
	 * @return the notification handler class for the report instance generated.
	 */
	public String getNotificationHandlerClass()
	{
		return notificationHandlerClass;
	}

	/**
	 * sets the notitificaton handler class name for the report instance generated.
	 * 
	 * @param notificationHandlerClass for the report instance generated.
	 */
	public void setNotificationHandlerClass(String notificationHandlerClass)
	{
		this.notificationHandlerClass = notificationHandlerClass;
	}

	/**
	 * Helper method to get the an instance of the class of the type IChannelHandler using a factory.
	 * 
	 * @return IChannelHandler an instance of the type IChannelHandler
	 * @throws ReportingException for any exception occured.
	 */
	public final IChannelHandler getChannelHandler() throws ReportingException
	{
		LOGGER.ctinfo("CTREP00562");
		IChannelHandler channelHandler = null;
		try
		{
			if (notificationHandlerClass != null)
			{
				ReportNotificationChannelHandlerFactory reportNotificationChannelHandlerFactory = ReportNotificationChannelHandlerFactory
						.getInstance();
				channelHandler = reportNotificationChannelHandlerFactory
						.getNotificationChannelHandler(notificationHandlerClass);
			}
		} catch (Exception e)
		{
			LOGGER.cterror("CTREP00057", e);
			throw new ReportingException(ReportConstants.ERR_CD_REP_NOTI_GET_CHNL_HANDL, e);
		}

		LOGGER.ctinfo("CTREP00563");
		return channelHandler;

	}

	/**
	 * private Logger instance.
	 */
	private static Logger LOGGER = Logger.getLogger(ReportNotification.class);
}
