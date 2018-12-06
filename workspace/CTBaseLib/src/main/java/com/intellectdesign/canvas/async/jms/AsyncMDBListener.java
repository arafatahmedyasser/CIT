/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.async.jms;

import javax.ejb.EJBException;
import javax.ejb.MessageDrivenBean;
import javax.ejb.MessageDrivenContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;

import com.intellectdesign.canvas.async.AsyncExecutorException;
import com.intellectdesign.canvas.async.AsyncJob;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the MDB that can be registered against the queue that corresponds to the configuration of an
 * JMSAsyncExecutorSetup.
 * 
 * @Version 15.1
 */
public class AsyncMDBListener implements MessageDrivenBean, MessageListener
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -9045076413920214371L;
	/**
	 * The Logger instance for this class.
	 */
	private static Logger LOGGER = Logger.getLogger(AsyncMDBListener.class);

	@SuppressWarnings("unused")
	private MessageDrivenContext context;

	/**
	 * Default constructor.
	 */
	public AsyncMDBListener()
	{
		// Nothing to do here
	}

	/**
	 * This is the entry point for the processing of the message. The message is an ObjectMessage that contains the
	 * AsyncJob. This triggers the execution of the job.
	 * 
	 * Key point to note is that this does not provide any transaction boundary. So if the Job requires any transaction
	 * boundary, it should look to create one as appropriate
	 * 
	 * @param aMessage The message received
	 * @see javax.jms.MessageListener#onMessage(javax.jms.Message)
	 */
	@Override
	public void onMessage(Message aMessage)
	{
		AsyncJob jobToExecute = null;

		try
		{
			// Step 1: Retrive the Job.
			jobToExecute = retrieveJobFrom(aMessage);
			// Step 2: Trigger the execution of the Job
			if (jobToExecute != null)
				jobToExecute.execute();
		} catch (AsyncExecutorException e)
		{
			// No propagation of exceptions possible. So eat the same and log it
			LOGGER.cterror("CTBAS00099", e);
		} catch (JMSException e)
		{
			// No propagation of exceptions possible. So eat the same and log it
			LOGGER.cterror("CTBAS00100", e);
		} finally
		{
			// Step 3: Acknowledge the completion of the Job (even if an exception is raised during the job processing).
			try
			{
				aMessage.acknowledge();
			} catch (JMSException e)
			{
				LOGGER.cterror("CTBAS00101", e);
			}
		}
	}

	/**
	 * Helper method that retrieves the Payload AsyncJob from the Message.
	 * 
	 * @param aMessage The message recieved
	 * @return The AsyncJob received as part of the message. Else null.
	 */
	private AsyncJob retrieveJobFrom(Message aMessage) throws JMSException
	{
		// Step 1: Validate that the message is infact an Objectmessage and it has an AsyncJob in it. If not, return
		// null.
		if (aMessage instanceof ObjectMessage)
		{
			ObjectMessage objMessage = (ObjectMessage) aMessage;
			Object payload = objMessage.getObject();
			if (payload instanceof AsyncJob)
				return (AsyncJob) payload;
			else
				return null;
		} else
		{
			return null;
		}
	}

	/**
	 * @throws EJBException
	 * @see javax.ejb.MessageDrivenBean#ejbRemove()
	 */
	@Override
	public void ejbRemove() throws EJBException
	{
		// Nothing to do here
	}

	/**
	 * This MDB does not carry any kind of state or initialization. So nothing to do here
	 */
	public void ejbCreate()
	{
		// Nothing to do here
	}

	/**
	 * @param ctx
	 * @throws EJBException
	 * @see javax.ejb.MessageDrivenBean#setMessageDrivenContext(javax.ejb.MessageDrivenContext)
	 */
	@Override
	public void setMessageDrivenContext(MessageDrivenContext ctx) throws EJBException
	{
		// Nothing to do here. We just store the context
		context = ctx;
	}
}
