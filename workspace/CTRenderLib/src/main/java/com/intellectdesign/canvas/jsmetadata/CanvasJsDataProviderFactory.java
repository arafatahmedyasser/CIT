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
package com.intellectdesign.canvas.jsmetadata;

import java.util.ResourceBundle;

import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * 
 * Class for Canvas Js Data Provider Factory.
 * 
 * @version 1.0
 */
public class CanvasJsDataProviderFactory
{
	private static CanvasJsDataProviderFactory instance = new CanvasJsDataProviderFactory();

	/**
	 * Method to return the instance of the factory class.
	 * 
	 * @return CanvasJsDataProviderFactory
	 */
	public static CanvasJsDataProviderFactory getInstance()
	{
		return instance;
	}

	/**
	 * Method to return the ICanvasJsDataProvider.
	 * 
	 * @return ICanvasJsDataProvider
	 * @param dataFor
	 * @throws ProcessingErrorException
	 */

	public ICanvasJsDataProvider getJsDataProvider(String dataFor) throws ProcessingErrorException
	{
		logger.ctinfo("CTRND00284");
		ICanvasJsDataProvider jsDataProvider = null;
		try
		{
			String className = getProvideClassName(dataFor);
			if (null != className && !"".equals(className))
			{
				jsDataProvider = (ICanvasJsDataProvider) Class.forName(className).newInstance();
			}
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTRND00296", instantiationException);
			throw new ProcessingErrorException(RTL_ERR_INST_ERROR, "Not able to instantiate the class",
					instantiationException);
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTRND00298", illegalAccessException);
			throw new ProcessingErrorException(RTL_ERR_ILLI_ERROR, illegalAccessException.getMessage(),
					illegalAccessException);
		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTRND00301", classNotFoundException);
			throw new ProcessingErrorException(RTL_ERR_CNF_ERROR, classNotFoundException.getMessage(),
					classNotFoundException);
		} catch (Exception exception)
		{
			logger.cterror("CTRND00309", exception);
			throw new ProcessingErrorException(RTL_ERR_GEN_ERR, exception.getMessage(), exception);
		}
		logger.ctinfo("CTRND00285");
		return jsDataProvider;
	}

	/**
	 * Helper method to retrieved the jsmetadata provider class name for the data required for the client module type
	 * passed as paramater.
	 * 
	 * @param reauthTypeCode
	 * @return String className.
	 */
	private String getProvideClassName(String dataFor) throws ProcessingErrorException
	{
		logger.ctinfo("CTRND00286");
		String className = null;
		try
		{
			ResourceBundle propertyFile = ResourceBundle.getBundle("canvas-config");
			if (null != dataFor && dataFor != "")
			{
				className = propertyFile.getString(dataFor);
				logger.ctdebug("CTRND00069", className);
			} else
			{
				logger.ctdebug("CTRND00070");
			}
		} catch (Exception pex)
		{
			logger.cterror("CTRND00272", pex);
			throw new ProcessingErrorException(pex);
		}
		logger.ctinfo("CTRND00287");
		return className;
	}

	public static final String RTL_ERR_ILLI_ERROR = "RTL_ERR_ILLI_ERROR";
	public static final String RTL_ERR_CNF_ERROR = "RTL_ERR_CNF_ERROR";
	public static final String RTL_ERR_GEN_ERR = "RTL_ERR_GEN_ERR";
	public static final String RTL_ERR_INST_ERROR = "RTL_ERR_INST_ERROR";

	private static final Logger logger = Logger.getLogger(CanvasJsDataProviderFactory.class);
}