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
package com.intellectdesign.canvas.report.exception;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.reader.ReportingProperties;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * Exception class for the reporting framework, Extends the BaseException.
 * 
 * 
 * @version 1.0
 */

public class ReportingException extends BaseException
{
	private static final long serialVersionUID = 7033805507193494070L;

	/***
	 * constructor that takes errorCode as paramater.
	 * 
	 * @param errorCode the error code for the exception.
	 */
	public ReportingException(String errorCode)
	{
		this(errorCode, MessageManager.getMessage(ReportingProperties.propertyFileName, errorCode,
				ReportConstants.DEFAULT_LANG_ID));
	}

	/***
	 * constructor that takes errorCode and Throwable object as paramaters.
	 * 
	 * @param errorCode errorCode the error code for the exception.
	 * @param wrappedEx Object of the Throwable class
	 */
	public ReportingException(String errorCode, Throwable wrappedEx)
	{
		this(errorCode, MessageManager.getMessage(ReportingProperties.propertyFileName, errorCode,
				ReportConstants.DEFAULT_LANG_ID), wrappedEx);
	}

	/***
	 * constructor that takes errorCode and errorMessage as paramaters.
	 * 
	 * @param errorCode errorCode the error code for the exception.
	 * @param errorMessage error messaege for the error code of exception.
	 */
	public ReportingException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/***
	 * constrcutor that takes errorCode, errorMessage and Throwable object as paramaters.
	 * 
	 * @param errorCode errorCode the error code for the exception.
	 * @param errorMessage error messaege for the error code of exception.
	 * @param wrappedEx Object of the Throwable class.
	 */
	public ReportingException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

	/***
	 * constrcutor that takes Throwable object as paramater.
	 * 
	 * @param wrappedEx Object of the Throwable class.
	 */
	public ReportingException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

}
