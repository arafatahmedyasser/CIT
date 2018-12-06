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

import java.util.HashMap;

/**
 * 
 * The <code>HAFormatter</code> Class is used to format payload data. Respective users should need to extend this class
 * to have their required functionality.
 * 
 * @version 1.0
 */
public class HAFormatter implements IFormatter
{

	/** Creates a new instance of HAFormatter */
	public HAFormatter()
	{
	}

	/**
	 * Formats Data before sending it out.
	 * 
	 * @param sourceData
	 * @return Object
	 */
	public Object formatDataOut(Object sourceData, HashMap appidConf)
	{
		return sourceData;
	}

	/**
	 * Formats Data before taking it in.
	 * 
	 * @param sourceData
	 * @param appidConf
	 * @return Object
	 */
	public Object formatDataIn(Object sourceData, HashMap appidConf)
	{
		return sourceData;
	}

}
