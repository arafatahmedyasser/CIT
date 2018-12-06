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
package com.intellectdesign.canvas.report.factory;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.policy.IReportPolicyHandler;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * The ReportPolicyFactory class provides methods to get the instance of appropriate ReportPolicy. It is a singleton
 * class. To get the instance use ReportPolicyFactory.getInstance().
 * 
 * 
 * @version 1.0
 */

public class ReportPolicyFactory
{
	/**
	 * This method provides the instance of the ReportPolicyFactory. Classes using this factory class must use this
	 * method to get an instance of the class.
	 * 
	 * @return ReportPolicyFactory
	 */
	public static ReportPolicyFactory getInstance()
	{
		if (instance == null)
		{
			synchronized (ReportPolicyFactory.class)
			{
				if (instance == null)
				{
					instance = new ReportPolicyFactory();
				}
			}
		}
		return instance;
	}

	/***
	 * This method returns the instance of the type IReportPolicyHandler for the given class name.
	 * 
	 * @param ReportPolicyClassName - the report publisher class name
	 * @return IReportEngineAdaptor
	 */
	public IReportPolicyHandler getReportPolicyHandler(String ReportPolicyClassName) throws ReportingException
	{

		logger.ctinfo("CTREP00179");
		IReportPolicyHandler ReportPolicy = null;
		try
		{
			ReportPolicy = (IReportPolicyHandler) Class.forName(ReportPolicyClassName).newInstance();
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTREP00171", instantiationException);
			throw new ReportingException(ReportConstants.ERR_CD_REP_POLCY_FACT_INST_EXEC, instantiationException);

		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTREP00172", illegalAccessException);
			throw new ReportingException(ReportConstants.ERR_CD_REP_POLCY_FACT_ILLI_EXCEP, illegalAccessException);

		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTREP00173", classNotFoundException);
			throw new ReportingException(ReportConstants.ERR_CD_REP_POLCY_FACT_CLASS_NOT_FOUND_EXCEP,
					classNotFoundException);

		} catch (Exception exception)
		{
			logger.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_REP_POLCY_FACT_GENERIC_EXCEP, exception);
		}

		logger.ctinfo("CTREP00180");
		return ReportPolicy;
	}

	/***
	 * Private constructor to make the class singleton.
	 */
	private ReportPolicyFactory()
	{
	}

	/**
	 * ReportPolicyFactory instance.
	 */
	private static ReportPolicyFactory instance = new ReportPolicyFactory();
	/**
	 * logger.
	 */
	private static Logger logger = Logger.getLogger(ReportPolicyFactory.class);
}
