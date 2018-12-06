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

package com.intellectdesign.canvas.exceptions.action;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This classs contains the OrbiAction Exception
 * 
 * @version 1.0
 */
public class OrbiActionException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -8934372703720370341L;

	/**
	 * refr to OrbiActionException
	 * 
	 * @param errorCode
	 * @param errorMessage
	 * @param wrappedEx
	 */
	public OrbiActionException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

	/**
	 * ref to OrbiActionException
	 * 
	 * @param errorCode
	 * @param errorMessage
	 */
	public OrbiActionException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * ref to OrbiActionException
	 * 
	 * @param errorCode
	 * @param wrappedEx
	 */
	public OrbiActionException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * ref to OrbiActionException
	 * 
	 * @param errorCode
	 */
	public OrbiActionException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * ref to OrbiActionException
	 * 
	 * @param wrappedEx
	 */
	public OrbiActionException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}
}
