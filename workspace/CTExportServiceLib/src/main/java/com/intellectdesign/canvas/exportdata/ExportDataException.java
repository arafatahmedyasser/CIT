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

package com.intellectdesign.canvas.exportdata;

/**
 * Class that defines Exception in Export Data package
 * 
 * @version 1.0
 */
public class ExportDataException extends Exception
{

	/**
	 * Default serial version UID
	 */
	private static final long serialVersionUID = 8856191642810321825L;

	/**
	 * Constructor taking String as parameter.
	 * 
	 * @param message
	 */
	public ExportDataException(String message)
	{
		super(message);

	}

	/**
	 * Constructor taking Throwable as parameter.
	 * 
	 * @param cause
	 */
	public ExportDataException(Throwable cause)
	{
		super(cause);

	}

	/**
	 * Constructor taking Throwable and String as parameters.
	 * 
	 * @param message
	 * @param cause
	 */
	public ExportDataException(String message, Throwable cause)
	{
		super(message, cause);

	}

}
