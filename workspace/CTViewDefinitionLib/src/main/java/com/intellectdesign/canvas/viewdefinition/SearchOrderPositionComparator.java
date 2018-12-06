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
 * This is the comparator used for sorting a list of column definitions based on search order
 * 
 * @version 1.0
 */
public class SearchOrderPositionComparator implements Serializable, Comparator
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -7057220579296767627L;

	/**
	 * Comparison done based on Search Order,
	 * 
	 * @param obj ColDef1,2
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(Object columnDefinition1, Object columnDefinition2)
	{
		if (((ColumnDefinition) columnDefinition1).getSearchOrder() < ((ColumnDefinition) columnDefinition2)
				.getSearchOrder())
			return -1;

		else if (((ColumnDefinition) columnDefinition1).getSearchOrder() == ((ColumnDefinition) columnDefinition2)
				.getSearchOrder())
			return 0;

		else
			return 1;
	}

}
