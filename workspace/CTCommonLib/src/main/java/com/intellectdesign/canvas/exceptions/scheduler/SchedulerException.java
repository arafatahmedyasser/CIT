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

package com.intellectdesign.canvas.exceptions.scheduler;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This class contains the scheduler exception
 * 
 * @version 1.0
 */
public class SchedulerException extends BaseException
{
	/**
	 * Default Serial version UID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructs a scheduler exception with a error code and error message
	 * 
	 * @param strErrorCode
	 * @param strErrorMessage
	 */
	public SchedulerException(String strErrorCode, String strErrorMessage)
	{
		super(strErrorCode, strErrorMessage);
	}

	/**
	 * another self explanatory overloaded constructor.
	 * 
	 * @param strErrorCode
	 * @param strErrorMessage
	 * @param e
	 */
	public SchedulerException(String strErrorCode, String strErrorMessage, Throwable e)
	{
		super(strErrorCode, strErrorMessage);
	}

}
