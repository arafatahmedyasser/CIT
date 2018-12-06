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

package com.intellectdesign.canvas.hal;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * 
 * The <code>HALException</code> Class is used in Host Access Layer to throw internal Exceptions. This Error Class
 * Extends <code> java.lang.Exception </code> class. It persists Error Code and Error Message.
 * 
 * @version 1.0
 */
public class HALException extends BaseException
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -2446713077545669739L;

	/**
	 * Constructor that takes Error Code and Error Message as Parameters
	 * 
	 * @param errorcd
	 * @param errormsg
	 */
	public HALException(String errorcd, String errormsg)
	{
		super(errorcd, errormsg);
	}

	/**
	 * Constructor that takes Error Code,Error Message and thrw as Parameters.
	 * 
	 * @param errorcd
	 * @param errormsg
	 * @param thrw
	 */
	public HALException(String errorcd, String errormsg, Throwable thrw)
	{
		super(errorcd, errormsg, thrw);
	}
}
