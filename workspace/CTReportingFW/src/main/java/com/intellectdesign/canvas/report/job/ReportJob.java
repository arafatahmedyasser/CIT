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
package com.intellectdesign.canvas.report.job;

import java.util.Hashtable;
import javax.jms.JMSException;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.UserTransaction;
import org.omg.CORBA.SystemException;
import com.intellectdesign.canvas.classicdb.DataManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportStatus;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * Creates an instance of the report and adds the report to the jms queue. Any scheduler(quartz today),must call the
 * executeReport method to start the report generation process.
 * 
 * @version 1.0
 */

public abstract class ReportJob implements IReportJob
{
	private String reportInstanceId = null;

	/**
	 * 1.Gets the report definition object and builds the report instance definition. 2.Sets the report status as INIT.
	 * 3.Stores this report instance definition. 4.Sends the report request to the queue 5.Updates the report status as
	 * queued.
	 * 
	 * @param reportRequest > The request that contains the information related to a report.
	 * @throws ReportingException
	 */
	@Override
	public String executeReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00314");

		/**
		 * Step 1: Gets the report instance definition object for the reportRequest. Set the ReportInstanceId to
		 * ReportRequest Object. Set the status of reportInstanceDefinition as INIT.
		 */
		ReportInstanceDefinition reportInstanceDefinition = getReportInstanceDefinition(reportRequest);
		reportInstanceId = reportInstanceDefinition.getReportInstanceId();

		reportRequest.setReportInstanceId(reportInstanceId);
		reportInstanceDefinition.setStatus(ReportStatus.INIT.toString());

		/**
		 * Step 2: Check the user Transaction mode is Simulation or not.
		 * 
		 * Step 2.1 : If it is NON-SIMULATION mode then Step 2.1.1 : Create instance for ReportInstruction class. Step
		 * 2.1.2 : Initialize and begin the UserTransaction. INSERT the constructed reportInstanceDefinition to database
		 * by calling reportInstruction.createReportInstanceDefinition() method. Commit the UserTransaction. Step 2.1.3
		 * : Call addToQueue(reportRequest) to add reportRequest the corrsponding(Sync/Async) queue to execute the
		 * report.
		 * 
		 * Step 2.1.4 : Initialize and begin the UserTransaction. UPDATE the constructed reportInstanceDefinition object
		 * status as QUEUED to database by calling reportInstruction.updateReportInstanceStatus() method. Commit the
		 * UserTransaction. Step 2.2 : If it is SIMULATION mode then SKIP this reportInstanceDefinition Object creation
		 * process.
		 */
		if (!reportRequest.isSimulationMode())
		{
			LOGGER.ctdebug("CTREP00315");
			try
			{
				/**
				 * Step 2.1.1 : Create instance for ReportInstruction class.
				 */
				ReportInstruction reportInstruction = new ReportInstruction();

				/**
				 * Step 2.1.2 : Initialize and begin the UserTransaction.
				 * 
				 * INSERT the constructed reportInstanceDefinition to database by calling
				 * reportInstruction.createReportInstanceDefinition() method.
				 * 
				 * Commit the UserTransaction.
				 */

				LOGGER.ctinfo("CTREP00316");
				UserTransaction userTransaction = DataManager.getUserTransaction();

				if (userTransaction != null)
				{
					userTransaction.begin();
				}
				reportInstruction.createReportInstanceDefinition(reportInstanceDefinition);

				if (userTransaction != null)
				{
					userTransaction.commit();
				}
				LOGGER.ctinfo("CTREP00317");
				/**
				 * Step 2.1.3 : Call addToQueue(reportRequest) method to add reportRequest to corrsponding(Sync/Async)
				 * queue to execute the report.
				 */
				addToQueue(reportRequest);
				LOGGER.ctinfo("CTREP00318");
				/**
				 * Step 2.1.4 : Initialize and begin the UserTransaction.
				 * 
				 * UPDATE the constructed reportInstanceDefinition object status as QUEUED to database by calling
				 * reportInstruction.updateReportInstanceStatus() method.
				 * 
				 * Commit the UserTransaction.
				 */
				UserTransaction userTransactionForUPD = DataManager.getUserTransaction();
				LOGGER.ctinfo("CTREP00319");

				if (userTransactionForUPD != null)
				{
					userTransactionForUPD.begin();
				}
				reportInstruction.updateReportInstanceStatus(reportInstanceId, ReportStatus.QUEUED, null, null);

				if (userTransactionForUPD != null)
				{
					userTransactionForUPD.commit();
				}
				LOGGER.ctinfo("CTREP00320");

			} catch (ReportingException reportExp)
			{
				LOGGER.cterror("CTREP00321", reportExp.getCause());
				throw new ReportingException(reportExp.getErrorCode(), reportExp.getErrorMessage());
			} catch (NotSupportedException nsExp)
			{
				LOGGER.cterror("CTREP00322", nsExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, nsExp);
			} catch (SystemException sysExp)
			{
				LOGGER.cterror("CTREP00323", sysExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, sysExp);
			} catch (SecurityException securityExp)
			{
				LOGGER.cterror("CTREP00324", securityExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, securityExp);
			} catch (IllegalStateException illgalExp)
			{
				LOGGER.cterror("CTREP00325", illgalExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, illgalExp);
			} catch (RollbackException rollbackExp)
			{
				LOGGER.cterror("CTREP00326 ", rollbackExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, rollbackExp);
			} catch (HeuristicMixedException heuristicMixedExp)
			{
				LOGGER.cterror("CTREP00327", heuristicMixedExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, heuristicMixedExp);
			} catch (HeuristicRollbackException heuristicRollbackExp)
			{
				LOGGER.cterror("CTREP00328 ", heuristicRollbackExp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, heuristicRollbackExp);
			} catch (Exception exp)
			{
				LOGGER.cterror("CTREP00329", exp.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, exp);
			}

		} else
		{
			LOGGER.ctdebug("CTREP00330");
		}

		LOGGER.ctinfo("CTREP00331");

		return reportInstanceId;
	}

	/**
	 * Adds the report to the jms queue
	 * 
	 * @param reportRequest > The request that contains the information related to a report.
	 */

	@Override
	/**
	 * 
	 * @param reportRequest
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.job.IReportJob#addToQueue(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public void addToQueue(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00332");

		QueueConnectionFactory qConnectionFactory;
		QueueConnection queueConn = null;
		QueueSender queueSender;
		QueueSession qSendSession;
		Queue sendQ;
		try
		{
			// get the initial context
			ConfigurationManager config = ConfigurationManager.getInstance();
			InitialContext initialContext = null;
			Hashtable environment = new Hashtable<String, String>();
			environment.put(Context.INITIAL_CONTEXT_FACTORY, config.getInformationReportingDescriptor()
					.getReportQueueInitialContextFactory());
			environment.put(Context.PROVIDER_URL, config.getInformationReportingDescriptor().getReportQueueJNDI_URL());
			LOGGER.ctinfo("CTREP00333", environment);
			initialContext = new InitialContext(environment);
			qConnectionFactory = (QueueConnectionFactory) initialContext.lookup(config
					.getInformationReportingDescriptor().getReportJmsConnectionFactory());
			sendQ = (Queue) initialContext.lookup(config.getInformationReportingDescriptor().getReportJmsAsycQueue());
			queueConn = qConnectionFactory.createQueueConnection();
			qSendSession = queueConn.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
			queueSender = qSendSession.createSender(sendQ);
			queueConn.start();

			TextMessage message = qSendSession.createTextMessage();
			message.setText(reportRequest.getReportInstanceId());

			message.setJMSCorrelationID(reportInstanceId);
			// send the message
			queueSender.send(message);

		} catch (NamingException namingException)
		{
			LOGGER.cterror("CTREP00334", namingException);
			throw new ReportingException(ReportConstants.REPORT_ERR_NAMING, namingException);
		} catch (JMSException jmsException)
		{
			LOGGER.cterror("CTREP00335", jmsException);
			throw new ReportingException(ReportConstants.REPORT_ERR_JMS, jmsException);
		} finally
		{
			// close the queue connection
			if (queueConn != null)
			{
				try
				{
					queueConn.close();
				} catch (JMSException jmsException)
				{
					LOGGER.cterror("CTREP00335", jmsException);
					throw new ReportingException(ReportConstants.REPORT_ERR_JMS, jmsException);
				}
			}

		}

		LOGGER.ctinfo("CTREP00336");
	}

	/**
	 * Abstract method to get the report instance definition.
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 */
	public abstract ReportInstanceDefinition getReportInstanceDefinition(ReportRequest reportRequest)
			throws ReportingException;

	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportJob.class);
}
