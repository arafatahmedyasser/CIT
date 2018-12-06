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

import java.util.ArrayList;
import java.util.List;

/**
 * ref to Grouping Columns This Value Object holds the information of grouping columns.
 * 
 * @version 1.0
 */
public class GroupingModel implements Cloneable
{

	List<?> groupedColumn = null;

	List<?> summaryDefinition = null;

	/**
	 * ref to Get SummaryDefintion
	 * 
	 * @return the summaryDefinition
	 */
	public List<?> getSummaryDefinition()
	{
		return summaryDefinition;
	}

	/**
	 * ref to Set SummaryDefintionList
	 * 
	 * @param summaryDefinition the summaryDefinition to set
	 */
	public void setSummaryDefinition(List<?> summaryDefinition)
	{
		this.summaryDefinition = summaryDefinition;
	}

	/**
	 * ref to List GetGroupCol
	 * 
	 * @return the groupedColumn
	 */
	public List<?> getGroupedColumn()
	{
		return groupedColumn;
	}

	/**
	 * ref to SetGroupCol
	 * 
	 * @param groupedColumn the groupedColumn to set
	 */
	public void setGroupedColumn(List<?> groupedColumn)
	{
		this.groupedColumn = groupedColumn;

	}

	/**
	 * Override the base class implementation to return a proper clone of this object.
	 * 
	 * @exception CloneNotSupportedException
	 * @retun clonedGM
	 * @see java.lang.Object#clone()
	 */
	public Object clone() throws CloneNotSupportedException
	{
		GroupingModel clonedGM = (GroupingModel) super.clone();

		List gpcol = new ArrayList();

		ColumnDefinition aColumn = null;

		for (int k = 0; clonedGM.getGroupedColumn() != null && k < clonedGM.getGroupedColumn().size(); k++)
		{

			aColumn = (ColumnDefinition) clonedGM.getGroupedColumn().get(k);

			gpcol.add(aColumn);
		}

		clonedGM.setGroupedColumn(gpcol);

		List smcol = new ArrayList();

		SummaryDefinition sumDef = null;

		for (int k = 0; clonedGM.getSummaryDefinition() != null && k < clonedGM.getSummaryDefinition().size(); k++)
		{

			sumDef = (SummaryDefinition) clonedGM.getSummaryDefinition().get(k);

			smcol.add(sumDef);
		}

		clonedGM.setSummaryDefinition(smcol);

		return clonedGM;

	}

}
