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

package com.intellectdesign.canvas.report.queue.listener;

import javax.ejb.EJBException;
import javax.ejb.MessageDrivenBean;
import javax.ejb.MessageDrivenContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.queue.AsyncReportQueue;
import com.intellectdesign.canvas.report.queue.IReportQueue;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportStatus;
import com.intellectdesign.canvas.report.util.ReportUtil;

/**
 * @MessageDriven(mappedName="InfoReportsMessageListener" ,activationConfig = {
 * 
 * @ActivationConfigProperty(propertyName = "messagingType", propertyValue = "javax.jms.MessageListener"),
 * 
 * @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge"),
 * 
 * @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
 * 
 * @ActivationConfigProperty(propertyName = "destination", propertyValue = "queue/ASYNC_REPORT_QUEUE") })
 */
/**
 * The listener class for Asynchronous communication(ASYNC_QUEUE)
 * 
 * @version 1.0
 */

public class InfoReportsAsyncMessageListener implements MessageDrivenBean, MessageListener
{

	private static final long serialVersionUID = -162533083041974499L;

	/**
	 * This method is called asynchronously by JMS when a message arrives at the queue.
	 * 
	 * @param message
	 */
	@Override
	public void onMessage(Message message)
	{
		final String cmName = "InfoReportsAsyncMessageListener.onMessage";
		LOGGER.ctinfo("CTREP00576", cmName);
		TextMessage textMessage = null;
		String jmsCorrelationID = null;
		try
		{
			if (message != null && message instanceof TextMessage)
			{
				// gets the ReportRequest from the Sync Queue
				IReportQueue reportQueue = new AsyncReportQueue();
				// gets the ReportRequest from the Sync Queue
				textMessage = (TextMessage) message;
				jmsCorrelationID = textMessage.getJMSCorrelationID();
				LOGGER.ctdebug("CTREP00582", cmName, textMessage.getText());
				reportQueue.messageReceiver(textMessage.getText());

			}
		} catch (JMSException jmsException)
		{
			LOGGER.cterror("CTREP00581", jmsException, cmName);
			try
			{
				if (jmsCorrelationID != null)
				{
					ReportUtil reportUtil = new ReportUtil();
					reportUtil.updateReportInstanceStatus(jmsCorrelationID, ReportStatus.FAILED,
							ReportConstants.ERR_JMS_RPT_GET, ReportUtil.getMessage(ReportConstants.ERR_JMS_RPT_GET));
				}
			} catch (ReportingException reportingException)
			{
				LOGGER.cterror("CTREP00580", reportingException, cmName);
			}
		} catch (ReportingException reportingException)
		{
			LOGGER.cterror("CTREP00579", reportingException, cmName);
			try
			{
				if (jmsCorrelationID != null)
				{
					ReportUtil reportUtil = new ReportUtil();
					reportUtil.updateReportInstanceStatus(jmsCorrelationID, ReportStatus.FAILED,
							ReportConstants.ERR_JMS_RPT_GET, ReportUtil.getMessage(ReportConstants.ERR_JMS_RPT_GET));
				}
			} catch (ReportingException re)
			{
				LOGGER.cterror("CTREP00578", re, cmName);
			}
		}
		LOGGER.ctinfo("CTREP00577", cmName);
	}

	// instantiating the logger object.
	private Logger LOGGER = Logger.getLogger(InfoReportsAsyncMessageListener.class);

	@Override
	/**
	 * 
	 * @throws EJBException
	 * @see javax.ejb.MessageDrivenBean#ejbRemove()
	 */
	public void ejbRemove() throws EJBException
	{

	}

	@Override
	/**
	 * 
	 * @param pMessageDrivenContext
	 * @throws EJBException
	 * @see javax.ejb.MessageDrivenBean#setMessageDrivenContext(javax.ejb.MessageDrivenContext)
	 */
	public void setMessageDrivenContext(MessageDrivenContext pMessageDrivenContext) throws EJBException
	{

	}

	/**
	 * @throws EJBException
	 */
	public void ejbCreate() throws EJBException
	{
	}

}
