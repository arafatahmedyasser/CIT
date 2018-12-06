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
import net.sf.ehcache.search.aggregator.Aggregator;
import net.sf.ehcache.search.aggregator.AggregatorInstance;

/**
 * Helper class to construct the CT aggregator types. These methods can be statically imported to make query building
 * for the aggregator functionalities.
 * 
 * @version 1.0
 */
public final class CTAggregators
{

	private CTAggregators()
	{

	}

	/**
	 * Construct a minimum value aggregator
	 * 
	 * @param attribute
	 * @return min aggregator
	 */
	public static Aggregator min(final Attribute<?> attribute)
	{
		return new Aggregator()
		{
			public <T> AggregatorInstance<T> createInstance()
			{
				return new CTMin(attribute);
			}
		};
	}

	/**
	 * Construct a maximum value aggregator
	 * 
	 * @param attribute
	 * @return max aggregator
	 */
	public static Aggregator max(final Attribute<?> attribute)
	{
		return new Aggregator()
		{
			public <T> AggregatorInstance<T> createInstance()
			{
				return new CTMax(attribute);
			}
		};
	}

	/**
	 * Construct an average value aggregator
	 * 
	 * @param attribute
	 * @return average aggregator
	 */
	public static Aggregator average(final Attribute<?> attribute)
	{
		return new Aggregator()
		{
			public AggregatorInstance<Double> createInstance()
			{
				return new CTAverage(attribute);
			}
		};
	}

	/**
	 * Construct a sum aggregator
	 * 
	 * @param attribute
	 * @return sum aggregator
	 */
	public static Aggregator sum(final Attribute<?> attribute)
	{
		return new Aggregator()
		{
			public AggregatorInstance<Long> createInstance()
			{
				return new CTSum(attribute);
			}
		};
	}

	/**
	 * Construct a counting aggregator
	 * 
	 * @return count aggregator
	 */
	public static Aggregator count()
	{
		return new Aggregator()
		{
			public AggregatorInstance<Integer> createInstance()
			{
				return new CTCount();
			}
		};

	}
}
