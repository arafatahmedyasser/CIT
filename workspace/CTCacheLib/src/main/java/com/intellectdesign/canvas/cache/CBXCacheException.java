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

package com.intellectdesign.canvas.cache;

import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.PhraseVariable;

/**
 * This exception class created for the CBXCache framework
 * 
 * @version 1.0
 */
public class CBXCacheException extends BaseException
{

	/**
	 * Default version UID for serialization
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructor with ErrorMessage
	 * 
	 * @param errormessage
	 */
	public CBXCacheException(String errorMessage)
	{
		super(errorMessage);
	}

	/**
	 * Constructor with throwable as params as throwable is the base class for all exceptions.
	 * 
	 * @param thrw
	 */
	public CBXCacheException(Throwable thrw)
	{
		super(thrw);
	}

	/**
	 * Constructor with errorcode and throwable as params as throwable is the base class for all exceptions. and
	 * corresponding errormessage is retrieved from the CBXCacheExceptions.properties
	 * 
	 * @param Str error code,thrw
	 */

	public CBXCacheException(String errorCode, Throwable thrw)
	{
		super(errorCode, MessageManager.getMessage(CacheConstants.CBX_CACHE_EXCEPTION, errorCode, ""), thrw);
	}

	/**
	 * Constructor with errorcode and throwable as params as throwable is the base class for all exceptions. and
	 * corresponding errormessage is retrieved from the CBXCacheExceptions.properties and phraseVariables used to
	 * substitute the values in errormessage in the property files
	 * 
	 * @param Str errorcode,thrw,phraseVariable
	 */

	public CBXCacheException(String errorCode, Throwable thrw, List<PhraseVariable> phraseVariables)
	{
		super(errorCode, MessageManager.getMessage(CacheConstants.CBX_CACHE_EXCEPTION, errorCode, "",
				phraseVariables), thrw);
	}
}
