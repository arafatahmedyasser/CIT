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

package com.intellectdesign.canvas.audit.handler;

import com.intellectdesign.canvas.event.handler.HandlerException;

/**
 * This class explains about AuditHandlerException which is subclass of HandlerException
 * 
 * @version 1.0
 */
public class AuditHandlerException extends HandlerException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -5564294189140754149L;

	/**
	 * This is constructor for AuditHandlerException class
	 * 
	 * @param sErrorCode
	 */
	public AuditHandlerException(String sErrorCode)
	{

		this(sErrorCode, AuditConstants.EVENT_PROP_READER.retrieveProperty(sErrorCode));

	}

	/**
	 * This is constructor for AuditHandlerException class
	 * 
	 * @param sErrorCode
	 * @param sErrString
	 */
	public AuditHandlerException(String sErrorCode, String sErrString)
	{
		super(sErrorCode, sErrString);
	}

	/**
	 * This is constructor for AuditHandlerException class
	 * 
	 * @param sErrorCode
	 * @param exp
	 */
	public AuditHandlerException(String sErrorCode, Throwable exp)
	{
		super(sErrorCode, exp);
	}

	/**
	 * This is constructor for AuditHandlerException class
	 * 
	 * @param sErrorCode
	 * @param sErrorMsg
	 * @param exp
	 */
	public AuditHandlerException(String sErrorCode, String sErrorMsg, Throwable exp)
	{
		super(sErrorCode, sErrorMsg, exp);
	}
}
