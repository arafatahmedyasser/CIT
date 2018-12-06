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

package com.intellectdesign.canvas.alert.handler.bean;

import java.util.Map;
import java.util.Properties;

import javax.ejb.EJBException;
import javax.ejb.MessageDrivenBean;
import javax.ejb.MessageDrivenContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;

import com.intellectdesign.canvas.alert.handler.AlertHandlerException;
import com.intellectdesign.canvas.alert.handler.AlertQueueEventData;
import com.intellectdesign.canvas.alert.handler.EventAlertHandler;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;

/**
 * This is a message driver EJP bean class, which listens to messages from AlertMessageQueue. On receiving messages it will
 * call the handleSyncEvent function of EventAlertHandler
 * 
 * Message format javax.jms.ObjectMessage message which contains a map with below contents
 * ------------------------------------------------ KEY VALUE ------------------------------------------------ PAYLOAD
 * EventData POJO class ------------------------------------------------
 * 
 * @version 1.0
 */
public class AlertMessageListener implements MessageDrivenBean, MessageListener
{	
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 7609852373230776086L;
	private MessageDrivenContext context = null;
	private static String USER_TRANSACTION_JNDI = null;
	private static InitialContext initialContext = null;
	private static boolean alertMessageListenerReady = true;

	private static String PAYLOAD_KEY = "PAYLOAD";

	private static final Logger logger = Logger.getLogger(AlertMessageListener.class);

	/**
	 * Resolves initialContext
	 */
	static
	{
		Properties prop = new Properties();
		prop.put(Context.INITIAL_CONTEXT_FACTORY, CTProperties.getProperty("USER_TXN_NAME.JNDIProvider"));
		prop.put(Context.PROVIDER_URL, CTProperties.getProperty("USER_TXN_NAME.JNDIURL"));
		USER_TRANSACTION_JNDI = CTProperties.getProperty("USER_TXN_NAME.JNDIName");

		try
		{
			initialContext = new InitialContext(prop);
		} catch (NamingException ne)
		{
			initialContext = null;
			alertMessageListenerReady = false;
		}
	}

	/**
	 * This method is used to Create EJB
	 * 
	 * @return void
	 * @throws EJBException
	 */
	public void ejbCreate() throws EJBException
	{
	}

	/**
	 * This method is used to Remove EJB
	 * 
	 * @return void
	 * @throws EJBException
	 * @see javax.ejb.MessageDrivenBean#ejbRemove()
	 */
	public void ejbRemove() throws EJBException
	{
	}

	/**
	 * This method sets access to the runtime message-driven context 
	 * that the container provides for a message-driven bean instance. 
	 * The message-driven context remains associated with the instance for the lifetime of the instance.
	 * 
	 * @param pMessageDrivenContext MessageDrivenContext object to set 
	 * 
	 * @throws EJBException
	 * 
	 * @see javax.ejb.MessageDrivenBean#setMessageDrivenContext(javax.ejb.MessageDrivenContext)
	 */
	public void setMessageDrivenContext(MessageDrivenContext pMessageDrivenContext) throws EJBException
	{
		this.context = pMessageDrivenContext;
	}

	/**
	 * This method returns the access to the runtime message-driven context which contains all the messages
	 * 
	 * @return MessageDrivenContext which contains the messages provided by the server
	 * @throws EJBException
	 */
	public MessageDrivenContext getMessageDrivenContext() throws EJBException
	{
		return context;

	}

	/**
	 * This method creates the message queue for the JMS message object passed as paramter
	 * 
	 * @param msg JMS message object that 
	 * @return void
	 */
	public void onMessage(Message msg)
	{
		UserTransaction userTransaction = null;
		ObjectMessage alertMessage = null;
		Map alertMessageMap = null;

		/**
		 * Exits this method if alertMessageListener doesn't loaded properly
		 */
		if (!alertMessageListenerReady)
		{
			logger.cterror("CTALT00978");
			return;
		}

		if (msg instanceof javax.jms.ObjectMessage)
		{
			alertMessage = (ObjectMessage) msg;
			Object alertObject = null;
			try
			{
				alertObject = alertMessage.getObject();
			} catch (JMSException e)
			{
				logger.cterror("CTALT00980", e);
				return;
			}

			try
			{
				alertMessageMap = (Map) alertObject;
				logger.ctdebug("CTALT00979", alertMessageMap);
			} catch (ClassCastException cce)
			{
				logger.cterror("CTALT00981", cce, alertObject.getClass().getName());
				return;
			}
		} else
		{
			logger.cterror("CTALT00982");
			return;
		}

		try
		{
			userTransaction = (UserTransaction) initialContext.lookup(USER_TRANSACTION_JNDI);
		} catch (NamingException e)
		{
			logger.cterror("CTALT00983", e);
			return;
		}
		try
		{
			try
			{
				userTransaction.begin();
			} catch (NotSupportedException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			} catch (SystemException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			}
			Object pObj = alertMessageMap.get(PAYLOAD_KEY);
			if (pObj instanceof AlertQueueEventData)
			{
				AlertQueueEventData recievedData = (AlertQueueEventData) pObj;
				EventAlertHandler evtAlertHandler = new EventAlertHandler();
				try
				{
					Event eventFromQueue = recievedData.getMEvent();
					IData dataFromQueue = recievedData.getMFormattedData();
					evtAlertHandler.handleSynchEvent(eventFromQueue, dataFromQueue);
				} catch (AlertHandlerException e)
				{
					logger.cterror("CTALT00984", e);
					throw new OnlineException(e);
				}
			} else
			{
				logger.cterror("CTALT00985", pObj.getClass().getName());
			}
			try
			{
				userTransaction.commit();
			} catch (SecurityException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			} catch (IllegalStateException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			} catch (RollbackException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			} catch (HeuristicMixedException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			} catch (HeuristicRollbackException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			} catch (SystemException e)
			{
				logger.cterror("CTALT00983", e);
				return;
			}
		} catch (OnlineException e)
		{
			try
			{
				userTransaction.rollback();
			} catch (IllegalStateException e1)
			{
				logger.cterror("CTALT00983", e1);
				return;
			} catch (SecurityException e1)
			{
				logger.cterror("CTALT00983", e1);
				return;
			} catch (SystemException e1)
			{
				logger.cterror("CTALT00983", e1);
				return;
			}
			logger.cterror("CTALT00983", e);
			return;
		}

		try
		{
			msg.acknowledge();
		} catch (JMSException e)
		{
			logger.cterror("CTALT00983", e);
		}
		return;
	}

}