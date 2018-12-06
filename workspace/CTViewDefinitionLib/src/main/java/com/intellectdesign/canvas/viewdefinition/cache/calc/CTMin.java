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
 * Determine the minimum value
 * 
 * @param <T>
 * 
 * @version 1.0
 */
public class CTMin<T> implements AggregatorInstance<T>
{

	private Comparable min;
	private final Attribute<?> attribute;

	/**
	 * this is ref CTMIN Attribue
	 * 
	 * @param attribute
	 */
	public CTMin(Attribute<?> attribute)
	{
		this.attribute = attribute;
	}

	/**
	 * this is ref CTmin {@inheritDoc}
	 */
	public CTMin<T> createClone()
	{
		return new CTMin(attribute);
	}

	/**
	 * this isref to T aggregateResult
	 * 
	 * @return t {@inheritDoc}
	 *         <p/>
	 *         NOTE: May return null if no input provided
	 */
	public T aggregateResult()
	{
		return (T) min;

	}

	/**
	 * this is ref to Accept Obj
	 * 
	 * @return
	 * @exception Aggregation {@inheritDoc}
	 *                <p/>
	 *                NOTE: null input values are ignored
	 */
	public void accept(Object input) throws AggregatorException
	{
		if (input == null)
		{
			return;
		}

		Comparable next = getComparable(input);

		if (min == null)
		{
			min = next;
		} else if (next.compareTo(min) < 0)
		{
			min = next;
		}
	}

	/**
	 * ref to Comparable Obj
	 * 
	 * @param o
	 * @return
	 */
	private static Comparable getComparable(Object o)
	{
		if (o instanceof Comparable)
		{
			return (Comparable) o;
		}

		throw new AggregatorException("Value is not Comparable: " + o.getClass());
	}

	/**
	 * this is ref to getAttribue
	 * 
	 * @return attribute {@inheritDoc}
	 */
	public Attribute getAttribute()
	{
		return attribute;
	}
}
