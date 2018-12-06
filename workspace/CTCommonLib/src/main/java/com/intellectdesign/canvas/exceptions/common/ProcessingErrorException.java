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

package com.intellectdesign.canvas.exceptions.common;

/**
 * This class contains the Processing Error Exception
 * 
 * @version 1.0
 */
public class ProcessingErrorException extends BaseException
{

	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Super class constructor for ProcessingErrorException with error as param
	 * 
	 * @param error
	 */
	public ProcessingErrorException(String error)
	{
		super(error);
	}

	/**
	 * Super class constructor for ProcessingErrorException with ex as param
	 * 
	 * @param ex
	 */
	public ProcessingErrorException(Exception ex)
	{
		super(ex);
	}

	/**
	 * Super class constructor for ProcessingErrorException with errorCode and errorMessage as params
	 * 
	 * @param errorCode The ErrorCode of the ProcessingErrorException
	 * @param errorMessage The errorMessage of the ProcessingErrorException
	 */
	public ProcessingErrorException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * Super class constructor for ProcessingErrorException with errorCode, errorMessage and thrw as params
	 * 
	 * @param errorCode The ErrorCode of the ProcessingErrorException
	 * @param errorMessage The errorMessage of the ProcessingErrorException
	 * @param thrw Super class of the Exception
	 */
	public ProcessingErrorException(String errorCode, String errorMessage, Throwable thrw)
	{
		super(errorCode, errorMessage, thrw);
	}
}
