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
 */
package com.intellectdesign.canvas.report.util;

import java.io.Serializable;
import java.util.Comparator;

import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;

/**
 * This class used for compare the ReportColumnDefinition class Object based on the sort-by position.
 * 
 * @version 1.0
 */


public class SortByColComparator implements Comparator, Serializable
{
	/**
	 * Serial Version UID
	 */
	private static final long serialVersionUID = 480254054897321946L;

	/**
	 * This method used to compare the sort-by columns based on its sort-by position.
	 * 
	 * @param o1
	 * @param o2
	 * @return
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(Object o1, Object o2)
	{
		ReportColumnDefinition reportColDef1 = (ReportColumnDefinition) o1;
		ReportColumnDefinition reportColDef2 = (ReportColumnDefinition) o2;
		return reportColDef1.getSortPosition() - reportColDef2.getSortPosition();
	}
}