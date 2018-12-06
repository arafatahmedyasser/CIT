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

package com.intellectdesign.canvas.viewdefinition;

import java.io.Serializable;
import java.util.Comparator;

/**
 * This class is used to sort a list of Column Definitions based on the Group Position indicator
 * 
 * @version 1.0
 */
public class ColumnGroupComparator implements Comparator, Serializable
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 4143188719031493241L;

	/**
	 * This method is triggered by the Collections.sort to order the data Here we order the data by the Group Position
	 * 
	 * @param Obj 01,02,
	 * @return
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(Object o1, Object o2)
	{
		ColumnDefinition col1 = (ColumnDefinition) o1;
		ColumnDefinition col2 = (ColumnDefinition) o2;
		if (col1.getGroupPosition() < col2.getGroupPosition())
			return -1;
		else if (col1.getGroupPosition() == col2.getGroupPosition())
			return 0;
		else
			return 1;
	}
}
