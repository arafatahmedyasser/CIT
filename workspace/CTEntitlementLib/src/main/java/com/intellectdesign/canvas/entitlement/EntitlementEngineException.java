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

package com.intellectdesign.canvas.entitlement;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * Class to handle Entitlement Engine Exception
 * 
 * @version 1.0
 */
public class EntitlementEngineException extends BaseException
{
	/**
	 * constrcutor that takes errorCode as paramater.
	 * 
	 * @param errorCode the error code for the exception.
	 */
	public EntitlementEngineException(String errorCode)
	{
		super(errorCode);
	}

	/**
	 * constrcutor that takes errorCode and Throwable object as paramater.
	 * 
	 * @param errorCode errorCode the error code for the exception.
	 * @param wrappedEx Object of the Throwable class
	 */
	public EntitlementEngineException(String errorCode, Throwable wrappedEx)
	{
		super(errorCode, wrappedEx);
	}

	/**
	 * constrcutor that takes errorCode and errorMessage as paramater.
	 * 
	 * @param errorCode errorCode the error code for the exception.
	 * @param errorMessage error messaege for the error code of exception.
	 */
	public EntitlementEngineException(String errorCode, String errorMessage)
	{
		super(errorCode, errorMessage);
	}

	/**
	 * constrcutor that takes errorCode, errorMessage and Throwable object as paramater.
	 * 
	 * @param errorCode errorCode the error code for the exception.
	 * @param errorMessage error messaege for the error code of exception.
	 * @param wrappedEx Object of the Throwable class.
	 */
	public EntitlementEngineException(String errorCode, String errorMessage, Throwable wrappedEx)
	{
		super(errorCode, errorMessage, wrappedEx);
	}

	/**
	 * constrcutor that takes Throwable object as paramater.
	 * 
	 * @param wrappedEx Object of the Throwable class.
	 */
	public EntitlementEngineException(Throwable wrappedEx)
	{
		super(wrappedEx);
	}

	private static final long serialVersionUID = 7033805507193494070L;

}
