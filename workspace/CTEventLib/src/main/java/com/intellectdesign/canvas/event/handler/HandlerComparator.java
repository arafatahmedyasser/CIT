/*************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *************************************************************************/
package com.intellectdesign.canvas.event.handler;

import java.util.Comparator;

/**
 * This is HandlerComparator class implements Comparator
 * 
 * @version 1.0
 */
public class HandlerComparator implements Comparator
{

	/**
	 * Greater the integer value of the event handler priority, the larger the logical priority of the handler.
	 * 
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 * @param eventHandler1
	 * @param eventHandler2
	 * @return int
	 */
	public int compare(Object eventHandler1, Object eventHandler2)
	{
		if (((EventHandler) eventHandler1).getPriority() < ((EventHandler) eventHandler2).getPriority())
			return -1;
		else if (((EventHandler) eventHandler1).getPriority() == ((EventHandler) eventHandler2).getPriority())
			return 0;
		else
			return 1;
	}
}
