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
 * Determine the maximum value
 * 
 * @param <T>
 * 
 * @version 1.0
 */
public class CTMax<T> implements AggregatorInstance<T>
{

	private Comparable max;
	private final Attribute<?> attribute;

	/**
	 * this is ref to CTMax Attribute
	 * 
	 * @param attribute
	 */
	public CTMax(Attribute<?> attribute)
	{
		this.attribute = attribute;
	}

	/**
	 * this is ref CTMax
	 * 
	 * @return max {@inheritDoc}
	 */
	public CTMax<T> createClone()
	{
		return new CTMax(attribute);
	}

	/**
	 * ref to T AggregateResult
	 * 
	 * @return max t {@inheritDoc}
	 *         <p/>
	 *         NOTE: May return null if no input provided
	 */
	public T aggregateResult()
	{
		return (T) max;

	}

	/**
	 * this is ref to accept Obj
	 * 
	 * @exception Aggreagation
	 * @return {@inheritDoc}
	 *         <p/>
	 *         NOTE: null input values are ignored
	 */
	public void accept(Object input) throws AggregatorException
	{
		if (input == null)
		{
			return;
		}

		Comparable next = getComparable(input);

		if (max == null)
		{
			max = next;
		} else if (next.compareTo(max) > 0)
		{
			max = next;
		}
	}

	/**
	 * ref to Static comparable
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
	 * this is ref getAttribute
	 * 
	 * @return attribute {@inheritDoc}
	 */
	public Attribute getAttribute()
	{
		return attribute;
	}

}
