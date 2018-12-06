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
package com.intellectdesign.canvas.async;

import java.util.Arrays;
import java.util.Hashtable;

import javax.jms.JMSException;
import javax.jms.ObjectMessage;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.Session;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is the executor setup that will use JMS as the basis for triggering. This accepts the below configuration for
 * its initialization -
 * <ul>
 * <li><b>initialContextFactory</b>: This is the Initial context factory class that needs to be passed while creating
 * the Initial Context. This is optional if the intent is to create an InitialContext that points to the local server
 * itself.</li>
 * <li><b>jndiURL</b>: This is the JNDI / Provider URL that needs to be passed while creating the Initial Context. This
 * is optional if the intent is to create an InitialContext that points to the local server itself.</li>
 * <li><b>userId</b>: This is the user id / principal that needs to be passed as security credential while creating the
 * InitialContext. This is optional if there is no need for any credential for the context lookup.</li>
 * <li><b>password</b>: This is the password for the principal provided for security credential validation while
 * creating the InitialContext. This is optional if there is no need for any credential for the context lookup.</li>
 * <li><b>queueConnectionFactory</b>: This is the JNDI Name for doing the lookup to the QueueConnectionFactory. This is
 * mandatory.</li>
 * <li><b>queueJNDIName</b>: This is the JNDI Name for doing the lookup to get the Queue. This is mandatory.</li>
 * <li><b>deliveryMode</b>: This is the delivery mode that needs to be set while sending out the message. Possible
 * values are one of <b>persistent</b>, <b>non-persistent</b>. This is optional. If not provided, the default used is
 * <b>non-persistent</b></li>
 * <li><b>timeToLiveInms</b>: This is the time to live interval that should be set for retaining the message in the
 * queue before discarding. If not configured, the message will wait in the queue indefinitely for some listener to pick
 * up the same for processing. The value provided is in milli seconds.</li>
 * </ul>
 * 
 * @Version 15.1
 */
public class JMSAsyncExecutorSetup extends AsyncExecutorSetup
{
	private JMSConfiguration config;
	public static final String JMS_INITIAL_CTX_FACTORY = "initialContextFactory";
	public static final String JMS_JNDI_URL = "jndiURL";
	public static final String JMS_CTX_USER_ID = "userId";
	public static final String JMS_CTX_PASSWORD = "password";
	public static final String JMS_DELIVERY_MODE = "deliveryMode";
	public static final String JMS_MSG_TIME_TO_LIVE = "timeToLiveInms";
	public static final String JMS_QUEUE_CONN_FACTORY_NAME = "queueConnectionFactory";
	public static final String JMS_QUEUE_JNDI_NAME = "queueJNDIName";

	static final Logger LOGGER = Logger.getLogger(JMSAsyncExecutorSetup.class);

	/**
	 * The default constructor for the setup that takes the name.
	 * 
	 * @param setupName
	 */
	public JMSAsyncExecutorSetup(String setupName)
	{
		super(setupName);
		config = new JMSConfiguration();
	}

	/**
	 * The list of valid attributes that are supported by this executor setup are -
	 * 
	 * For any attributes that are outside of this list, this just ignores the same and does not throw any exception
	 * 
	 * @param attribName The name of the attribute
	 * @param attribValue The value provided for the attribute
	 * @throws AsyncExecutorException Included in the method signature.
	 * @see com.intellectdesign.canvas.async.AsyncExecutorSetup#setAttribute(java.lang.String, java.lang.String)
	 */
	@Override
	public void setAttribute(String attribName, String attribValue) throws AsyncExecutorException
	{
		if (JMS_INITIAL_CTX_FACTORY.equals(attribName))
			config.setInitialContextFactory(StringUtils.ensureExists(attribValue, ""));
		else if (JMS_JNDI_URL.equals(attribName))
			config.setJndiURL(StringUtils.ensureExists(attribValue, ""));
		else if (JMS_CTX_USER_ID.equals(attribName))
			config.setUserId(StringUtils.ensureExists(attribValue, ""));
		else if (JMS_CTX_PASSWORD.equals(attribName))
			config.setPassword(StringUtils.ensureExists(attribValue, ""));
		else if (JMS_DELIVERY_MODE.equals(attribName))
			config.setDeliveryMode(StringUtils.ensureExists(attribValue, ""));
		else if (JMS_MSG_TIME_TO_LIVE.equals(attribName))
			config.setTimeToLive(Integer.valueOf(StringUtils.ensureExists(attribValue, "-1")));
		else if (JMS_QUEUE_CONN_FACTORY_NAME.equals(attribName))
			config.setQueueConnectionFactoryName(StringUtils.ensureExists(attribValue, ""));
		else if (JMS_QUEUE_JNDI_NAME.equals(attribName))
			config.setQueueName(StringUtils.ensureExists(attribValue, ""));
		else if (!IMPLEMENTATION_CLASS.equals(attribName))
			LOGGER.cterror("CTBAS00091", attribName, attribValue);
	}

	/**
	 * Here we actually do a sample lookup pf the queue based on the configuration provided to see if it is fine.
	 * 
	 * @throws AsyncExecutorException
	 * @see com.intellectdesign.canvas.async.AsyncExecutorSetup#initialize()
	 */
	@Override
	public void initialize() throws AsyncExecutorException
	{
		// Step 1: First check that there are no validation errors.
		String validationErrors = config.validateAndGetErrors();
		if (!StringUtils.isEmpty(validationErrors))
		{
			LOGGER.cterror("CTBAS00092", getName(), validationErrors);
			throw new AsyncExecutorException("CTBAS00092", "Validation for " + getName() + " failed with errors - "
					+ validationErrors);
		}

		// Step 2: Try to do the actual lookups to ensure that the context details provided are valid.
		try
		{
			config.testConfiguration();
		} catch (Exception e)
		{
			LOGGER.cterror("CTBAS00092", getName(), e.getMessage(), e);
			throw new AsyncExecutorException("CTBAS00092", getName()
					+ " initialization failed with exception while testing configuration", e);
		}

		LOGGER.ctdebug("CTBAS00093", getName());
	}

	/**
	 * This method adds the provided job to the queue.
	 * 
	 * @param aJob The job to be queued
	 * @throws AsyncExecutorException Thrown if there are any errors while adding the job
	 * @see com.intellectdesign.canvas.async.AsyncExecutorSetup#addJob(com.intellectdesign.canvas.async.AsyncJob)
	 */
	@Override
	public void addJob(AsyncJob aJob) throws AsyncExecutorException
	{
		try
		{
			config.addTask(getName(), aJob);
		} catch (NamingException e)
		{
			LOGGER.cterror("CTBAS00098", getName(), e);
			throw new AsyncExecutorException("CTBAS00098", e);
		} catch (JMSException e)
		{
			LOGGER.cterror("CTBAS00098", getName(), e);
			throw new AsyncExecutorException("CTBAS00098", e);
		}
	}

	/**
	 * This method will be invoked to shutdown this executor. No exceptions can be thrown here as irrespective of the
	 * exception faced, the system will look to move ahead.
	 */
	@Override
	public void shutdown()
	{
		// Nothing to do here as we are not maintaining anything directly. The right activity would be to shut down the
		// Queue itself, but that is mangaged by the application container
	}

	/**
	 * This is an internal class used for storing the JMS configuration provided as part of the configuration. This also
	 * provides utility methods for creating of context, validating configuration, etc.
	 * 
	 * @Version 15.1
	 */
	protected static class JMSConfiguration
	{
		private static final String DELIVERY_MODE_PERSISTENT = "persistent";
		private static final String DELIVERY_MODE_NON_PERSISTENT = "non-persistent";
		private String initialContextFactory;
		private String jndiURL;
		private String userId;
		private String password;
		private String queueConnectionFactoryName;
		private String queueName;
		private String deliveryMode;
		private int timeToLive;

		/**
		 * This method validates whether the configuration provided is valid.
		 * 
		 * @return String validates the configuration and builds the error message for the various validation errors
		 *         identified
		 */
		protected String validateAndGetErrors()
		{
			StringBuilder validationErrors = new StringBuilder();
			// there is a good chance that the JNDI lookup can be for the current server itself. In that case, initial
			// context factory, jndi url, user id and password become optional. Do some simple dependency validations
			// Validation 1: If password is provided, user id is mandatory.
			if (!StringUtils.isEmpty(getPassword()) && StringUtils.isEmpty(getUserId()))
				validationErrors.append(" Password is configured while User id is empty.");
			// Validation 2: Queue name and Queue connection factory name is mandatory.
			if (StringUtils.isEmpty(getQueueConnectionFactoryName()))
				validationErrors
						.append(" Queue Connection Factory name has not been provided. Without this JMS message cannot be sent.");
			if (StringUtils.isEmpty(getQueueName()))
				validationErrors.append(" Queue name has not been provided. Without this JMS message cannot be sent.");
			// Validation 3: Check that the delivery mode provided is a valid value.
			if (!StringUtils.isEmpty(deliveryMode))
			{
				String[] validDeliveryModes = new String[]
				{ DELIVERY_MODE_PERSISTENT, DELIVERY_MODE_NON_PERSISTENT };
				if (!StringUtils.in(getDeliveryMode(), validDeliveryModes))
					validationErrors.append(" Deliverymode provided has to be one of ").append(
							Arrays.deepToString(validDeliveryModes));
			}
			return validationErrors.toString();
		}

		/**
		 * This is a helper method that tests the configuration provided. This does a sample lookup except for sending
		 * out a message.
		 */
		protected void testConfiguration() throws NamingException, JMSException
		{
			QueueConnectionFactory qConnFactory = null;
			QueueConnection qConn = null;
			QueueSession qSession = null;
			Queue aQueue = null;

			InitialContext initContext = constructInitialContext();
			qConnFactory = (QueueConnectionFactory) initContext.lookup(getQueueConnectionFactoryName());
			aQueue = (Queue) initContext.lookup(getQueueName());
			try
			{
				qConn = qConnFactory.createQueueConnection();
				qSession = qConn.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
				// Test till creation of the sender
				qSession.createSender(aQueue);
				qConn.start();
			} finally
			{
				if (qSession != null)
					qSession.close();
				if (qConn != null)
					qConn.close();
			}
		}

		/**
		 * This method adds the job to the queue.
		 * 
		 * @param setupName The setup name (for logging purposes)
		 * @param aJob The job to be added to the queue
		 * @exception NamingException thrown if any error occurs while creating Initialcontext or lookup up the queue
		 * @exception JMSException thrown if any error occurs while adding the task to the queue
		 */
		protected void addTask(String setupName, AsyncJob aJob) throws NamingException, JMSException
		{
			QueueConnectionFactory qConnFactory = null;
			QueueConnection qConn = null;
			QueueSession qSession = null;
			QueueSender qSender = null;
			Queue aQueue = null;

			InitialContext initContext = constructInitialContext();
			qConnFactory = (QueueConnectionFactory) initContext.lookup(getQueueConnectionFactoryName());
			aQueue = (Queue) initContext.lookup(getQueueName());
			try
			{
				qConn = qConnFactory.createQueueConnection();
				qSession = qConn.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
				qSender = qSession.createSender(aQueue);
				qConn.start();
				ObjectMessage objectMessage = qSession.createObjectMessage();
				objectMessage.setObject(aJob);
				qSender.send(objectMessage);
				LOGGER.ctdebug("CTBAS00097", setupName);
			} finally
			{
				if (qSession != null)
					qSession.close();
				if (qConn != null)
					qConn.close();
			}
		}

		/**
		 * Helper method that returns the initial context after considering the parameters provided
		 * 
		 * @return The InitialContext created using the parameters provided
		 * @throws NamingException Thrown if any error occurs while creating the context
		 */
		protected InitialContext constructInitialContext() throws NamingException
		{
			Hashtable env = new Hashtable();
			InitialContext ic = null;
			if (!StringUtils.isEmpty(getInitialContextFactory()))
				env.put(Context.INITIAL_CONTEXT_FACTORY, getInitialContextFactory());
			if (!StringUtils.isEmpty(getJndiURL()))
				env.put(Context.PROVIDER_URL, getJndiURL());
			if (!StringUtils.isEmpty(getUserId()))
			{
				env.put(Context.SECURITY_PRINCIPAL, getUserId());
				env.put(Context.SECURITY_CREDENTIALS, getPassword());
			}
			if (env.isEmpty())
				ic = new InitialContext();
			else
				ic = new InitialContext(env);
			return ic;
		}

		/**
		 * @return the initialContextFactory
		 */
		protected String getInitialContextFactory()
		{
			return initialContextFactory;
		}

		/**
		 * @param initialContextFactory the initialContextFactory to set
		 */
		protected void setInitialContextFactory(String initialContextFactory)
		{
			this.initialContextFactory = initialContextFactory;
		}

		/**
		 * @return the jndiURL
		 */
		protected String getJndiURL()
		{
			return jndiURL;
		}

		/**
		 * @param jndiURL the jndiURL to set
		 */
		protected void setJndiURL(String jndiURL)
		{
			this.jndiURL = jndiURL;
		}

		/**
		 * @return the userId
		 */
		protected String getUserId()
		{
			return userId;
		}

		/**
		 * @param userId the userId to set
		 */
		protected void setUserId(String userId)
		{
			this.userId = userId;
		}

		/**
		 * @return the password
		 */
		protected String getPassword()
		{
			return password;
		}

		/**
		 * @param password the password to set
		 */
		protected void setPassword(String password)
		{
			this.password = password;
		}

		/**
		 * @return the queueConnectionFactoryName
		 */
		protected String getQueueConnectionFactoryName()
		{
			return queueConnectionFactoryName;
		}

		/**
		 * @param queueName the queueConnectionFactoryName to set
		 */
		protected void setQueueConnectionFactoryName(String queueName)
		{
			this.queueConnectionFactoryName = queueName;
		}

		/**
		 * @return the queueName
		 */
		protected String getQueueName()
		{
			return queueName;
		}

		/**
		 * @param queueName the queueName to set
		 */
		protected void setQueueName(String queueName)
		{
			this.queueName = queueName;
		}

		/**
		 * @return the deliveryMode
		 */
		protected String getDeliveryMode()
		{
			return deliveryMode;
		}

		/**
		 * @param deliveryMode the deliveryMode to set
		 */
		protected void setDeliveryMode(String deliveryMode)
		{
			this.deliveryMode = deliveryMode;
		}

		/**
		 * @return the timeToLive
		 */
		protected int getTimeToLive()
		{
			return timeToLive;
		}

		/**
		 * @param timeToLive the timeToLive to set
		 */
		protected void setTimeToLive(int timeToLive)
		{
			this.timeToLive = timeToLive;
		}
	}
}
