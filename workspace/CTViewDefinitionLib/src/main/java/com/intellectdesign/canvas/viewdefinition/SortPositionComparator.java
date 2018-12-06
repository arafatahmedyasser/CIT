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
 * This class is for sorting the position implements comparator and serializable interfaces
 * 
 * @version 1.0
 */
public class SortPositionComparator implements Comparator, Serializable
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -8542011824391152536L;

	/**
	 * Lesser the integer value of the sort position, the larger the priority.
	 * 
	 * @param Obj SortDet1,2
	 * 
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(Object sortDefinition1, Object sortDefinition2)
	{
		if (((SortDefinition) sortDefinition1).getSortPosition() < ((SortDefinition) sortDefinition2).getSortPosition())
			return -1;

		else if (((SortDefinition) sortDefinition1).getSortPosition() == ((SortDefinition) sortDefinition2)
				.getSortPosition())
			return 0;

		else
			return 1;
	}

}
