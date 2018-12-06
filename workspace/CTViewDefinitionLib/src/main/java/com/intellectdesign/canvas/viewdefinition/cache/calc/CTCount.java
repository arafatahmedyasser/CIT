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

package com.intellectdesign.canvas.viewdefinition.cache.calc;

import net.sf.ehcache.search.Attribute;
import net.sf.ehcache.search.aggregator.AggregatorException;
import net.sf.ehcache.search.aggregator.AggregatorInstance;

/**
 * Counts the number of results
 * 
 * @version 1.0
 */
public class CTCount implements AggregatorInstance<Integer>
{

	private int count;

	/**
	 * this is ref CTCount values
	 * 
	 * @returncount {@inheritDoc}
	 */
	public CTCount createClone()
	{
		return new CTCount();
	}

	/**
	 * this is ref Accept Obj
	 * 
	 * @exception AggregatorException {@inheritDoc}
	 */
	public void accept(Object input) throws AggregatorException
	{
		count++;
	}

	/**
	 * this is ref to Integer AggregateResult
	 * 
	 * @return count {@inheritDoc}
	 */
	public Integer aggregateResult()
	{
		return count;
	}

	/**
	 * this is ref Attribue
	 * 
	 * @return {@inheritDoc}
	 */
	public Attribute<?> getAttribute()
	{
		return null;
	}

}
