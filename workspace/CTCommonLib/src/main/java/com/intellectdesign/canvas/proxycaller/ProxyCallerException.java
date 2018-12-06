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

package com.intellectdesign.canvas.proxycaller;

import java.lang.reflect.InvocationTargetException;

/**
 * A unchecked wrapper for any of Java's checked ProxyCallerion exceptions:
 * <p>
 * These exceptions are
 * <ul>
 * <li> {@link ClassNotFoundException}</li>
 * <li> {@link IllegalAccessException}</li>
 * <li> {@link IllegalArgumentException}</li>
 * <li> {@link InstantiationException}</li>
 * <li> {@link InvocationTargetException}</li>
 * <li> {@link NoSuchMethodException}</li>
 * <li> {@link NoSuchFieldException}</li>
 * <li> {@link SecurityException}</li>
 * </ul>
 * 
 *
 * @version 1.0
 */

public class ProxyCallerException extends RuntimeException
{

	/**
	 * Generated UID
	 */
	private static final long serialVersionUID = -6213149635297151442L;

	/**
	 * ref to ProxyCallerException
	 * 
	 * @param message
	 */
	public ProxyCallerException(String message)
	{
		super(message);
	}

	/**
	 * ref to ProxyCallerException
	 * 
	 * @param message
	 * @param cause
	 */
	public ProxyCallerException(String message, Throwable cause)
	{
		super(message, cause);
	}

	/**
	 * rer to ProxyCallerException
	 */
	public ProxyCallerException()
	{
		super();
	}

	/**
	 * ref to ProxyCallerException
	 * 
	 * @param cause
	 */
	public ProxyCallerException(Throwable cause)
	{
		super(cause);
	}
}
