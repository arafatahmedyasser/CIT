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

import java.math.BigDecimal;

import net.sf.ehcache.search.Attribute;
import net.sf.ehcache.search.aggregator.AggregatorException;
import net.sf.ehcache.search.aggregator.AggregatorInstance;

/**
 * Sum can be used with most numeric types Sums the results
 * 
 * @version 1.0
 */
public class CTSum implements AggregatorInstance<Long>
{

	private final Attribute<?> attribute;

	private Engine engine;

	/**
	 * ref to CTSum
	 * 
	 * @param attribute
	 */
	public CTSum(Attribute<?> attribute)
	{
		this.attribute = attribute;
	}

	/**
	 * ref to method CTSum CreateClone
	 * 
	 * @return attribute {@inheritDoc}
	 */
	public CTSum createClone()
	{
		return new CTSum(attribute);
	}

	/**
	 * ref to Accept obj
	 * 
	 * @param input
	 * @exception AggregatorException {@inheritDoc}
	 *                <p/>
	 *                NOTE: null inputs are ignored
	 */
	public void accept(Object input) throws AggregatorException
	{
		if (input == null)
		{
			return;
		}

		if (input instanceof Number)
		{
			if (engine == null)
			{
				engine = Engine.create((Number) input);
			} else
			{
				engine.accept((Number) input);
			}
		} else
		{
			throw new AggregatorException("Non-number type encounted: " + input.getClass());
		}
	}

	/**
	 * ref to Num result to Aggregate {@inheritDoc}
	 * 
	 * @return result
	 *         <p/>
	 *         NOTE: May return null if no input supplied
	 */
	public Number aggregateResult()
	{
		if (engine == null)
		{
			return null;
		} else
		{
			return engine.result();
		}
	}

	/**
	 * ref to Attribute
	 * 
	 * @return attribute {@inheritDoc}
	 */
	public Attribute getAttribute()
	{
		return attribute;
	}

	/**
	 * Abstract super-class for all sum calculating engines.
	 */
	abstract static class Engine
	{

		/**
		 * Create a type specific engine using the given initial value.
		 * 
		 * @param value initial value
		 * @return type specific engine
		 */
		static Engine create(Number value)
		{
			if (value instanceof Float)
			{
				return new FloatEngine(value.floatValue());
			} else if (value instanceof Double)
			{
				return new DoubleEngine(value.doubleValue());
			} else if (value instanceof BigDecimal)
			{
				return new BigDecimalEngine(new BigDecimal(value.toString()));
			} else
			{
				return new LongEngine(value.longValue());
			}
		}

		/**
		 * Update the engine with the given value.
		 * 
		 * @param input data value
		 */
		abstract void accept(Number input) throws AggregatorException;

		/**
		 * Get the (current) result of this engine.
		 * 
		 * @return engine result
		 */
		abstract Number result();

		/**
		 * A long based summing engine.
		 */
		static class LongEngine extends Engine
		{

			private long sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			LongEngine(long value)
			{
				this.sum = value;
			}

			@Override
			void accept(Number input) throws AggregatorException
			{
				sum += input.longValue();
			}

			@Override
			Number result()
			{
				return Long.valueOf(sum);
			}
		}

		/**
		 * A float based summing engine.
		 */
		static class FloatEngine extends Engine
		{

			private float sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			FloatEngine(float value)
			{
				this.sum = value;
			}

			@Override
			void accept(Number input) throws AggregatorException
			{
				sum += input.floatValue();
			}

			/**
			 * ref to Num Result
			 * 
			 * @return float value
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTSum.Engine#result()
			 */
			@Override
			Number result()
			{
				return Float.valueOf(sum);
			}
		}

		/**
		 * A double based summing engine.
		 */
		static class DoubleEngine extends Engine
		{

			private double sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			DoubleEngine(double value)
			{
				this.sum = value;
			}

			/**
			 * ref to Num Accept
			 * 
			 * @param input
			 * @throws AggregatorException
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTSum.Engine#accept(java.lang.Number)
			 */
			@Override
			void accept(Number input) throws AggregatorException
			{
				sum += input.doubleValue();
			}

			/**
			 * ref to Num result
			 * 
			 * @return double value
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTSum.Engine#result()
			 */
			@Override
			Number result()
			{
				return Double.valueOf(sum);
			}
		}

		/**
		 * A bigdecimal based summing engine.
		 */
		static class BigDecimalEngine extends Engine
		{

			private BigDecimal sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			BigDecimalEngine(BigDecimal value)
			{
				this.sum = value;
			}

			/**
			 * ref to AcceptNum
			 * 
			 * @param input
			 * @throws AggregatorException
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTSum.Engine#accept(java.lang.Number)
			 */
			@Override
			void accept(Number input) throws AggregatorException
			{
				// sum += input.doubleValue();
				sum = sum.add(new BigDecimal(input.toString()));
			}

			/**
			 * ref to Num Result
			 * 
			 * @return sum
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTSum.Engine#result()
			 */
			Number result()
			{
				return sum;
			}
		}

	}
}
