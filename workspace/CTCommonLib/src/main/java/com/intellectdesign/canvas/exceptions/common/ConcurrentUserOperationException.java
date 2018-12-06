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
 * This class contains the Concurrent User Operation Exception
 * 
 * @version 1.0
 */
public class ConcurrentUserOperationException extends ProcessingErrorException
{
	/**
	 * Constant added for serialization purposes,Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3866749017700317871L;
	public static final String ERROR_CONCURRENT_MODIFICATION = "ERR_CONCR_ACCESS";

	/**
	 * Default Constructor, sets the error code into the base class.
	 */
	public ConcurrentUserOperationException()
	{
		super(ERROR_CONCURRENT_MODIFICATION);
	}
}
