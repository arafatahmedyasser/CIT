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

package com.intellectdesign.canvas.audit.handler;

import java.util.ArrayList;
import java.util.List;

/**
 * This class contains the additional information related to a collection field processing.
 * 
 * @version 1.0
 */
public class AuditFieldCollectionMetrics extends AuditFieldMetrics
{
	/**
	 * Default constructor
	 */
	public AuditFieldCollectionMetrics()
	{
		setType("C");
		setChildren(new ArrayList<AuditFieldMetrics>());
	}

	/**
	 * This method is used to get oldCount
	 * 
	 * @return int oldCount
	 */
	public final int getOldCount()
	{
		return oldCount;
	}

	/**
	 * This method is used to set oldCount
	 * 
	 * @param oldCount the oldCount to set
	 */
	public final void setOldCount(int oldCount)
	{
		this.oldCount = oldCount;
	}

	/**
	 * This method is usd to get newCount
	 * 
	 * @return int newCount
	 */
	public final int getNewCount()
	{
		return newCount;
	}

	/**
	 * This method is used to set newCount
	 * 
	 * @param newCount the newCount to set
	 */
	public final void setNewCount(int newCount)
	{
		this.newCount = newCount;
	}

	/**
	 * This method is used to get numAdditions
	 * 
	 * @return the numAdditions
	 */
	public final int getNumAdditions()
	{
		return numAdditions;
	}

	/**
	 * This method is used to set numAdditions
	 * 
	 * @param numAdditions the numAdditions to set
	 */
	public final void setNumAdditions(int numAdditions)
	{
		this.numAdditions = numAdditions;
	}

	/**
	 * This method is used to get numModifications
	 * 
	 * @return the numModifications
	 */
	public final int getNumModifications()
	{
		return numModifications;
	}

	/**
	 * This method is used to set numModifications
	 * 
	 * @param numModifications the numModifications to set
	 */
	public final void setNumModifications(int numModifications)
	{
		this.numModifications = numModifications;
	}

	/**
	 * This method is used to get numDeletions
	 * 
	 * @return the numDeletions
	 */
	public final int getNumDeletions()
	{
		return numDeletions;
	}

	/**
	 * This method is used to set numDeletions
	 * 
	 * @param numDeletions the numDeletions to set
	 */
	public final void setNumDeletions(int numDeletions)
	{
		this.numDeletions = numDeletions;
	}

	/**
	 * This method is used to get list of children
	 * 
	 * @return the children
	 */
	public final List<AuditFieldMetrics> getChildren()
	{
		return children;
	}

	/**
	 * This method is used to set children
	 * 
	 * @param children the children to set
	 */
	public final void setChildren(List<AuditFieldMetrics> children)
	{
		this.children = children;
	}

	/**
	 * This method is used to convert oldcount,newcount,childen to string
	 * 
	 * @return String
	 * @see com.intellectdesign.canvas.audit.handler.AuditFieldMetrics#toString()
	 */
	public String toString()
	{
		return new StringBuffer(super.toString()).append("$oldCount=").append(oldCount).append("$newCount=")
				.append(newCount).append("$Children=").append(children).toString();
	}

	private int oldCount = 0;
	private int newCount = 0;
	private int numAdditions = 0;
	private int numModifications = 0;
	private int numDeletions = 0;
	private List<AuditFieldMetrics> children;
}
